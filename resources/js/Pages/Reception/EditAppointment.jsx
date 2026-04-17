import ReceptionLayout from '@/Layouts/ReceptionLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function EditAppointment({ appointment, doctors }) {
    const { data, setData, put, processing, errors } = useForm({
        name: appointment.patient.name,
        phone: appointment.patient.phone,
        age: appointment.patient.age,
        gender: appointment.patient.gender,
        address: appointment.patient.address,
        city: appointment.patient.city,
        doctor_id: appointment.doctor_id,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
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

            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-start gap-4 flex-wrap">
                    <Link href={route('reception.dashboard')} className="p-3 bg-white rounded-lg text-slate-400 hover:text-amber-600 shadow-sm border border-slate-100 transition-all hover:scale-105">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <div className="flex-1 min-w-[240px]">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Modify Record</h2>
                        <p className="text-slate-500 font-medium text-sm md:text-base">Updating appointment details for #{appointment.appointment_no}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
                            <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-600">Reception Desk</span>
                            <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">Compact Edit</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.75fr] gap-6 items-start">
                    <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-5 sm:p-6 md:p-8 space-y-7">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                    Patient Particulars
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Full Legal Name</label>
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800" />
                                        {errors.name && <p className="text-red-500 text-[10px] font-bold mt-2">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Contact Number</label>
                                        <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800" />
                                        {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-2">{errors.phone}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Age</label>
                                            <input type="number" value={data.age} onChange={e => setData('age', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Gender</label>
                                            <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800">
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Residential Address</label>
                                        <input type="text" value={data.address} onChange={e => setData('address', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                    Clinical Assignment
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Assign Consultant</label>
                                        <select value={data.doctor_id} onChange={e => setData('doctor_id', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800">
                                            {doctors.map(doc => (
                                                <option key={doc.id} value={doc.id}>Dr. {doc.user?.name || 'Unknown'} ({doc.department?.name || 'General'})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Schedule Date</label>
                                            <input type="date" value={data.appointment_date} onChange={e => setData('appointment_date', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Time Slot</label>
                                            <input type="time" value={data.appointment_time} onChange={e => setData('appointment_time', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 md:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                            <Link href={route('reception.dashboard')} className="px-6 py-3.5 text-center bg-white text-slate-500 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-sm border border-slate-100">Cancel Changes</Link>
                            <button type="submit" disabled={processing} className="px-7 py-3.5 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                                {processing ? 'Saving...' : 'Confirm Update'}
                            </button>
                        </div>
                    </form>

                    <aside className="space-y-5">
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 md:p-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Quick Summary</h4>
                            <div className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between gap-4"><span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Appointment</span><span className="font-black text-slate-800">#{appointment.appointment_no}</span></div>
                                <div className="flex justify-between gap-4"><span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Patient</span><span className="font-black text-slate-800 truncate">{appointment.patient?.name}</span></div>
                                <div className="flex justify-between gap-4"><span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Doctor</span><span className="font-black text-slate-800 truncate">Dr. {appointment.doctor?.user?.name}</span></div>
                                <div className="flex justify-between gap-4"><span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Status</span><span className="font-black text-amber-600 uppercase tracking-widest text-[10px]">{appointment.status}</span></div>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-xl border border-amber-100 p-5 md:p-6">
                            <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-[0.3em]">Notes</h4>
                            <p className="mt-3 text-sm leading-relaxed text-amber-900/80 font-medium">Keep the edit screen minimal. Save only date, time, consultant and patient details here.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </ReceptionLayout>
    );
}
