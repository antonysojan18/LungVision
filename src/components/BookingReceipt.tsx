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
}

interface BookingReceiptProps {
    data: BookingData;
}

const BookingReceipt = forwardRef<HTMLDivElement, BookingReceiptProps>(({ data }, ref) => {
    return (
        <div
            ref={ref}
            className="bg-white text-slate-900 p-10 w-[800px] min-h-[1000px] mx-auto shadow-none font-serif relative overflow-hidden"
            style={{
                width: '800px',
                backgroundColor: '#ffffff',
                color: '#0f172a',
            }}
        >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[100px] -z-0" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-tr-[100px] -z-0" />

            {/* Header */}
            <header className="relative z-10 flex justify-between items-start mb-16">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="w-8 h-8 text-slate-900" />
                        <h1 className="text-2xl font-bold tracking-tight uppercase">LungVision Health</h1>
                    </div>
                    <p className="text-sm font-sans text-slate-500">Excellence in Preliminary Diagnostics</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">APPOINTMENT CONFIRMED</h2>
                    <p className="font-mono text-sm text-slate-500">#{data.bookingId}</p>
                </div>
            </header>

            {/* Success Banner */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6 mb-12 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-emerald-900 font-bold text-lg">Payment Successful</h3>
                    <p className="text-emerald-700 text-sm font-sans">Your appointment has been securely booked.</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-2 gap-12 mb-12 relative z-10">
                {/* Left Column: Doctor Info */}
                <section>
                    <h3 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">
                        Specialist Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Doctor</p>
                            <p className="text-xl font-bold">{data.doctorName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Specialty</p>
                            <p className="text-lg text-slate-700">{data.specialty}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Location</p>
                            <div className="flex items-center gap-2 text-slate-700">
                                <MapPin className="w-4 h-4" />
                                <span>Main Campus, Building B</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Column: Appointment Time */}
                <section>
                    <h3 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">
                        Appointment Time
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-900">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Date</p>
                                <p className="text-lg font-semibold">{data.date}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-900">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Time</p>
                                <p className="text-lg font-semibold">{data.time}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Payment Details */}
            <section className="bg-slate-50 rounded-xl p-8 mb-12 border border-slate-100 relative z-10">
                <h3 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Receipt className="w-4 h-4" /> Transaction Summary
                </h3>
                <div className="space-y-3 mb-6 font-sans text-sm">
                    <div className="flex justify-between text-slate-600">
                        <span>Consultation Fee</span>
                        <span>$150.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Booking Fee</span>
                        <span>$10.00</span>
                    </div>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between items-end">
                    <div>
                        <p className="text-xs text-slate-400 mb-1">Payment Method</p>
                        <p className="font-semibold text-slate-700 capitalize">{data.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400 mb-1">Total Paid</p>
                        <p className="text-3xl font-bold text-slate-900">{data.amount}</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto pt-8 border-t-2 border-slate-100">
                <div className="flex justify-between items-start text-xs font-sans text-slate-400">
                    <div className="space-y-1">
                        <p className="font-bold text-slate-500 uppercase tracking-wider">Patient</p>
                        <p className="text-sm text-slate-700 font-semibold">{data.patientName}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p>Please arrive 15 minutes before your scheduled time.</p>
                        <p>Bring a valid photo ID and insurance card.</p>
                        <p className="mt-4 font-mono">Generated: {new Date().toLocaleString()}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
});

BookingReceipt.displayName = 'BookingReceipt';

export default BookingReceipt;
