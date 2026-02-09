import os
import random
import pandas as pd
import numpy as np
import shap
import matplotlib
matplotlib.use('Agg') 
import matplotlib.pyplot as plt
import io
import base64
import re
import uuid
import pickle
import json
from datetime import datetime
from flask import Flask, request, jsonify
from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import shap
from flask_cors import CORS
app = Flask(__name__)
app.secret_key = 'supersecretkey'
CORS(app)

# ==========================================
# 1. SETUP & DATA LOADING
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, 'doctors_database.csv')
MODEL_FILE = os.path.join(BASE_DIR, 'lung_cancer_model.pkl')
DATA_FILE = os.path.join(BASE_DIR, 'cancer patient datasets.csv')

# --- DEFINING REGISTRY FILES ---
PATIENT_REGISTRY = os.path.join(BASE_DIR, 'patient_registry.csv')
HOSPITAL_RECORDS = os.path.join(BASE_DIR, 'hospital_records.csv')

# --- GENERATE MOCK DATABASE IF MISSING ---
def create_mock_database():
    print("⚠️ Regenerating Database...")
    data = [
        [1, "Dr. Arun Kumar", "Oncologist", "Apollo Cancer Center", "Chennai", 4.9, "https://via.placeholder.com/150"],
        [2, "Dr. Priya Sharma", "Pulmonologist", "AIIMS", "Delhi", 4.8, "https://via.placeholder.com/150"],
        [3, "Dr. Raj Menon", "Thoracic Surgeon", "Amrita Hospital", "Kochi", 4.7, "https://via.placeholder.com/150"],
        [4, "Dr. Sarah Joseph", "Internal Medicine", "Lisie Hospital", "Kochi", 4.6, "https://via.placeholder.com/150"]
    ]
    try:
        pd.DataFrame(data, columns=["ID", "Name", "Specialty", "Hospital", "Location", "Rating", "ImageURL"]).to_csv(DB_FILE, index=False)
        print("Database regenerated successfully.")
    except Exception as e:
        print(f"Error creating mock database: {e}")

if not os.path.exists(DB_FILE):
    create_mock_database()

# --- LOAD OR TRAIN MODEL ---
model = None
explainer = None
le = LabelEncoder()
ALL_FEATURES = []

def load_model():
    global model, explainer, le, ALL_FEATURES
    try:
        if os.path.exists(MODEL_FILE):
            print("Loading existing model...", flush=True)
            with open(MODEL_FILE, 'rb') as f:
                artifacts = pickle.load(f)
                model = artifacts.get('model')
                explainer = artifacts.get('explainer')
                ALL_FEATURES = artifacts.get('features', [])
                le = artifacts.get('le', LabelEncoder())
                print(f"Model loaded from {MODEL_FILE}")
        else:
            print(f"Model file not found at {MODEL_FILE}. Skipping model load.")
            # Optional: Trigger training here if desired, but for stability, skipping is safer.
    except Exception as e:
        print(f"CRITICAL ERROR loading model: {e}")
        model = None
        explainer = None
        ALL_FEATURES = []

load_model()

# --- LOAD DOCTOR DATABASE ---
doctor_db = pd.DataFrame()
try:
    if os.path.exists(DB_FILE):
        doctor_db = pd.read_csv(DB_FILE)
        print(f"Doctor Database Loaded. {len(doctor_db)} doctors found.")
    else:
        print(f"Doctor Database not found at {DB_FILE}")
        create_mock_database()
        doctor_db = pd.read_csv(DB_FILE)
except Exception as e:
    print(f"Error loading doctor database: {e}")
    # Create an empty DataFrame with expected columns to avoid crashes later
    doctor_db = pd.DataFrame(columns=["ID", "Name", "Specialty", "Hospital", "Location", "Rating", "ImageURL"])

