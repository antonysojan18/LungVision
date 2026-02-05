import React, { forwardRef } from 'react';
import { Calendar, Clock, MapPin, Receipt, CheckCircle, Stethoscope } from 'lucide-react';

export interface BookingData {
    patientName: string;
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    bookingId: string;
    amount: string;
    paymentMethod: string;
    timestamp: string;
}

interface BookingReceiptProps {
    data: BookingData;
}

const BookingReceipt = forwardRef<HTMLDivElement, BookingReceiptProps>(({ data }, ref) => {
    return (
        <div
            ref={ref}
            className="bg-white text-slate-800 p-12 w-[800px] min-h-[1000px] mx-auto shadow-none font-sans relative overflow-hidden"
            style={{
                width: '800px',
                backgroundColor: '#ffffff',
            }}
        >
            {/* Elegant Background Accents */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-cyan-50 to-transparent rounded-bl-[200px] -z-0 opacity-50" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-50 to-transparent rounded-tr-[200px] -z-0 opacity-50" />

            {/* Header */}
            <header className="relative z-10 flex justify-between items-center mb-16 border-b border-cyan-100 pb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-200">
                        <Stethoscope className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-cyan-950 uppercase">LungVision Health</h1>
                        <p className="text-sm font-medium text-cyan-600 tracking-wide">Advanced Diagnostics Center</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-slate-400 mb-1">Receipt Number</p>
                    <p className="font-mono text-xl font-bold text-slate-800">#{data.bookingId}</p>
                    <p className="text-xs font-medium text-cyan-600 mt-1 uppercase tracking-wide">{data.timestamp}</p>
                </div>
            </header>

            {/* Success Banner */}
            <div className="relative z-10 text-center mb-16">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-cyan-50 rounded-full text-cyan-500 border-4 border-white shadow-xl">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Payment Confirmed</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                    Thank you. Your appointment has been secured.
                </p>
            </div>

            {/* Patient Details Banner */}
            <div className="bg-slate-50 border-y border-slate-100 py-6 px-12 mb-8 flex items-center justify-between relative z-10">
                <div>
                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Patient Name</p>
                    <p className="text-2xl font-bold text-slate-800">{data.patientName}</p>
                </div>
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-cyan-500 shadow-sm border border-slate-100">
                    <CheckCircle className="w-5 h-5" />
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm mb-12 relative z-10 mx-10">
                <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                    {/* Left Column: Doctor Info */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 block">Specialist</label>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-cyan-50 rounded-2xl text-cyan-600">
                                <Stethoscope className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-slate-800">{data.doctorName}</p>
                                <p className="text-sm text-slate-500 font-medium mb-1">{data.specialty}</p>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <MapPin className="w-3 h-3" />
                                    <span>Main Campus, Building B</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Appointment Info (Restored) */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 block">Appointment</label>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-cyan-400" />
                                <span className="text-lg font-semibold text-slate-700">{data.date}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                <span className="text-lg font-semibold text-slate-700">{data.time}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="my-8 border-t border-dashed border-slate-200" />

                {/* Financials */}
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <p className="text-sm text-slate-400">Payment Method</p>
                        <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-3 py-1 rounded-lg">
                            <span className="capitalize">{data.paymentMethod}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">Total Amount Paid</p>
                        <p className="text-4xl font-bold text-cyan-600">{data.amount}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-auto text-center relative z-10">
                <div className="inline-block p-4 border border-cyan-50 rounded-2xl bg-white/50 backdrop-blur-sm">
                    {/* Simulated Barcode */}
                    <div className="h-8 flex items-end justify-center gap-1 mb-2 opacity-40">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className={`w-1 bg-black ${Math.random() > 0.5 ? 'h-full' : 'h-1/2'}`} />
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono tracking-[0.2em] uppercase">
                        Verified Transaction • {new Date().toLocaleString()}
                    </p>
                </div>
                <p className="mt-6 text-xs text-cyan-300 font-medium">lungvision-ai.com</p>
            </footer>
        </div>
    );
});

BookingReceipt.displayName = 'BookingReceipt';

export default BookingReceipt;
