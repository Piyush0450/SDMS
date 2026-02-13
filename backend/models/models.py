from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey, Float
from sqlalchemy.orm import relationship, DeclarativeBase

class Base(DeclarativeBase):
    pass

class Admin(Base):
    __tablename__ = "admin"
    u_id = Column(String(50), primary_key=True) # Manually assigned (e.g. A_001)
    name = Column(String(100), nullable=False)
    admin_type = Column(Enum('super', 'normal', name='admin_type_enum'), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    dob = Column(Date, nullable=False)
    password = Column(String(255), nullable=False) # bcrypt hash
    
    # Blocking fields
    status = Column(Enum('active', 'blocked', 'suspended', name='user_status_enum'), default='active', nullable=False)
    blocked_by = Column(String(50), nullable=True)
    blocked_reason = Column(String(255), nullable=True)
    blocked_at = Column(Date, nullable=True)
    unblock_at = Column(Date, nullable=True)

class Faculty(Base):
    __tablename__ = "faculty"
    u_id = Column(String(50), primary_key=True) # F_001
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    dob = Column(Date, nullable=False)
    password = Column(String(255), nullable=False)

    # Blocking fields
    status = Column(Enum('active', 'blocked', 'suspended', name='user_status_enum'), default='active', nullable=False)
    blocked_by = Column(String(50), nullable=True)
    blocked_reason = Column(String(255), nullable=True)
    blocked_at = Column(Date, nullable=True)
    unblock_at = Column(Date, nullable=True)

class Student(Base):
    __tablename__ = "student"
    u_id = Column(String(50), primary_key=True) # S_001
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    dob = Column(Date, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(Date, nullable=True)
    
    # Blocking fields
    status = Column(Enum('active', 'blocked', 'suspended', name='user_status_enum'), default='active', nullable=False)
    blocked_by = Column(String(50), nullable=True) # u_id of the blocker
    blocked_reason = Column(String(255), nullable=True)
    blocked_at = Column(Date, nullable=True) # Using Date for simplicity match other fields, or change to DateTime
    unblock_at = Column(Date, nullable=True)

class Subject(Base):
    __tablename__ = "subject"
    subject_id = Column(Integer, primary_key=True, autoincrement=True)
    subject_name = Column(String(100), nullable=False, unique=True)

class Marks(Base):
    __tablename__ = "marks"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(50), ForeignKey('student.u_id'), nullable=False)
    faculty_id = Column(String(50), ForeignKey('faculty.u_id'), nullable=False)
    subject_id = Column(Integer, ForeignKey('subject.subject_id'), nullable=False)
    marks_obtained = Column(Float, nullable=False)
    max_marks = Column(Float, nullable=False)

    # Relationships
    student = relationship("Student")
    faculty = relationship("Faculty")
    subject = relationship("Subject")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(50), ForeignKey('student.u_id'), nullable=False)
    faculty_id = Column(String(50), ForeignKey('faculty.u_id'), nullable=False)
    subject_id = Column(Integer, ForeignKey('subject.subject_id'), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False)

    # Relationships
    student = relationship("Student")
    faculty = relationship("Faculty")
    subject = relationship("Subject")

class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True, autoincrement=True)
    actor_id = Column(String(50), nullable=False) # Who performed the action
    target_id = Column(String(50), nullable=False) # Who was affected
    action = Column(String(50), nullable=False) # BLOCK, UNBLOCK, SUSPEND
    reason = Column(String(255), nullable=True)
    timestamp = Column(Date, nullable=False) # Should be DateTime in real app

