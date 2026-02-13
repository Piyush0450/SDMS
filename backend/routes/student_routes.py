from flask import Blueprint, jsonify
from database.connection import SessionLocal
from models.models import Student, Attendance, Marks, Subject
from sqlalchemy import select

bp = Blueprint('student', __name__, url_prefix='/api/student')

@bp.get('/<string:uid>/profile')
def profile(uid):
    with SessionLocal() as db:
        from sqlalchemy import func
        s = db.scalar(select(Student).where(func.lower(Student.u_id) == uid.lower()))
        if not s: return jsonify({'error': 'Not found'}), 404
        # Return u_id from DB to ensure correct casing
        return jsonify({'u_id': s.u_id, 'name': s.name, 'email': s.email, 'phone': s.phone, 'dob': str(s.dob)})

@bp.get('/<string:uid>/attendance')
def my_attendance(uid):
    with SessionLocal() as db:
        from sqlalchemy import func
        # First resolve the correct UID from DB to ensure foreign key matches if sensitive
        student = db.scalar(select(Student).where(func.lower(Student.u_id) == uid.lower()))
        if not student: return jsonify([])
        
        real_uid = student.u_id
        rows = db.scalars(select(Attendance).where(Attendance.student_id == real_uid)).all()
        res = []
        for r in rows:
            sub = db.get(Subject, r.subject_id)
            res.append({
                'date': str(r.date),
                'subject': sub.subject_name if sub else 'Unknown',
                'status': r.status
            })
        return jsonify(res)

@bp.get('/<string:uid>/results')
def my_marks(uid):
    with SessionLocal() as db:
        from sqlalchemy import func
        student = db.scalar(select(Student).where(func.lower(Student.u_id) == uid.lower()))
        if not student: return jsonify([])
        
        real_uid = student.u_id
        rows = db.scalars(select(Marks).where(Marks.student_id == real_uid)).all()
        res = []
        for r in rows:
            sub = db.get(Subject, r.subject_id)
            res.append({
                'subject': sub.subject_name if sub else 'Unknown',
                'obtained': r.marks_obtained,
                'max': r.max_marks
            })
        return jsonify(res)
