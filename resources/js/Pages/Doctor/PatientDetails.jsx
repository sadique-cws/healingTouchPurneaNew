import DoctorLayout from '@/Layouts/DoctorLayout';
import { Head, Link } from '@inertiajs/react';

export default function PatientDetails({ appointment }) {
    const patient = appointment.patient;

    const statusStyles = {
        'confirmed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'pending': 'bg-amber-50 text-amber-600 border-amber-100',
        'cancelled': 'bg-red-50 text-red-600 border-red-100',
        'checked_in': 'bg-blue-50 text-blue-600 border-blue-100',
        'completed': 'bg-slate-100 text-slate-600 border-slate-200'
    };

    return (
        <DoctorLayout>
            <Head title={`Patient: ${patient.name}`} />

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4">
                    <Link 
                        href={route('doctor.dashboard')}
                        className="p-3 bg-white rounded-2xl text-slate-400 hover:text-teal-600 shadow-sm border border-slate-100 transition-all hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            Patient Record
                            <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg border font-black ${statusStyles[appointment.status] || 'bg-slate-100'}`}>
                                {appointment.status}
                            </span>
                        </h2>
                        <p className="text-slate-500 font-medium">Detailed medical case for appointment #{appointment.appointment_no}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Patient Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="h-32 bg-teal-600 relative">
                                <div className="absolute -bottom-12 left-8">
                                    <div className="w-24 h-24 bg-white rounded-[2rem] p-1.5 shadow-xl">
                                        <div className="w-full h-full bg-slate-100 rounded-[1.7rem] flex items-center justify-center text-3xl font-black text-slate-300">
                                            {patient.name.charAt(0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-16 pb-10 px-8">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{patient.name}</h3>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Medical Record ID: HP-{patient.id}</p>
                                
                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                                            <p className="font-bold text-slate-700">{patient.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                            <p className="font-bold text-slate-700">{patient.email || 'Not Provided'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Home Location</p>
                                            <p className="font-bold text-slate-700">{patient.address || 'Purnea, Bihar'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical & Appointment Data */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Appointment Overview</h3>
                            <div className="grid grid-cols-2 gap-10">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Scheduled Date</p>
                                    <p className="text-xl font-black text-slate-800 px-1">{new Date(appointment.appointment_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Consultation Time</p>
                                    <p className="text-xl font-black text-slate-800 px-1">{appointment.appointment_time || '09:00 AM'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Department</p>
                                    <p className="text-xl font-black text-teal-600 px-1 uppercase tracking-tight">{appointment.doctor.department.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Payment Type</p>
                                    <p className="text-xl font-black text-slate-800 px-1">{appointment.payment?.mode || 'Hospital OPD Counter'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white p-12 rounded-[4rem] relative overflow-hidden shadow-2xl shadow-slate-900/30">
                            <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/2 -translate-y-1/2">
                                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" /></svg>
                            </div>
                            <h3 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-4 relative z-10">Chief Complaint / Case Notes</h3>
                            <div className="space-y-6 relative z-10">
                                <p className="text-xl font-medium leading-relaxed opacity-90 italic"> Patient is visiting for a routine follow-up regarding {appointment.doctor.department.name.toLowerCase()} consultation. Check for stability and vital metrics. </p>
                                <div className="pt-8 flex gap-4">
                                    <button className="px-8 py-4 bg-teal-600 hover:bg-teal-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Add Clinical Note</button>
                                    <button className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Previous Records</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}
