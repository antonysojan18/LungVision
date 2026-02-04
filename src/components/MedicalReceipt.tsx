import React, { forwardRef } from 'react';
import { ShieldCheck, Calendar, Activity, User, FileText } from 'lucide-react';

export interface ReceiptData {
    patientNam: string;
    date: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    riskScore: number;
    consultationId: string;
    doctorNote: string;
    vitals: {
        label: string;
        value: string;
    }[];
}

interface MedicalReceiptProps {
    data: ReceiptData;
}

const MedicalReceipt = forwardRef<HTMLDivElement, MedicalReceiptProps>(({ data }, ref) => {
    return (
        <div
            ref={ref}
            className="bg-white text-slate-900 p-8 w-[800px] min-h-[1000px] mx-auto shadow-none font-serif relative overflow-hidden"
            style={{
                // Ensure consistent rendering for capture
                width: '800px',
                backgroundColor: '#ffffff',
                color: '#0f172a',
            }}
        >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <Activity size={400} />
            </div>

            {/* Header */}
            <header className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="w-8 h-8 text-slate-900" />
                        <h1 className="text-3xl font-bold tracking-tight uppercase">LungVision AI</h1>
                    </div>
                    <p className="text-sm font-sans text-slate-500 uppercase tracking-widest">Advanced Pulmonary Risk Assessment</p>
                </div>
                <div className="text-right font-sans">
                    <p className="text-sm text-slate-500">Report Date</p>
                    <p className="font-medium text-slate-900">{data.date}</p>
                    <p className="text-xs text-slate-400 mt-1">ID: {data.consultationId}</p>
                </div>
            </header>

            {/* Patient Section */}
            <section className="mb-10 bg-slate-50 p-6 border border-slate-200 rounded-sm">
                <h2 className="text-sm font-sans font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Patient Details
                </h2>
                <div className="grid grid-cols-2 gap-y-4 font-sans text-sm">
                    <div>
                        <span className="text-slate-500 block text-xs uppercase mb-1">Name</span>
                        <span className="font-semibold text-lg">{data.patientNam}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block text-xs uppercase mb-1">Assessment Type</span>
                        <span className="font-medium">Preliminary Risk Screening</span>
                    </div>
                </div>
            </section>

            {/* Assessment Result */}
            <section className="mb-10">
                <div className="flex border-2 border-slate-900">
                    <div className="flex-1 p-6 border-r-2 border-slate-900 flex flex-col justify-center items-center bg-slate-50">
                        <p className="text-sm font-sans font-bold text-slate-500 uppercase tracking-wider mb-2">Risk Classification</p>
                        <div className={`text-5xl font-bold ${data.riskLevel === 'High' ? 'text-red-700' :
                                data.riskLevel === 'Medium' ? 'text-amber-600' :
                                    'text-emerald-700'
                            }`}>
                            {data.riskLevel}
                        </div>
                        <div className="mt-2 px-3 py-1 bg-white border border-slate-200 text-xs font-sans rounded-full uppercase tracking-widest font-semibold flex items-center gap-2">
                            <Activity className="w-3 h-3" />
                            Calculated
                        </div>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-center items-center">
                        <p className="text-sm font-sans font-bold text-slate-500 uppercase tracking-wider mb-2">Analytic Score</p>
                        <div className="text-5xl font-bold text-slate-900">
                            {data.riskScore}<span className="text-2xl text-slate-400 font-light">%</span>
                        </div>
                        <div className="mt-2 text-xs font-sans text-slate-400 uppercase tracking-widest">
                            Confidence Interval: 94%
                        </div>
                    </div>
                </div>
            </section>

            {/* Clinical Notes */}
            <section className="mb-8 font-sans">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                    <FileText className="w-4 h-4" /> Clinical Assessment Summary
                </h2>
                <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-line text-justify">
                    {data.doctorNote}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto pt-8 border-t border-slate-200 flex justify-between items-center text-xs font-sans text-slate-400">
                <div>
                    <p>Generated by LungVision AI Diagnostic System</p>
                    <p>Not a definitive medical diagnosis. Consult a specialist.</p>
                </div>
                <div className="text-right">
                    <p>Page 1 of 1</p>
                    <p className="font-mono">{new Date().toISOString()}</p>
                </div>
            </footer>
        </div>
    );
});

MedicalReceipt.displayName = 'MedicalReceipt';

export default MedicalReceipt;
