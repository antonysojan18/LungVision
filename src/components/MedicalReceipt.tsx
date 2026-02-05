import React, { forwardRef } from 'react';
import { ShieldCheck, Calendar, Activity, User, FileText, PieChart, CheckCircle, AlertTriangle } from 'lucide-react';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Cell,
    ResponsiveContainer
} from 'recharts';

export interface ReceiptData {
    patientNam: string;
    date: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    riskScore: number;
    consultationId: string;
    doctorNote: string;
    userNote?: string;
    plot_url?: string;
    radarData: any[];
    barData: any[];
    diet?: any;
    recommendations?: string[];
    vitals: {
        label: string;
        value: string;
    }[];
}

interface MedicalReceiptProps {
    data: ReceiptData;
}

const MedicalReceipt = forwardRef<HTMLDivElement, MedicalReceiptProps>(({ data }, ref) => {
    // Determine theme color based on risk
    const themeColor = data.riskLevel === 'High' ? '#ef4444' : data.riskLevel === 'Medium' ? '#f59e0b' : '#10b981';
    const bgTheme = data.riskLevel === 'High' ? 'bg-red-50' : data.riskLevel === 'Medium' ? 'bg-amber-50' : 'bg-emerald-50';
    const borderTheme = data.riskLevel === 'High' ? 'border-red-200' : data.riskLevel === 'Medium' ? 'border-amber-200' : 'border-emerald-200';

    return (
        <div ref={ref} className="w-[210mm] min-h-[297mm] bg-white p-8 mx-auto shadow-2xl relative overflow-hidden text-slate-800">
            {/* Professional Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
                <ShieldCheck size={500} />
            </div>

            {/* Vibrant Header */}
            <header className="flex justify-between items-start mb-8 pb-6 border-b-2" style={{ borderColor: themeColor }}>
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl text-white shadow-lg" style={{ backgroundColor: themeColor }}>
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">LungVision AI</h1>
                        <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">Diagnostic Report</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="inline-block px-4 py-2 rounded-lg bg-slate-50 border border-slate-100 mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consultation ID</p>
                        <p className="font-mono font-bold text-lg text-slate-700">{data.consultationId}</p>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase">{data.date}</p>
                </div>
            </header>

            {/* Client Info & Risk Hero */}
            <div className="grid grid-cols-12 gap-6 mb-8">
                <div className="col-span-8 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Patient Name</h3>
                        <h2 className="text-2xl font-black text-slate-800 mb-4">{data.patientNam}</h2>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-3 py-1 bg-white rounded border border-slate-200 text-xs font-bold text-slate-500">
                            AGE: {2026 - (data.diet?.age || 1990)} (Est)
                        </div>
                        <div className="px-3 py-1 bg-white rounded border border-slate-200 text-xs font-bold text-slate-500">
                            GENDER: {data.diet?.gender === 1 ? 'Male' : 'Female'}
                        </div>
                    </div>
                </div>

                <div className={`col-span-4 rounded-2xl p-6 text-white text-center shadow-lg flex flex-col justify-center items-center relative overflow-hidden`} style={{ backgroundColor: themeColor }}>
                    <div className="relative z-10">
                        <h3 className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Predicted Risk</h3>
                        <h2 className="text-4xl font-black tracking-tight mb-2">{data.riskLevel}</h2>

                    </div>
                    <Activity className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
                </div>
            </div>

            {/* Comprehensive Visual Analysis */}
            <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <PieChart className="w-5 h-5" style={{ color: themeColor }} />
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Visual Diagnostics</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Radar Chart */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">Lifestyle Fingerprint</h4>
                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.radarData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 7, fontWeight: 700 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Patient" dataKey="A" stroke={themeColor} strokeWidth={2} fill={themeColor} fillOpacity={0.2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Cumulative Risk Flow */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">Cumulative Risk Flow</h4>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.barData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={70} tick={{ fill: '#64748b', fontSize: 8, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={8}>
                                        {data.barData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.critical ? '#ef4444' : '#10b981'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Chart 3: Key Risk Drivers - Full Width */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">Key Risk Drivers</h4>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.barData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                                    {data.barData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.critical ? '#f59e0b' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Deep Logic Image - Full Width & Big */}
                {
                    data.plot_url && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2">Deep Logic Analysis</h4>
                            <img
                                src={`data:image/png;base64,${data.plot_url}`}
                                alt="Analysis"
                                className="w-full h-[400px] object-contain mix-blend-multiply"
                            />
                        </div>
                    )
                }
            </section>

            {/* Diet & Recommendations Grid */}
            <div className="grid grid-cols-2 gap-8 mb-8 break-inside-avoid">
                {/* Diet Protocol */}
                <div>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Clinical Diet Protocol</h3>
                    </div>
                    <div className={`p-4 rounded-xl ${bgTheme} border ${borderTheme}`}>
                        {data.diet?.plain_text ? (
                            <ul className="space-y-2">
                                {data.diet.plain_text.split('. ').map((point: string, i: number) => point.trim() && (
                                    <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700 leading-relaxed">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: themeColor }}></span>
                                        {point.trim().replace('.', '')}
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-xs text-slate-500 italic">No diet profile generated.</p>}
                    </div>
                </div>

                {/* AI Recommendations */}
                <div>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                        <CheckCircle className="w-4 h-4 text-slate-400" />
                        <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">AI Action Plan</h3>
                    </div>
                    <ul className="space-y-2">
                        {(data.recommendations || []).map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: themeColor }} />
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Notes Section */}
            <section className="break-inside-avoid">
                <div className="mb-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <User className="w-3 h-3" /> Patient Confidence / Feeling
                    </h3>
                    <div className="p-4 bg-slate-50 border-l-4 border-slate-300 italic text-sm text-slate-600 rounded-r-lg">
                        "{data.userNote || 'No notes added by patient.'}"
                    </div>
                </div>

                {/* Doctor Note Placeholder if needed or disclaimer */}
                <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed text-justify">
                    <strong className="text-slate-600 uppercase">Medical Disclaimer:</strong> This report is generated by an AI diagnostic support system (LungVision v2.0). It analyzes symptoms and biomarkers to estimate risk but DOES NOT replace a clinical diagnosis by a certified medical professional. The risk scores and recommendations are distinct from a doctor's prescription.
                </div>
            </section>
        </div>
    );
});

MedicalReceipt.displayName = 'MedicalReceipt';

export default MedicalReceipt;