# ==========================================
# 2. INTELLIGENCE LOGIC
# ==========================================
def get_intel_and_colors(result):
    if result == 'High':
        return {
            'color': '#dc3545', 'bg': '#fff5f5', 'title': 'HIGH RISK PROTOCOL', 
            'content': '🚫 AVOID: Processed Meats, Sugar.<br>✅ EAT: Berries, Green Tea.<br>🍵 HABITS: Turmeric Milk at night.',
            'plain_text': "DIET: Avoid processed meats & sugar. Eat berries & green tea. Drink Turmeric milk."
        }, "risk-high"
    elif result == 'Medium':
        return {
            'color': '#ffc107', 'bg': '#fff9e6', 'title': 'MEDIUM RISK PROTOCOL', 
            'content': '⚠️ LIMIT: Red Meat, Soda.<br>✅ EAT: Carrots, Walnuts.<br>💧 DETOX: Warm lemon water.',
            'plain_text': "DIET: Limit red meat & soda. Eat carrots & walnuts. Drink warm lemon water."
        }, "risk-medium"
    else:
        return {
            'color': '#198754', 'bg': '#e8f5e9', 'title': 'LOW RISK PROTOCOL', 
            'content': '✅ MAINTAIN: 5 Veggies/Day.<br>🍎 SNACKS: Yogurt, Almonds.<br>🏃 GOAL: 3L Water Daily.',
            'plain_text': "DIET: Maintain 5 veggies/day. Snack on yogurt & almonds. Drink 3L water."
        }, "risk-low"

def generate_recommendations(inputs):
    recs = []
    if int(inputs.get('Coughing of Blood', 1)) > 2:
        recs.append("🚨 URGENT: Hemoptysis (Coughing Blood) detected. See a doctor immediately.")
    if int(inputs.get('Swallowing Difficulty', 1)) > 5:
        recs.append("💊 CHECKUP: Dysphagia (Swallowing difficulty) can indicate esophageal issues.")
    if int(inputs.get('Clubbing of Finger Nails', 1)) > 5:
        recs.append("💅 OXYGEN: Nail Clubbing is a sign of chronic low oxygen.")
    
    years_smoked = int(inputs.get('Years of Smoking', 0))
    if years_smoked > 10:
        recs.append(f"🚬 HISTORY: {years_smoked} years of smoking significantly increases risk. Annual CT screening recommended.")
    elif int(inputs.get('Smoking', 1)) > 3:
        recs.append("🚬 ACTION: Stop Smoking. Join a cessation program.")
        
    if int(inputs.get('Alcohol use', 1)) > 5:
        recs.append("🍷 LIVER: Limit alcohol to 1-2 drinks/week.")
    if int(inputs.get('Obesity', 1)) > 6:
        recs.append("⚖️ WEIGHT: Reducing BMI by 5% can lower inflammation.")
    if int(inputs.get('Air Pollution', 1)) > 6:
        recs.append("😷 PROTECTION: Wear N95 masks during commute.")
    if int(inputs.get('Dust Allergy', 1)) > 5:
        recs.append("🧹 HOME: Use HEPA Air Purifiers in your bedroom.")

    age = int(inputs.get('Age', 30))
    if age > 50 and years_smoked > 20:
        recs.append("📅 SCREENING: Age 50+ with 20+ pack-years qualifies for immediate screening.")

    if not recs:
        recs.append("✅ EXCELLENT: No specific risk factors identified.")

    return recs

@app.route('/api/book', methods=['POST'])
def api_book_appointment():
    try:
        data = request.json
        txn_id = f"TXN-{random.randint(10000,99999)}"
        
        full_record = {
            'Timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'Transaction ID': txn_id,
            'Payment Status': 'Payment Successful',
            'Patient Name': data.get('patientName'),
            'Diagnosis': data.get('diagnosis'),
            'Confidence': f"{data.get('confidence')}%",
            'Doctor Name': data.get('doctorName'),
            'Specialty': data.get('specialty'),
            'Appt Date': data.get('date'),
            'Appt Time': data.get('time'),
            'Fee Paid': data.get('amount'),
            'Payment Method': data.get('paymentMethod')
        }
        
        record_df = pd.DataFrame([full_record])
        if not os.path.exists(HOSPITAL_RECORDS):
            record_df.to_csv(HOSPITAL_RECORDS, index=False)
        else:
            record_df.to_csv(HOSPITAL_RECORDS, mode='a', header=False, index=False)
            
        print(f"Hospital Record Saved for {data.get('patientName')}")
        return {"success": True, "transactionId": txn_id}

    except Exception as e:
        print(f"Error Saving Hospital Record: {e}")
        return {"error": str(e)}, 500
