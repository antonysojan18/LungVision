const getBaseUrl = () => {
    // 1. Check if Environment Variable is set (Best for Vercel/Production)
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

    // 2. Localhost & Mobile Detection
    const isLocal = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.startsWith('192.168.');

    if (isLocal) return `http://${window.location.hostname}:5000/api`;

    // 3. YOUR RENDER URL (Fallback)
    // Replace the URL below with your actual Render URL
    const renderUrl = 'https://lungvision.onrender.com/api';

    console.log("Using API URL:", renderUrl);
    return renderUrl;
};

export const API_BASE_URL = getBaseUrl();

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
    plot_url?: string;
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
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

            const response = await fetch(`${API_BASE_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientData),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Prediction failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("API Error in predict:", error);
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please try again.');
            }
            if (error.message && error.message.includes('Failed to fetch')) {
                throw new Error('Cannot connect to server. Please ensure the backend is running (python app.py).');
            }
            throw new Error(error.message || 'Failed to connect to the server');
        }
    },

    getDoctors: async (riskLevel?: string): Promise<Doctor[]> => {
        try {
            const url = riskLevel
                ? `${API_BASE_URL}/doctors?risk=${riskLevel}`
                : `${API_BASE_URL}/doctors`;

            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch doctors: ${response.status} ${errorText}`);
            }
            return await response.json();
        } catch (error: any) {
            console.error("API Error in getDoctors:", error);
            throw new Error(error.message || 'Failed to fetch doctors');
        }
    },

    chat: async (message: string): Promise<{ response: string }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Chat failed: ${response.status} ${errorText}`);
            }
            return await response.json();
        } catch (error: any) {
            console.error("API Error in chat:", error);
            throw new Error(error.message || 'Failed to send message');
        }
    },

    bookAppointment: async (details: BookingDetails): Promise<{ success: boolean; transactionId: string }> => {
        const response = await fetch(`${API_BASE_URL}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(details)
        });
        if (!response.ok) throw new Error('Booking failed');
        return response.json();
    },

    getRegistry: async (): Promise<any[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/registry`);
            if (!response.ok) throw new Error('Failed to fetch registry');
            return await response.json();
        } catch (error: any) {
            console.error("API Error in getRegistry:", error);
            return [];
        }
    },

    getHospitalRecords: async (): Promise<any[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/hospital-records`);
            if (!response.ok) throw new Error('Failed to fetch hospital records');
            return await response.json();
        } catch (error: any) {
            console.error("API Error in getHospitalRecords:", error);
            return [];
        }
    }
};
