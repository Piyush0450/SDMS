
import re
from datetime import date, timedelta, datetime

def validate_id(uid, role):
    """
    Validates User ID format.
    Faculty: F_XXX
    Student: S_XXX
    Admin: A_XXX
    where XXX are digits.
    """
    if not uid:
        return False, "ID is required"
    
    if role == 'faculty':
        if not re.match(r'^F_\d{3}$', uid):
            return False, "Faculty ID must be in format F_XXX (e.g., F_001)"
    elif role == 'student':
        if not re.match(r'^S_\d{3}$', uid):
            return False, "Student ID must be in format S_XXX (e.g., S_001)"
    elif role == 'admin':
        if not re.match(r'^A_\d{3}$', uid):
            return False, "Admin ID must be in format A_XXX (e.g., A_001)"
            
    return True, None

def validate_name(name):
    """
    Name must:
    - Not be null
    - Not contain special characters (only letters and spaces allowed, maybe simple dots?)
    - First letter must be alphabet
    - Will be converted to UPPERCASE
    """
    if not name:
        return False, "Name is required"
    
    # Check 1: First letter alphabet
    if not name[0].isalpha():
        return False, "Name must start with an alphabet"
    
    # Check 2: No special characters (allow spaces and dots only?)
    # "Name does not contain any special keys... Example—Rohan@#das"
    if not re.match(r'^[a-zA-Z\s\.]+$', name):
        return False, "Name can only contain letters, spaces, and dots"
        
    return True, None

def validate_email(email):
    if not email:
        return False, "Email is required"
    
    # Simple regex for email
    # "Email id first letter can be number, and all letters can be number (test case passed)" -> Standard email validation allows this usually
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
        return False, "Invalid email format"
        
    return True, None

def validate_phone(phone):
    """
    - Not null
    - Exactly 10 digits
    """
    if not phone:
        return False, "Phone number is required"
    
    if not re.match(r'^\d{10}$', str(phone)):
        return False, "Phone number must be exactly 10 digits"
        
    return True, None

def validate_dob(dob_obj):
    """
    - No future date
    - No current date
    - Minimum 4 years gap from current year
    """
    if not dob_obj:
        return False, "Date of birth is required"
        
    today = date.today()
    
    if dob_obj >= today:
        return False, "Date of birth cannot be in the future or today"
        
    # Min 4 years gap
    # Simple check: (today - dob).days / 365 > 4 ? 
    # Or just year diff? "minimum 4 years gap from current year"
    
    age = today.year - dob_obj.year - ((today.month, today.day) < (dob_obj.month, dob_obj.day))
    if age < 4:
         return False, "Minimum age must be 4 years"

    return True, None
