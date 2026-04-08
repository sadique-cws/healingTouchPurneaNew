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

    const submit = (e) => {
        e.preventDefault();
        put(route('reception.appointment.update', appointment.id));
    };

    return (
        <ReceptionLayout>
            <Head title="Edit Appointment" />

            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4">
                    <Link 
                        href={route('reception.dashboard')}
                        className="p-3 bg-white rounded-2xl text-slate-400 hover:text-amber-600 shadow-sm border border-slate-100 transition-all hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Modify Record</h2>
                        <p className="text-slate-500 font-medium">Updating appointment details for #{appointment.appointment_no}</p>
                    </div>
                </div>

                <form onSubmit={submit} className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-12 space-y-10">
                        {/* Patient Information */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                Patient Particulars
                                <div className="h-px bg-slate-100 flex-1"></div>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Full Legal Name</label>
                                    <input 
                                        type="text" 
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                    />
                                    {errors.name && <p className="text-red-500 text-[10px] font-bold mt-2">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Contact Number</label>
                                    <input 
                                        type="tel" 
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                    />
                                    {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-2">{errors.phone}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Age</label>
                                        <input 
                                            type="number" 
                                            value={data.age}
                                            onChange={e => setData('age', e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Gender</label>
                                        <select 
                                            value={data.gender}
                                            onChange={e => setData('gender', e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Residential Address</label>
                                    <input 
                                        type="text" 
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Consultation Details */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                Clinical Assignment
                                <div className="h-px bg-slate-100 flex-1"></div>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Assign Consultant</label>
                                    <select 
                                        value={data.doctor_id}
                                        onChange={e => setData('doctor_id', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                    >
                                        {doctors.map(doc => (
                                            <option key={doc.id} value={doc.id}>Dr. {doc.user.name} ({doc.department.name})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Schedule Date</label>
                                        <input 
                                            type="date" 
                                            value={data.appointment_date}
                                            onChange={e => setData('appointment_date', e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Time Slot</label>
                                        <input 
                                            type="time" 
                                            value={data.appointment_time}
                                            onChange={e => setData('appointment_time', e.target.value)}
                                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                        <Link 
                            href={route('reception.dashboard')}
                            className="px-10 py-5 bg-white text-slate-500 rounded-3xl font-black text-xs uppercase tracking-widest shadow-sm border border-slate-100"
                        >
                            Cancel Changes
                        </Link>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="px-14 py-5 bg-slate-900 hover:bg-black text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Confirm Update'}
                        </button>
                    </div>
                </form>
            </div>
        </ReceptionLayout>
    );
}
