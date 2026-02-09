import requests
import json
import time

URL = "http://127.0.0.1:5000/api/predict"
HEALTH_URL = "http://127.0.0.1:5000/api/health"

payload = {
    "age": 30,
    "gender": "male",
    "isSmoker": True,
    "smokingIntensity": 2,
    "yearsOfSmoking": 5,
    "alcoholUse": 2,
    "obesityLevel": 1,
    "balancedDiet": 5,
    "coughingBlood": 1,
    "chestPain": 1
}

def test_api():
    try:
        # 1. Check Health
        print(f"Checking Health at {HEALTH_URL}...")
        h_res = requests.get(HEALTH_URL, timeout=5)
        print(f"Health Status: {h_res.status_code}")
        print(f"Health Body: {h_res.text}")

        # 2. Check Prediction
        print(f"Sending request to {URL}...")
        start = time.time()
        response = requests.post(URL, json=payload, timeout=10)
        end = time.time()
        print(f"Status Code: {response.status_code}")
        print(f"Time: {end - start:.2f}s")
        print("Response:", response.text[:500])
    except requests.exceptions.ConnectionError:
        print("Connection Refused! Backend is likely down.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
