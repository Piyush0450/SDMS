
import requests

url = "http://localhost:5000/api/auth/login/credentials"
payload = {
    "username": "S_004",
    "password": "2026-02-07"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except requests.exceptions.ConnectionError:
    print("Could not connect to server. Is it running?")