@app.route('/api/predict', methods=['POST'])
def api_predict():
    try:
        print(f"[{datetime.now().time()}] Received prediction request", flush=True)
        
        if model is None:
            return {"error": "Model not loaded. Please contact support."}, 503

        data = request.json
        if not data:
            return {"error": "No data provided"}, 400

        input_data = {}
        # Default Mapping Logic
        key_map = {
            'Age': 'age',
            'Gender': 'gender', 
            'Smoking': 'smokingIntensity', 
            'Years of Smoking': 'yearsOfSmoking',
            'Passive Smoker': 'passiveSmokingLevel',
            'Alcohol use': 'alcoholUse',
            'Obesity': 'obesityLevel',
            'Balanced Diet': 'balancedDiet',
            'Air Pollution': 'airPollution',
            'OccuPational Hazards': 'occupationalHazards',
            'Dust Allergy': 'dustAllergy',
            'Genetic Risk': 'geneticRisk', 
            'chronic Lung Disease': 'chronicLungDisease', 
            'Chest Pain': 'chestPain',
            'Coughing of Blood': 'coughingBlood',
            'Fatigue': 'fatigue',
            'Weight Loss': 'weightLoss',
            'Shortness of Breath': 'shortnessOfBreath',
            'Wheezing': 'wheezing',
            'Swallowing Difficulty': 'swallowingDifficulty',
            'Clubbing of Finger Nails': 'clubbingFingers',
            'Frequent Cold': 'frequentColds',
            'Dry Cough': 'dryCough',
            'Snoring': 'snoring'
        }

        # Safe parsing
        for f in ALL_FEATURES:
            val = 1
            if f == 'Age': val = int(data.get('age', 30))
            elif f == 'Gender': val = 1 if data.get('gender') == 'male' else 2
            elif f == 'Smoking': val = int(data.get('smokingIntensity', 1)) if data.get('isSmoker') else 1
            elif f == 'Years of Smoking': val = int(data.get('yearsOfSmoking', 0)) if data.get('isSmoker') else 0
            elif f == 'Genetic Risk': val = 7 if data.get('geneticRisk') else 1
            elif f == 'chronic Lung Disease': val = 7 if data.get('chronicLungDisease') else 1
            elif f in key_map and key_map[f] in data:
                val = int(data[key_map[f]])
            
            input_data[f] = val

        data_values = [input_data[f] for f in ALL_FEATURES]
        input_df = pd.DataFrame([data_values], columns=ALL_FEATURES)
        
        print("Running prediction...", flush=True)
        # Predict
        pred_code = model.predict(input_df)[0]
        if isinstance(pred_code, (list, np.ndarray)): pred_code = pred_code[0]
        result = le.inverse_transform([int(pred_code)])[0]
        
        probs = model.predict_proba(input_df)[0]
        confidence = round(float(max(probs)) * 100, 2)
        print(f"Prediction done: {result} ({confidence}%)", flush=True)
        
        # Intel
        diet, css_class = get_intel_and_colors(result)
        recs = generate_recommendations(input_data)
        
        # Dashboard Data
        class_idx = 0
        try:
            class_idx = int(pred_code)
        except: 
            if result == 'Medium': class_idx = 1
            elif result == 'High': class_idx = 2

        shap_values = explainer(input_df)
        sv = shap_values[0, :, class_idx]
        
        feature_impacts = [{'name': n, 'impact': i, 'val': v} for n, i, v in zip(ALL_FEATURES, sv.values, sv.data)]
        feature_impacts.sort(key=lambda x: x['impact'], reverse=True)
        
        # Radar Data
        radar_feats = ['Smoking', 'Alcohol use', 'Obesity', 'Balanced Diet', 'Air Pollution']
        max_vals = {'Smoking': 8, 'Alcohol use': 8, 'Obesity': 7, 'Balanced Diet': 7, 'Air Pollution': 8}
        radar_data = []
        for f in radar_feats:
            val = input_data.get(f, 0)
            norm_val = (val / max_vals.get(f, 8)) * 100
            radar_data.append(min(norm_val, 100))

        # Bar Data
        sorted_by_mag = sorted(feature_impacts, key=lambda x: abs(x['impact']), reverse=True)[:7]
        chart_labels = [x['name'] for x in sorted_by_mag]
        chart_values = [round(x['impact'], 3) for x in sorted_by_mag]
        
        # --- GENERATE PLOT ---
        plot_url = ""
        try:
            plt.figure(figsize=(12, 6)) # Wider for horizontal emphasis
            shap.summary_plot(shap_values[:, :, class_idx], input_df, show=False, plot_type="bar", color='#00f2c3')
            plt.title('Feature Importance (Deep Logic)', color='white')
            plt.xlabel('SHAP Value (Impact on Prediction)', color='white') # Explicit X label
            
            # Dark Theme Customization for Plot
            ax = plt.gca()
            ax.set_facecolor('#1e1e2f')
            plt.gcf().set_facecolor('#1e1e2f')
            ax.tick_params(colors='white', which='both')
            ax.xaxis.label.set_color('white')
            ax.yaxis.label.set_color('white')
            for spine in ax.spines.values():
                spine.set_edgecolor('#444')

            img = io.BytesIO()
            plt.savefig(img, format='png', bbox_inches='tight', transparent=False)
            img.seek(0)
            plot_url = base64.b64encode(img.getvalue()).decode()
            plt.close()
        except Exception as plot_err:
            print(f"Plot Error: {plot_err}")

        # --- SAVE TO REGISTRY ---
        try:
            # Explicitly define columns to match patient_registry.csv header
            # Header: Timestamp,Patient Name,Diagnosis,Confidence Score,<Features>,Name,GenderStr
            # Features list (excluding Years of Smoking which is in ALL_FEATURES but not in registry)
            REGISTRY_FEATURES = [
                'Age', 'Gender', 'Air Pollution', 'Alcohol use', 'Dust Allergy', 'OccuPational Hazards',
                'Genetic Risk', 'chronic Lung Disease', 'Balanced Diet', 'Obesity', 'Smoking', 
                'Passive Smoker', 'Chest Pain', 'Coughing of Blood', 'Fatigue', 'Weight Loss', 
                'Shortness of Breath', 'Wheezing', 'Swallowing Difficulty', 'Clubbing of Finger Nails', 
                'Frequent Cold', 'Dry Cough', 'Snoring'
            ]
            
            registry_record = {
                'Timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'Patient Name': data.get('name', 'Unknown'),
                'Diagnosis': result,
                'Confidence Score': f"{confidence}%",
            }
            
            for f in REGISTRY_FEATURES:
                registry_record[f] = input_data.get(f, '')
                
            # Extra columns seen in registry
            registry_record['Name'] = data.get('name', 'Unknown')
            registry_record['GenderStr'] = 'Male' if input_data.get('Gender') == 1 else 'Female'
            
            # Create DataFrame with explicit column order
            ordered_cols = ['Timestamp', 'Patient Name', 'Diagnosis', 'Confidence Score'] + REGISTRY_FEATURES + ['Name', 'GenderStr']
            reg_df = pd.DataFrame([registry_record], columns=ordered_cols)
            
            if not os.path.exists(PATIENT_REGISTRY):
                reg_df.to_csv(PATIENT_REGISTRY, index=False)
            else:
                reg_df.to_csv(PATIENT_REGISTRY, mode='a', header=False, index=False)
                
            print(f"Registry Updated for {data.get('name')}")
            
        except Exception as reg_err:
            print(f"Registry Update Failed: {reg_err}")

        return {
            "prediction": result,
            "confidence": confidence,
            "diet": diet,
            "recommendations": recs,
            "plot_url": plot_url,
            "dashboard": {
                "radar": {"labels": radar_feats, "data": radar_data},
                "bar": {"labels": chart_labels, "data": chart_values},
                "base_value": round(explainer.expected_value[class_idx], 3)
            }
        }
    except Exception as e:
        print(f"API Error: {e}")
        return {"error": str(e)}, 500

