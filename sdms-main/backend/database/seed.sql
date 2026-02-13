-- Strict Schema Seed (A_001)
INSERT OR IGNORE INTO admin (u_id, name, admin_type, email, phone, dob, password) 
VALUES ('A_001', 'Piyush Chaurasiya', 'super', 'Piyushchaurasiya348@gmail.com', '9876543210', '2005-09-25', '$2b$12$...'); -- Password must be hashed in real usage, seed.py handles this.
