-- Final Approved Schema
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS subject;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS admin;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS class;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS book_issues;
DROP TABLE IF EXISTS library_books;
DROP TABLE IF EXISTS subject_allocation;

CREATE TABLE admin (
    u_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    admin_type VARCHAR(6) NOT NULL, 
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) DEFAULT '0000000000',
    dob DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (u_id),
    UNIQUE (email)
);

CREATE TABLE faculty (
    u_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) DEFAULT '0000000000',
    dob DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (u_id),
    UNIQUE (email)
);

CREATE TABLE student (
    u_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) DEFAULT '0000000000',
    dob DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (u_id),
    UNIQUE (email)
);

CREATE TABLE subject (
    subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE marks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(50) NOT NULL,
    faculty_id VARCHAR(50) NOT NULL,
    subject_id INTEGER NOT NULL,
    marks_obtained FLOAT NOT NULL,
    max_marks FLOAT NOT NULL,
    FOREIGN KEY(student_id) REFERENCES student (u_id),
    FOREIGN KEY(faculty_id) REFERENCES faculty (u_id),
    FOREIGN KEY(subject_id) REFERENCES subject (subject_id)
);

CREATE TABLE attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(50) NOT NULL,
    faculty_id VARCHAR(50) NOT NULL,
    subject_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(7) NOT NULL,
    FOREIGN KEY(student_id) REFERENCES student (u_id),
    FOREIGN KEY(faculty_id) REFERENCES faculty (u_id),
    FOREIGN KEY(subject_id) REFERENCES subject (subject_id)
);
