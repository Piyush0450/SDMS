from flask import Blueprint, jsonify, request
from database.connection import SessionLocal
from models.models import Faculty, Student, Subject, Attendance, Marks
from sqlalchemy import select, and_

bp = Blueprint('faculty', __name__, url_prefix='/api/faculty')

@bp.post('/attendance')
def mark_attendance():
    data = request.get_json()
    # { faculty_id, subject_id, date, statusMap: { student_uid: status } }
    
    with SessionLocal() as db:
        fid = data.get('faculty_id')
        sub_id = data.get('subject_id')
        date_str = data.get('date')
        
        from datetime import datetime, date
        try:
            att_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid date format'}), 400
             
        today = date.today()
        if att_date > today:
            return jsonify({'error': 'Cannot mark attendance for a future date'}), 400

        for sid, status in data.get('statusMap', {}).items():
            # Upsert logic could go here, for now simple add
            # Check existing
            exists = db.scalar(select(Attendance).where(
                and_(Attendance.student_id == sid, Attendance.subject_id == sub_id, Attendance.date == att_date)
            ))
            if exists:
                # User Requirement: "Once attendance marks then no changement allowed"
                # If trying to change status?
                if exists.status != status:
                    return jsonify({'error': f'Attendance already marked for {sid}. Updates not allowed.'}), 400
            else:
                db.add(Attendance(
                    student_id=sid,
                    faculty_id=fid,
                    subject_id=sub_id,
                    date=att_date,
                    status=status
                ))
        db.commit()
        return jsonify({'ok': True})

@bp.get('/attendance')
def get_attendance():
    # Query: ?subject_id=X&date=Y
    sub_id = request.args.get('subject_id')
    date_str = request.args.get('date')
    
    if not sub_id or not date_str:
        return jsonify({'error': 'Missing subject_id or date'}), 400
        
    with SessionLocal() as db:
        from datetime import datetime
        try:
            att_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
            
        records = db.scalars(select(Attendance).where(
            and_(Attendance.subject_id == sub_id, Attendance.date == att_date)
        )).all()
        
        # Return map: { student_uid: status }
        return jsonify({r.student_id: r.status for r in records})

@bp.post('/results')
def upload_marks():
    data = request.get_json()
    # { faculty_id, subject_id, marksMap: { student_uid: marks }, max_marks }

    with SessionLocal() as db:
        fid = str(data.get('faculty_id'))
        try:
            sub_id = int(data.get('subject_id'))
        except (ValueError, TypeError):
             return jsonify({'error': 'Invalid Subject ID'}), 400
        max_m = float(data.get('max_marks', 100))

        print(f"DEBUG: Processing marks upload. Faculty: {fid}, Subject: {sub_id}, MarksMap: {data.get('marksMap')}")
        for sid, val in data.get('marksMap', {}).items():
            try:
                mark_val = float(val)
            except (ValueError, TypeError):
                print(f"DEBUG: Skipping Student {sid} due to invalid mark value: {val}")
                return jsonify({'error': f'Invalid marks for student {sid}'}), 400
            
            # Validation: 0 to 100
            if mark_val < 0 or mark_val > 100:
                return jsonify({'error': f'Marks must be between 0 and 100 (Student {sid})'}), 400

            print(f"DEBUG: Upserting for Student {sid} with Value {mark_val}")
            # Upsert
            exists = db.scalar(select(Marks).where(
                and_(Marks.student_id == sid, Marks.subject_id == sub_id)
            ))
            if exists:
                # User Requirement: "Once a recorded related to a person is entered then again entering different value not accepted"
                if exists.marks_obtained != mark_val:
                     return jsonify({'error': f'Marks already entered for {sid}. Updates not allowed.'}), 400
            else:
                print("DEBUG: Creating new record")
                db.add(Marks(
                    student_id=sid,
                    faculty_id=fid,
                    subject_id=sub_id,
                    marks_obtained=mark_val,
                    max_marks=max_m
                ))
        print("DEBUG: Committing to DB")
        db.commit()
        return jsonify({'ok': True})