@app.route('/api/doctors', methods=['GET'])
def api_get_doctors():
    try:
        risk_level = request.args.get('risk')
        targets = []
        if risk_level == 'High': targets = ['Oncologist', 'Thoracic Surgeon']
        elif risk_level == 'Medium': targets = ['Pulmonologist', 'Internal Medicine']
        elif risk_level == 'Low': targets = ['General Physician', 'Internal Medicine']
        
        docs = doctor_db
        if targets:
            docs = doctor_db[doctor_db['Specialty'].isin(targets)]
            
        return docs.to_dict(orient='records')
    except Exception as e:
        return {"error": str(e)}, 500

@app.route('/api/registry', methods=['GET'])
def api_get_registry():
    try:
        if os.path.exists(PATIENT_REGISTRY):
            df = pd.read_csv(PATIENT_REGISTRY)
            # Replace NaN with None (null in JSON)
            df = df.where(pd.notnull(df), None)
            return df.to_dict(orient='records')
        return []
    except Exception as e:
        print(f"Error fetching registry: {e}")
        return {"error": str(e)}, 500

@app.route('/api/hospital-records', methods=['GET'])
def api_get_hospital_records():
    try:
        if os.path.exists(HOSPITAL_RECORDS):
            df = pd.read_csv(HOSPITAL_RECORDS)
            # Replace NaN with None (null in JSON)
            df = df.where(pd.notnull(df), None)
            return df.to_dict(orient='records')
        return []
    except Exception as e:
        print(f"Error fetching hospital records: {e}")
        return {"error": str(e)}, 500

