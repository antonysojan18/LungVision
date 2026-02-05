import requests
import json

url = 'http://127.0.0.1:5000/api/predict'
data = {
    "age": 45,
    "gender": "male",
    "isSmoker": True,
    "yearsOfSmoking": 10,
    "smokingIntensity": 5
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=data, timeout=10)
    print(f"Status Code: {response.status_code}")
    print("Response:", response.text)
except Exception as e:
    print(f"Error: {e}")
