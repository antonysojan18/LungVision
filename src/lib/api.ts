export const API_BASE_URL = 'http://localhost:5000/api';

export interface Doctor {
    ID: number;
    Name: string;
    Specialty: string;
    Hospital: string;
    Location: string;
    Rating: number;
    ImageURL: string;
}

export interface PredictionResult {
    prediction: string;
    confidence: number;
    diet: {
        color: string;
        bg: string;
        title: string;
        content: string;
        plain_text: string;
    };
    recommendations: string[];
    dashboard: {
        radar: {
            labels: string[];
            data: number[];
        };
        bar: {
            labels: string[];
            data: number[];
        };
        base_value: number;
    };
}

export interface BookingDetails {
    patientName: string;
    diagnosis: string;
    confidence: number;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    amount: string;
    paymentMethod: string;
}

export const api = {
    predict: async (patientData: any): Promise<PredictionResult> => {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData),
        });
        if (!response.ok) {
            throw new Error('Prediction failed');
        }
        return response.json();
    },

    getDoctors: async (riskLevel?: string): Promise<Doctor[]> => {
        const url = riskLevel
            ? `${API_BASE_URL}/doctors?risk=${riskLevel}`
            : `${API_BASE_URL}/doctors`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch doctors');
        }
        return response.json();
    },

    chat: async (message: string): Promise<{ response: string }> => {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        if (!response.ok) {
            throw new Error('Chat failed');
        }
        return response.json();
    },

    bookAppointment: async (details: BookingDetails): Promise<{ success: boolean; transactionId: string }> => {
        const response = await fetch(`${API_BASE_URL}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details)
        });
        if (!response.ok) throw new Error('Booking failed');
        return response.json();
    }
};
