from flask import Blueprint, jsonify, g
from database.connection import SessionLocal
from models.models import Student, Attendance, Marks, Subject
from sqlalchemy import select, func
from decorators import student_required

bp = Blueprint('student', __name__, url_prefix='/api/student')

@bp.get('/<string:uid>/profile')
@student_required
def profile(uid):
    # Ensure students can only view their own profile? 
    # The requirement didn't specify strict profile restrictions but `g.user_id` should be used.
    # Requirement 1 was Admin viewing student.
    if uid != g.user_id:
        return jsonify({'ok': False, 'error': 'Unauthorized access to another profile'}), 403

    with SessionLocal() as db:
        s = db.scalar(select(Student).where(func.lower(Student.u_id) == uid.lower()))
        if not s: return jsonify({'ok': False, 'error': 'Not found'}), 404
        return jsonify({
            'ok': True,
            'data': {
                'u_id': s.u_id, 
                'name': s.name, 
                'email': s.email, 
                'phone': s.phone, 
                'dob': str(s.dob),
                'created_at': str(s.created_at) if s.created_at else None
            }
        })

# 2. Student View Own Marks
@bp.get('/results')
@student_required
def my_marks():
    uid = g.user_id # From token
    with SessionLocal() as db:
        # Verify student exists
        student = db.scalar(select(Student).where(Student.u_id == uid))
        if not student: return jsonify({'ok': False, 'error': 'Student not found'}), 404
        
        rows = db.scalars(select(Marks).where(Marks.student_id == uid)).all()
        
        # Calculate subject-wise marks + percentage
        res = []
        total_obtained = 0
        total_max = 0
        
        for r in rows:
            sub = db.get(Subject, r.subject_id)
            percentage = (r.marks_obtained / r.max_marks * 100) if r.max_marks > 0 else 0
            
            res.append({
                'subject': sub.subject_name if sub else 'Unknown',
                'subject_id': r.subject_id,
                'obtained': r.marks_obtained,
                'max': r.max_marks,
                'percentage': round(percentage, 2)
            })
            total_obtained += r.marks_obtained
            total_max += r.max_marks
            
        overall_percentage = (total_obtained / total_max * 100) if total_max > 0 else 0
        
        return jsonify({
            'ok': True,
            'data': res,
            'overall_percentage': round(overall_percentage, 2)
        })

# 3. Student View Attendance Percentage
@bp.get('/attendance/summary')
@student_required
def attendance_summary():
    uid = g.user_id
    with SessionLocal() as db:
        # Get all attendance records for this student
        records = db.scalars(select(Attendance).where(Attendance.student_id == uid)).all()
        
        # Group by subject
        subject_stats = {}
        # We also need to know the total classes held for each subject to be accurate, 
        # but usually "percentage" is based on (Present / (Present + Absent)) * 100 
        # OR (Present / Total Classes Held Global).
        # Requirement: "Calculate subject-wise attendance percentage"
        # I'll use the records present for the student (Present / (Present+Absent)) for now as it's self-contained.
        
        for r in records:
            if r.subject_id not in subject_stats:
                subject_stats[r.subject_id] = {'present': 0, 'total': 0, 'subject_name': 'Unknown'}
                # Fetch name if not cached (inefficient in loop but simple)
                sub = db.get(Subject, r.subject_id)
                if sub: subject_stats[r.subject_id]['subject_name'] = sub.subject_name
            
            subject_stats[r.subject_id]['total'] += 1
            if r.status == 'present':
                subject_stats[r.subject_id]['present'] += 1
        
        summary = []
        for sid, stats in subject_stats.items():
            pct = (stats['present'] / stats['total'] * 100) if stats['total'] > 0 else 0
            summary.append({
                'subject': stats['subject_name'],
                'total_classes_attended': stats['total'], # or recorded
                'present': stats['present'],
                'percentage': round(pct, 2)
            })
            
        return jsonify({
            'ok': True,
            'data': summary
        })

# Legacy /attendance endpoint if needed for calendar view (kept for compatibility if used)
@bp.get('/<string:uid>/attendance')
@student_required
def my_attendance_list(uid):
    if uid != g.user_id: return jsonify({'ok': False, 'error': 'Unauthorized'}), 403
    with SessionLocal() as db:
        rows = db.scalars(select(Attendance).where(Attendance.student_id == uid)).all()
        res = []
        for r in rows:
            sub = db.get(Subject, r.subject_id)
            res.append({
                'date': str(r.date),
                'subject': sub.subject_name if sub else 'Unknown',
                'status': r.status
            })
        return jsonify(res)
