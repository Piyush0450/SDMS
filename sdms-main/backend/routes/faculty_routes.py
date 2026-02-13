from flask import Blueprint, jsonify, request, g
from database.connection import SessionLocal
from models.models import Faculty, Student, Subject, Attendance, Marks
from sqlalchemy import select, and_
from decorators import faculty_required
from datetime import datetime

bp = Blueprint('faculty', __name__, url_prefix='/api/faculty')

# ---------------------------------------------------------
# Attendance
# ---------------------------------------------------------
@bp.get('/attendance')
@faculty_required
def get_attendance():
    """
    Get attendance for a specific subject and date.
    Query: ?subject_id=X&date=Y
    """
    sub_id = request.args.get('subject_id')
    date_str = request.args.get('date')
    
    if not sub_id or not date_str:
        return jsonify({'ok': False, 'error': 'Missing subject_id or date'}), 400
        
    with SessionLocal() as db:
        try:
            att_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'ok': False, 'error': 'Invalid date format'}), 400
            
        records = db.scalars(select(Attendance).where(
            and_(Attendance.subject_id == sub_id, Attendance.date == att_date)
        )).all()
        
        # Return map: { student_uid: status }
        return jsonify({r.student_id: r.status for r in records})

@bp.post('/attendance')
@faculty_required
def mark_attendance():
    """
    Mark attendance for students.
    Body: { faculty_id, subject_id, date, statusMap: { student_uid: status } }
    """
    data = request.get_json()
    
    # Requirement: Faculty ID must match logged in user (security check)
    # The frontend might send faculty_id, but we should rely on token
    if str(data.get('faculty_id')) != str(g.user_id):
        return jsonify({'ok': False, 'error': 'Unauthorized: Faculty ID mismatch'}), 403

    with SessionLocal() as db:
        fid = g.user_id
        sub_id = data.get('subject_id')
        date_str = data.get('date')
        
        try:
            att_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except (ValueError, TypeError):
             return jsonify({'ok': False, 'error': 'Invalid date format'}), 400
             
        # Prevent marking future attendance
        if att_date > datetime.today().date():
             return jsonify({'ok': False, 'error': 'Cannot mark attendance for a future date'}), 400

        for sid, status in data.get('statusMap', {}).items():
            # Check existing
            exists = db.scalar(select(Attendance).where(
                and_(Attendance.student_id == sid, Attendance.subject_id == sub_id, Attendance.date == att_date)
            ))
            
            if exists:
                if exists.status != status:
                     return jsonify({'ok': False, 'error': f'Attendance already marked for {sid}. Updates not allowed.'}), 400
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

# ---------------------------------------------------------
# Marks / Results
# ---------------------------------------------------------

# 4. Faculty View Uploaded Marks
@bp.get('/results')
@faculty_required
def get_uploaded_marks():
    """
    Get marks uploaded by the logged-in faculty.
    Query: ?subject_id=<id> (Optional filter)
    """
    subject_id = request.args.get('subject_id')
    faculty_id = g.user_id
    
    with SessionLocal() as db:
        query = select(Marks).where(Marks.faculty_id == faculty_id)
        if subject_id:
            query = query.where(Marks.subject_id == subject_id)
            
        marks = db.scalars(query).all()
        
        results = []
        for m in marks:
            # Fetch names efficiently (could join, but keeping simple)
            curr_student = db.get(Student, m.student_id)
            curr_subject = db.get(Subject, m.subject_id)
            
            results.append({
                'student_id': m.student_id,
                'student_name': curr_student.name if curr_student else 'Unknown',
                'subject_id': m.subject_id,
                'subject_name': curr_subject.subject_name if curr_subject else 'Unknown',
                'marks_obtained': m.marks_obtained,
                'max_marks': m.max_marks
            })
            
        return jsonify({'ok': True, 'data': results})

@bp.post('/results')
@faculty_required
def upload_marks():
    """
    Upload marks (Bulk or Single).
    Body: { faculty_id, subject_id, marksMap: { student_uid: marks }, max_marks }
    """
    data = request.get_json()
    if str(data.get('faculty_id')) != str(g.user_id):
        return jsonify({'ok': False, 'error': 'Unauthorized'}), 403

    with SessionLocal() as db:
        fid = g.user_id
        try:
            sub_id = int(data.get('subject_id'))
        except (ValueError, TypeError):
             return jsonify({'ok': False, 'error': 'Invalid Subject ID'}), 400
        max_m = float(data.get('max_marks', 100))

        for sid, val in data.get('marksMap', {}).items():
            try:
                mark_val = float(val)
            except (ValueError, TypeError):
                return jsonify({'ok': False, 'error': f'Invalid marks for student {sid}'}), 400
            
            if mark_val < 0 or mark_val > max_m: # Assuming max_m is 100 limit check? Requirement says "Validate marks range 0–100" but could refer to percentage or absolute if max_marks is customized. Assuming 100 based on prompt.
                if max_m == 100 and (mark_val < 0 or mark_val > 100):
                     return jsonify({'ok': False, 'error': f'Marks must be between 0 and 100 (Student {sid})'}), 400
            
            # Check existing
            exists = db.scalar(select(Marks).where(
                and_(Marks.student_id == sid, Marks.subject_id == sub_id)
            ))
            if exists:
                # "Once a recorded ... then again entering different value not accepted"
                if exists.marks_obtained != mark_val:
                     return jsonify({'ok': False, 'error': f'Marks already entered for {sid}. Use Update API.'}), 400
            else:
                db.add(Marks(
                    student_id=sid,
                    faculty_id=fid,
                    subject_id=sub_id,
                    marks_obtained=mark_val,
                    max_marks=max_m
                ))
        db.commit()
        return jsonify({'ok': True})

# 5. Faculty Update Student Marks
@bp.put('/results/<string:student_id>/<int:subject_id>')
@faculty_required
def update_student_marks(student_id, subject_id):
    """
    Update marks for a specific student in a specific subject.
    Body: { marks_obtained: <float> }
    """
    data = request.get_json()
    new_marks = data.get('marks_obtained')
    
    if new_marks is None:
        return jsonify({'ok': False, 'error': 'marks_obtained is required'}), 400
        
    try:
        new_marks = float(new_marks)
    except (ValueError, TypeError):
        return jsonify({'ok': False, 'error': 'Invalid marks format'}), 400
        
    # Validate range 0-100
    if new_marks < 0 or new_marks > 100:
        return jsonify({'ok': False, 'error': 'Marks must be between 0 and 100'}), 400

    with SessionLocal() as db:
        # Check if record exists
        # Requirement: "Allow update only if record exists."
        # Also, faculty can only update marks THEY uploaded? 
        # The prompt says "Faculty can only see marks uploaded by themselves" in GET, implies ownership.
        # Strict interpretation: `Marks.faculty_id == g.user_id` should effectively be checked.
        
        mark_entry = db.scalar(select(Marks).where(
            and_(Marks.student_id == student_id, Marks.subject_id == subject_id)
        ))
        
        if not mark_entry:
            return jsonify({'ok': False, 'error': 'Marks record not found. Use POST to create.'}), 404
            
        # Optional: Check if current faculty owns this record
        if mark_entry.faculty_id != g.user_id:
             return jsonify({'ok': False, 'error': 'You can only update marks uploaded by you.'}), 403
             
        mark_entry.marks_obtained = new_marks
        # Update max_marks if provided? Usually fixed.
        
        db.commit()
        return jsonify({'ok': True, 'message': 'Marks updated successfully'})
