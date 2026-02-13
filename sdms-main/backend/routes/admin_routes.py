from flask import Blueprint, jsonify, request, g
from database.connection import SessionLocal
from models.models import Admin, Faculty, Student, Subject, Attendance, Marks, AuditLog
from sqlalchemy import select, func, and_
import bcrypt
import datetime
import io
import csv
from flask import Response

# NEW: Use valid decorators
from decorators import admin_required
from utils.validators import validate_id, validate_name, validate_email, validate_phone, validate_dob

bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def hash_pw(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# ---------------------------------------------------------
# STUDENT MANAGEMENT (Single & All View)
# ---------------------------------------------------------

@bp.get('/students')
@admin_required
def list_students():
    """Get all students (Summary View)."""
    with SessionLocal() as db:
        rows = db.scalars(select(Student)).all()
        return jsonify([{'u_id': r.u_id, 'name': r.name, 'email': r.email, 'phone': r.phone, 'dob': str(r.dob), 'status': r.status, 'created_at': str(r.created_at) if r.created_at else None} for r in rows])

@bp.get('/students/<string:uid>')
@admin_required
def get_student(uid):
    """Get full details of a single student by UID."""
    with SessionLocal() as db:
        # Case insensitive search
        student = db.scalar(select(Student).where(func.lower(Student.u_id) == uid.lower()))
        
        if not student:
            return jsonify({'ok': False, 'error': 'Student not found'}), 404
            
        return jsonify({
            'ok': True,
            'data': {
                'u_id': student.u_id,
                'name': student.name,
                'email': student.email,
                'phone': student.phone,
                'dob': str(student.dob),
                'created_at': str(student.created_at) if student.created_at else None,
                'status': student.status,
                'blocked_reason': student.blocked_reason,
                'blocked_by': student.blocked_by,
                'blocked_at': str(student.blocked_at) if student.blocked_at else None
            }
        })

@bp.post('/students')
@admin_required
def add_student():
    data = request.get_json()
    with SessionLocal() as db:
        try:
            if db.query(Student).filter(Student.u_id == data['u_id']).first():
                 return jsonify({'error': 'ID exists'}), 400

            is_valid, msg = validate_id(data['u_id'], 'student')
            if not is_valid: return jsonify({'error': msg}), 400
            
            # Additional validation
            if 'name' not in data: return jsonify({'error': 'Name is required'}), 400
            is_valid, msg = validate_name(data['name'])
            if not is_valid: return jsonify({'error': msg}), 400
            
            if 'email' not in data: return jsonify({'error': 'Email is required'}), 400
            is_valid, msg = validate_email(data['email'])
            if not is_valid: return jsonify({'error': msg}), 400

            s = Student(
                u_id=data['u_id'],
                name=data['name'].upper(),
                email=data['email'],
                phone=data.get('phone'),
                dob=datetime.datetime.strptime(data['dob'], '%Y-%m-%d').date(),
                password=hash_pw(data['dob']),
                created_at=datetime.date.today(),
                status='active'
            )
            db.add(s)
            db.commit()
            return jsonify({'ok': True})
        except Exception as e:
            return jsonify({'error': f'Error: {str(e)}'}), 500

@bp.delete('/students/<string:uid>')
@admin_required
def delete_student(uid):
    with SessionLocal() as db:
        s = db.scalar(select(Student).where(Student.u_id == uid))
        if s: db.delete(s); db.commit(); return jsonify({'ok': True})
        return jsonify({'error': 'Not found'}), 404

# ---------------------------------------------------------
# FACULTY MANAGEMENT
# ---------------------------------------------------------

@bp.get('/faculty')
@admin_required
def list_faculty():
    with SessionLocal() as db:
        rows = db.scalars(select(Faculty)).all()
        return jsonify([{'u_id': r.u_id, 'name': r.name, 'email': r.email, 'phone': r.phone, 'dob': str(r.dob), 'status': r.status} for r in rows])

@bp.post('/faculty')
@admin_required
def add_faculty():
    data = request.get_json()
    with SessionLocal() as db:
        try:
            if db.query(Faculty).filter(Faculty.u_id == data['u_id']).first():
                return jsonify({'error': 'ID exists'}), 400
            
            # Validation logic...
            is_valid, msg = validate_id(data['u_id'], 'faculty')
            if not is_valid: return jsonify({'error': msg}), 400
            
            f = Faculty(
                u_id=data['u_id'],
                name=data['name'].upper(),
                email=data['email'],
                phone=data.get('phone'),
                dob=datetime.datetime.strptime(data['dob'], '%Y-%m-%d').date(),
                password=hash_pw(data['dob']), # Password is DOB
                status='active'
            )
            db.add(f)
            db.commit()
            return jsonify({'ok': True})
        except Exception as e:
            return jsonify({'error': f'Error: {str(e)}'}), 500

@bp.delete('/faculty/<string:uid>')
@admin_required
def delete_faculty(uid):
    with SessionLocal() as db:
        f = db.scalar(select(Faculty).where(Faculty.u_id == uid))
        if f: db.delete(f); db.commit(); return jsonify({'ok': True})
        return jsonify({'error': 'Not found'}), 404

# ---------------------------------------------------------
# SUBJECT MANAGEMENT
# ---------------------------------------------------------

@bp.get('/subjects')
@admin_required
def list_subjects():
    with SessionLocal() as db:
        rows = db.scalars(select(Subject)).all()
        return jsonify([{'id': r.subject_id, 'name': r.subject_name} for r in rows])

@bp.post('/subjects')
@admin_required
def add_subject():
    data = request.get_json()
    with SessionLocal() as db:
        if db.scalar(select(Subject).where(Subject.subject_name == data['name'])):
             return jsonify({'error': 'Subject exists'}), 400
        s = Subject(subject_name=data['name'])
        db.add(s)
        db.commit()
        return jsonify({'ok': True})

# ---------------------------------------------------------
# ADMIN MANAGEMENT
# ---------------------------------------------------------

@bp.get('/admins')
@admin_required
def list_admins():
    # Only super_admin should see this? logic in decorators handles role check, 
    # but regular admin can see list is ok?
    with SessionLocal() as db:
        rows = db.scalars(select(Admin)).all()
        return jsonify([{'u_id': r.u_id, 'name': r.name, 'type': r.admin_type, 'email': r.email, 'status': r.status} for r in rows])

@bp.post('/admins')
@admin_required
def add_admin():
    # Only super admin can add admins? Decorator allows admin/super_admin. 
    # Strict requirement: "Active / Deactivate User API ... Access: Admin and Super Admin"
    # But adding admin might be restricted. Assuming allowed for now.
    data = request.get_json()
    with SessionLocal() as db:
        if db.query(Admin).filter(Admin.email == data['email']).first(): return jsonify({'error': 'Email exists'}), 400
        
        try:
             a = Admin(
                u_id=data['u_id'],
                name=data['name'].upper(),
                admin_type=data.get('type', 'normal'),
                email=data['email'],
                phone=data.get('phone'),
                dob=datetime.datetime.strptime(data['dob'], '%Y-%m-%d').date(),
                password=hash_pw(data['dob']),
                status='active'
            )
             db.add(a)
             db.commit()
             return jsonify({'ok': True})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

# ---------------------------------------------------------
# DASHBOARD & STATUS
# ---------------------------------------------------------

@bp.get('/dashboard')
@admin_required
def get_dashboard_summary():
    with SessionLocal() as db:
        total_students = db.scalar(select(func.count(Student.u_id)))
        total_faculty = db.scalar(select(func.count(Faculty.u_id)))
        total_subjects = db.scalar(select(func.count(Subject.subject_id)))
        total_admins = db.scalar(select(func.count(Admin.u_id)))
        
        # Calculate active/blocked
        # Note: status field exists on all user models
        active_students = db.scalar(select(func.count(Student.u_id)).where(Student.status == 'active')) or 0
        active_faculty = db.scalar(select(func.count(Faculty.u_id)).where(Faculty.status == 'active')) or 0
        active_admins = db.scalar(select(func.count(Admin.u_id)).where(Admin.status == 'active')) or 0
        
        total_active_users = active_students + active_faculty + active_admins
        
        blocked_students = db.scalar(select(func.count(Student.u_id)).where(Student.status == 'blocked')) or 0
        blocked_faculty = db.scalar(select(func.count(Faculty.u_id)).where(Faculty.status == 'blocked')) or 0
        blocked_admins = db.scalar(select(func.count(Admin.u_id)).where(Admin.status == 'blocked')) or 0
        
        total_blocked_users = blocked_students + blocked_faculty + blocked_admins
        
        return jsonify({
            'total_students': total_students,
            'total_faculty': total_faculty,
            'total_subjects': total_subjects,
            'total_admins': total_admins,
            'total_active_users': total_active_users,
            'total_blocked_users': total_blocked_users
        })

@bp.put('/users/<string:role>/<string:uid>/status')
@admin_required
def update_user_status(role, uid):
    data = request.get_json()
    new_status = data.get('status')
    
    if new_status not in ['active', 'blocked']:
        return jsonify({'ok': False, 'error': 'Invalid status. Use "active" or "blocked".'}), 400

    role = role.lower()
    if role not in ['student', 'faculty', 'admin']:
        return jsonify({'ok': False, 'error': 'Invalid role.'}), 400
        
    # Prevent self-block
    if uid == g.user_id:
        return jsonify({'ok': False, 'error': 'Cannot change your own status'}), 400
        
    # Hierarchy Check
    if g.user_role == 'admin' and role == 'admin':
        return jsonify({'ok': False, 'error': 'Admins cannot change status of other admins'}), 403

    with SessionLocal() as db:
        user = None
        if role == 'student':
            user = db.scalar(select(Student).where(func.lower(Student.u_id) == uid.lower()))
        elif role == 'faculty':
            user = db.scalar(select(Faculty).where(func.lower(Faculty.u_id) == uid.lower()))
        elif role == 'admin':
            user = db.scalar(select(Admin).where(func.lower(Admin.u_id) == uid.lower()))
            # Super Admin Protection
            if user and user.admin_type == 'super':
                # Only if there are other super admins? 
                # Simplification: Cannot block Super Admin via API
                if new_status == 'blocked':
                    return jsonify({'ok': False, 'error': 'Cannot block Super Admin'}), 403
            
        if not user:
            return jsonify({'ok': False, 'error': f'{role.capitalize()} not found.'}), 404
            
        # Update
        user.status = new_status
        if new_status == 'blocked':
            user.blocked_at = datetime.date.today()
            user.blocked_by = g.user_id
            user.blocked_reason = data.get('reason', 'Admin Action')
            
            # Audit Log
            log = AuditLog(actor_id=g.user_id, target_id=uid, action='BLOCK', reason=user.blocked_reason, timestamp=datetime.date.today())
            db.add(log)
        else:
            user.blocked_at = None
            user.blocked_reason = None
            user.unblock_at = None # Clear scheduled unblock if any
            
            log = AuditLog(actor_id=g.user_id, target_id=uid, action='UNBLOCK', timestamp=datetime.date.today())
            db.add(log)
            
        db.commit()
        
        return jsonify({
            'ok': True,
            'message': f'User {uid} status updated to {new_status}.'
        })
        
@bp.get('/users/<string:role>')
@admin_required
def get_users_by_role(role):
    # Fetch list of users by role (Generic)
    with SessionLocal() as db:
        if role == 'faculty': users = db.scalars(select(Faculty)).all()
        elif role == 'student': users = db.scalars(select(Student)).all()
        elif role == 'admin': users = db.scalars(select(Admin)).all()
        else: return jsonify({'error': 'Invalid role'}), 400
        
        return jsonify([{
            'u_id': u.u_id, 'name': u.name, 'email': u.email, 
            'status': u.status if hasattr(u, 'status') else 'active'
        } for u in users])

# ---------------------------------------------------------
# REPORTS
# ---------------------------------------------------------

@bp.get('/reports/attendance')
@admin_required
def get_attendance_report():
     with SessionLocal() as db:
        students = db.scalars(select(Student)).all()
        report = []
        sessions = db.query(Attendance.subject_id, Attendance.date).distinct().all()
        total_classes_held = len(sessions)
        
        for s in students:
            present = db.query(Attendance).filter(Attendance.student_id == s.u_id, Attendance.status == 'present').count()
            absent = db.query(Attendance).filter(Attendance.student_id == s.u_id, Attendance.status == 'absent').count()
            final_total = max(present + absent, total_classes_held)
            percentage = (present / final_total * 100) if final_total > 0 else 0
            
            report.append({
                'u_id': s.u_id, 'name': s.name, 'total_classes': final_total,
                'present': present, 'absent': absent, 'percentage': round(percentage, 2)
            })
        return jsonify(report)

@bp.get('/reports/performance')
@admin_required
def get_performance_report():
    with SessionLocal() as db:
        students = db.scalars(select(Student)).all()
        report = []
        for s in students:
            marks = db.query(Marks).filter(Marks.student_id == s.u_id).all()
            total_obtained = sum(m.marks_obtained for m in marks)
            total_max = sum(m.max_marks for m in marks)
            percentage = (total_obtained / total_max * 100) if total_max > 0 else 0
            
            if percentage >= 90: grade = 'A'
            elif percentage >= 75: grade = 'B'
            elif percentage >= 50: grade = 'C'
            else: grade = 'Fail'
            
            report.append({
                'u_id': s.u_id, 'name': s.name, 'total_obtained': total_obtained,
                'total_max': total_max, 'percentage': round(percentage, 2), 'grade': grade
            })
        return jsonify(report)

@bp.get('/audit-logs')
@admin_required
def get_audit_logs():
    """Fetch all audit logs (Blocking/Unblocking actions)."""
    with SessionLocal() as db:
        logs = db.scalars(select(AuditLog).order_by(AuditLog.timestamp.desc())).all()
        return jsonify([{
            'id': l.id,
            'actor_id': l.actor_id,
            'target_id': l.target_id,
            'action': l.action,
            'reason': l.reason,
            'timestamp': str(l.timestamp)
        } for l in logs])
