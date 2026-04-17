import ReceptionLayout from '@/Layouts/ReceptionLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function EditAppointment({ appointment, doctors }) {
    const { data, setData, put, processing, errors } = useForm({
        name: appointment.patient?.name || '',
        phone: appointment.patient?.phone || '',
        age: appointment.patient?.age || '',
        gender: appointment.patient?.gender || 'Male',
        address: appointment.patient?.address || '',
        city: appointment.patient?.city || 'Purnea',
        doctor_id: appointment.doctor_id || '',
        appointment_date: appointment.appointment_date || '',
        appointment_time: appointment.appointment_time || '',
        notes: appointment.notes || '',
    });

    const confirmAction = (message) => window.confirm(message);

    const submit = (e) => {
        e.preventDefault();
        if (confirmAction('Update this appointment?')) {
            put(route('reception.appointment.update', appointment.id));
        }
    };

    return (
        <ReceptionLayout>
            <Head title="Edit Appointment" />

            <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
                
                {/* Header Area */}
                <div className="flex items-start gap-3 flex-wrap p-3.5 md:p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <Link href={route('reception.dashboard')} className="p-2.5 bg-white rounded-lg text-slate-500 hover:text-amber-600 shadow-sm border border-slate-200 transition-all hover:scale-105 active:scale-95">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <div className="flex-1 min-w-[240px]">
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none">Modify Record</h2>
                        <p className="text-slate-500 font-bold text-sm mt-1.5">Updating details for appointment <span className="text-slate-800">#{appointment.appointment_no}</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 lg:gap-6 items-start">
                    {/* Main Form Box */}
                    <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
                        <div className="p-4 md:p-6 space-y-6">
                            
                            {/* Patient Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-4">
                                    Patient Particulars
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2.5">Full Legal Name</label>
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:bg-white focus:border-amber-500 font-bold text-slate-800 text-sm md:text-base transition-all" />
                                        {errors.name && <p className="text-red-500 text-xs font-bold mt-2.5">{errors.name}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2.5">Contact Number</label>
                                        <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:bg-white focus:border-amber-500 font-bold text-slate-800 text-sm md:text-base transition-all" />
                                        {errors.phone && <p className="text-red-500 text-xs font-bold mt-2.5">{errors.phone}</p>}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2.5">Age</label>
                                            <input type="number" value={data.age} onChange={e => setData('age', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:bg-white focus:border-amber-500 font-bold text-slate-800 text-sm md:text-base transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2.5">Gender</label>
                                            <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:bg-white focus:border-amber-500 font-bold text-slate-800 text-sm md:text-base transition-all appearance-none cursor-pointer">
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2.5">Residential Address</label>
                                        <input type="text" value={data.address} onChange={e => setData('address', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:bg-white focus:border-amber-500 font-bold text-slate-800 text-sm md:text-base transition-all" />
                                    </div>
                                </div>
                            </div>

                            {/* Clinical Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-4 pt-4">
                                    Clinical Assignment
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2.5">Assign Consultant</label>
                                        <select value={data.doctor_id} onChange={e => setData('doctor_id', e.target.value)} className="w-full px-4 py-3.5 bg-amber-50/50 border border-amber-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:bg-white focus:border-amber-500 font-bold text-slate-800 text-sm md:text-base transition-all">
                                            {doctors.map(doc => (
                                                <option key={doc.id} value={doc.id}>Dr. {doc.user?.name || 'Unknown'} - {doc.department?.name || 'General'}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2.5">Schedule Date</label>
                                        <input type="date" value={data.appointment_date} onChange={e => setData('appointment_date', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:bg-white focus:border-amber-500 font-bold text-slate-800 text-sm md:text-base transition-all" />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2.5">Time Slot</label>
                                        <input type="time" value={data.appointment_time} onChange={e => setData('appointment_time', e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:bg-white focus:border-amber-500 font-bold text-slate-800 text-sm md:text-base transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="sticky bottom-0 z-10 p-3.5 md:p-4 bg-white/95 backdrop-blur border-t border-slate-200 flex flex-col sm:flex-row justify-end gap-3">
                            <Link href={route('reception.dashboard')} className="w-full sm:w-auto px-6 py-3 text-center bg-white text-slate-600 rounded-lg font-black text-[11px] uppercase tracking-widest shadow-sm border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                Cancel Changes
                            </Link>
                            <button type="submit" disabled={processing} className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50">
                                {processing ? 'Processing...' : 'Confirm Update'}
                            </button>
                        </div>
                    </form>

                    {/* Sidebar Information Panel */}
                    <aside className="space-y-4 w-full hidden lg:block">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 w-full">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Brief Overview</h4>
                            <div className="mt-5 space-y-4 text-base">
                                <div className="border-b border-slate-100 pb-3">
                                    <span className="block text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Appointment #</span>
                                    <span className="font-black text-slate-800 text-lg">{appointment.appointment_no}</span>
                                </div>
                                <div className="border-b border-slate-100 pb-3">
                                    <span className="block text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Patient Name</span>
                                    <span className="font-bold text-slate-800 block truncate">{appointment.patient?.name}</span>
                                </div>
                                <div className="border-b border-slate-100 pb-3">
                                    <span className="block text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Doctor Assigned</span>
                                    <span className="font-bold text-slate-800 block truncate">Dr. {appointment.doctor?.user?.name}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Current State</span>
                                    <span className="inline-block px-3 py-1.5 rounded-lg font-black bg-amber-50 text-amber-700 uppercase tracking-widest text-[10px] border border-amber-100 mt-1">{appointment.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 w-full">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest">System Note</h4>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-amber-800 font-medium">Please review all modifications directly before submitting. Missing data defaults will not be verified here.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </ReceptionLayout>
    );
}
