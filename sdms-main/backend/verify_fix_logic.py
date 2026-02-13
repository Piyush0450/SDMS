from datetime import datetime

def validate_dob(data):
    if 'dob' not in data or not data['dob']:
        return {'error': 'Date of birth is required'}, 400

    try:
        dob = datetime.strptime(data['dob'], '%Y-%m-%d').date()
        return dob
    except ValueError:
        return {'error': 'Invalid date format (YYYY-MM-DD)'}, 400

# Test cases
test_cases = [
    {'dob': '2000-01-01'}, # Valid
    {'dob': None},         # Invalid (None)
    {},                    # Invalid (Missing)
    {'dob': 'invalid'},    # Invalid (Format)
]

print("Running verification on validation logic...")
for i, case in enumerate(test_cases):
    print(f"\nTest Case {i+1}: {case}")
    try:
        result = validate_dob(case)
        print(f"Result: {result}")
    except Exception as e:
        print(f"CRASHED! {type(e).__name__}: {e}")