@app.route('/api/chat', methods=['POST'])
def api_chat_message():
    try:
        user_msg = request.json.get('message', '').lower()
        knowledge_base = {
            "hello": "Hello! I am your LungVision AI Assistant.",
            "book": "To book a doctor, complete the diagnosis, click 'Consult Specialist', and select a doctor.",
            "fee": "The consultation booking fee is ₹500.",
            "pay": "We accept major Credit Cards. The standard fee is ₹500.",
            "report": "You can download your detailed PDF Analysis by clicking the 'Download PDF Report' button.",
            "accuracy": "LungVision AI is trained on 7,000+ records and operates with ~98% predictive accuracy.",
            "confidence": "The Confidence Score shows how certain the AI is based on your specific pattern.",
            "risk": "We categorize risk into High, Medium, and Low based on 25 clinical parameters.",
            "smoke": "Smoking is the top risk factor. We now analyze intensity and years of smoking.",
            "blood": "Coughing of Blood (Hemoptysis) is a critical symptom. See a doctor immediately."
        }
        response = "I can help with Symptoms, Risks, or Booking. What would you like to know?"
        for key in knowledge_base:
            if key in user_msg:
                response = knowledge_base[key]
                break
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}, 500

@app.route('/api/health', methods=['GET'])
def api_health():
    return jsonify({
        "status": "ok", 
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Use 0.0.0.0 to make it accessible from other devices/network interfaces
    # Threaded=True to handle multiple requests (like health checks while processing)
    print("Starting LungVision Backend on 0.0.0.0:5000...")
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)