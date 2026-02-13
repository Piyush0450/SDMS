from flask import Blueprint, jsonify
from database.connection import SessionLocal
from models.models import Admin, Faculty, Student, Subject, Attendance, Marks
from sqlalchemy import select, func

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@bp.get('/admin/stats')
def admin_stats():
    with SessionLocal() as db:
        faculty_count = db.scalar(select(func.count(Faculty.u_id)))
        student_count = db.scalar(select(func.count(Student.u_id)))
        subject_count = db.scalar(select(func.count(Subject.subject_id)))
        
        return jsonify({
            'faculty': faculty_count,
            'students': student_count,
            'subjects': subject_count,
            'label': 'System Overview'
        })

@bp.get('/faculty/<string:uid>/stats')
def faculty_stats(uid):
    with SessionLocal() as db:
        # Resolve UID
        fac = db.scalar(select(Faculty).where(func.lower(Faculty.u_id) == uid.lower()))
        real_uid = fac.u_id if fac else uid

        # Count students in class (mocked as total students for now as classes are removed)
        student_count = db.scalar(select(func.count(Student.u_id)))
        
        # Count classes taken (mocked as count of attendance records by this faculty)
        classes_taken = db.scalar(select(func.count(Attendance.id)).where(Attendance.faculty_id == real_uid)) or 0
        
        return jsonify({
            'students': student_count,
            'classes_taken': classes_taken,
            'label': 'Faculty Overview'
        })

@bp.get('/student/<string:uid>/stats')
def student_stats(uid):
    with SessionLocal() as db:
        # Resolve UID
        stu = db.scalar(select(Student).where(func.lower(Student.u_id) == uid.lower()))
        real_uid = stu.u_id if stu else uid

        # Calculate attendance %
        total_attendance = db.scalar(select(func.count(Attendance.id)).where(Attendance.student_id == real_uid)) or 0
        present_count = db.scalar(select(func.count(Attendance.id)).where(Attendance.student_id == real_uid, Attendance.status.in_(['present', 'Late']))) or 0
        
        attendance_pct = (present_count / total_attendance * 100) if total_attendance > 0 else 0
        
        # Average marks (Mock logic: average of marks_obtained)
        avg_marks = db.scalar(select(func.avg(Marks.marks_obtained)).where(Marks.student_id == real_uid)) or 0
        
        return jsonify({
            'attendance': round(attendance_pct, 1),
            'avg_marks': round(avg_marks, 1),
            'label': 'Performance'
        })
