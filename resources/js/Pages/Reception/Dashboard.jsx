import ReceptionLayout from '@/Layouts/ReceptionLayout';
import { Head, router, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ appointments, filters, doctors, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        age: '',
        gender: 'Male',
        address: '',
        city: 'Purnea',
        doctor_id: '',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '10:00:00',
        amount: '',
        settlement: true,
        notes: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('reception.dashboard'), { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key, value) => {
        router.get(route('reception.dashboard'), { ...filters, [key]: value }, { preserveState: true });
    };

    const handleDoctorSelect = (id) => {
        const doc = doctors.find(d => d.id == id);
        setData(prev => ({
            ...prev,
            doctor_id: id,
            amount: doc ? doc.fee : ''
        }));
    };

    const submitBooking = (e) => {
        e.preventDefault();
        post(route('reception.appointment.store'), {
            onSuccess: () => {
                setIsRegModalOpen(false);
                setStep(1);
                reset();
            }
        });
    };

    const updateStatus = (id, status) => {
        router.patch(route('reception.appointment.status', id), { status });
    };

    const collectPayment = (id) => {
        if (confirm('Confirm payment collection?')) {
            router.post(route('reception.appointment.collect', id));
        }
    };

    const downloadTomorrow = () => {
        window.location.href = route('reception.download.tomorrow');
    };

    return (
        <ReceptionLayout>
            <Head title="Reception Dashboard" />

            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Front Desk Ledger</h2>
                        <p className="text-slate-500 font-medium">Managing patient registrations and clinical queue</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                            {['today', 'tomorrow'].map(d => (
                                <button 
                                    key={d}
                                    onClick={() => handleFilter('date', d)}
                                    className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                        filters.date === d ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={downloadTomorrow}
                                className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-100 shadow-sm flex items-center gap-3"
                            >
                                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
                                Export Tomorrow
                            </button>
                            <button 
                                onClick={() => setIsRegModalOpen(true)}
                                className="px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3"
                            >
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                New Registration
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Ledger */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Footfall</p>
                            <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{stats.total}</h4>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Queue</p>
                            <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{stats.checked_in}</h4>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Void Transactions</p>
                            <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{stats.cancelled}</h4>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Active Registrations</h3>
                        <form onSubmit={handleSearch} className="relative w-full md:w-96">
                            <input 
                                type="text" 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-700"
                                placeholder="Search by name or mobile..."
                            />
                            <svg className="w-5 h-5 absolute left-4 top-4.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </form>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Q-No</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultant</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {appointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-black/10">
                                                {apt.queue_number}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-800 leading-tight uppercase tracking-tight">{apt.patient.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{apt.patient.phone}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-700">Dr. {apt.doctor.user.name}</p>
                                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{apt.appointment_time}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${apt.payment?.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                    {apt.payment?.status}
                                                </span>
                                                {apt.payment?.status === 'due' && (
                                                    <button 
                                                        onClick={() => collectPayment(apt.id)}
                                                        className="text-[9px] font-black text-slate-900 hover:text-amber-600 transition-colors uppercase tracking-widest underline decoration-2 underline-offset-4"
                                                    >
                                                        Collect ₹{apt.doctor.fee}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select 
                                                value={apt.status}
                                                onChange={(e) => updateStatus(apt.id, e.target.value)}
                                                className={`text-[10px] font-black uppercase tracking-widest border-none rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer ${
                                                    apt.status === 'checked_in' ? 'bg-blue-50 text-blue-600' : 
                                                    apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 
                                                    'bg-red-50 text-red-600'
                                                }`}
                                            >
                                                <option value="checked_in">Checked In</option>
                                                <option value="confirmed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link 
                                                    href={route('reception.appointment.edit', apt.id)}
                                                    className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 shadow-sm transition-all hover:scale-105"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </Link>
                                                <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-amber-600 shadow-sm transition-all hover:scale-105">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            {isRegModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Patient Registration</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Step {step} of 3</p>
                            </div>
                            <button onClick={() => { setIsRegModalOpen(false); setStep(1); }} className="p-3 hover:bg-white rounded-2xl transition-colors shadow-sm">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={submitBooking} className="p-14">
                            {step === 1 && (
                                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Patient Full Name</label>
                                            <input 
                                                type="text" 
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                                placeholder="Enter full name"
                                            />
                                            {errors.name && <p className="text-red-500 text-[10px] font-bold mt-2">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Mobile Number</label>
                                            <input 
                                                type="tel" 
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                                placeholder="10-digit mobile"
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
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Address / Locality</label>
                                            <input 
                                                type="text" 
                                                value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                                placeholder="Street, area, or colony"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-6 border-t border-slate-50">
                                        <button 
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="px-12 py-5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-500/30 transition-all hover:scale-105"
                                        >
                                            Next: Appointment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Select Consultant</label>
                                            <select 
                                                value={data.doctor_id}
                                                onChange={e => handleDoctorSelect(e.target.value)}
                                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                            >
                                                <option value="">Select Doctor...</option>
                                                {doctors.map(doc => (
                                                    <option key={doc.id} value={doc.id}>Dr. {doc.user.name} ({doc.department.name})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Date</label>
                                                <input 
                                                    type="date" 
                                                    value={data.appointment_date}
                                                    onChange={e => setData('appointment_date', e.target.value)}
                                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Slot Time</label>
                                                <input 
                                                    type="time" 
                                                    value={data.appointment_time}
                                                    onChange={e => setData('appointment_time', e.target.value)}
                                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Consultation Fee</label>
                                            <input 
                                                type="number" 
                                                value={data.amount}
                                                readOnly
                                                className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl font-black text-slate-800"
                                            />
                                        </div>
                                        <div className="flex items-center gap-6 bg-slate-50 p-6 rounded-2xl">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input 
                                                    type="checkbox" 
                                                    checked={data.settlement}
                                                    onChange={e => setData('settlement', e.target.checked)}
                                                    className="w-6 h-6 rounded-lg border-slate-200 text-amber-600 focus:ring-amber-500" 
                                                />
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Immediate Payment (Collect Cash)</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex justify-between pt-6 border-t border-slate-50">
                                        <button 
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="px-10 py-5 bg-white text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm border border-slate-100 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setStep(3)}
                                            className="px-12 py-5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-500/30 transition-all"
                                        >
                                            Next: Final Review
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                    <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-dashed border-slate-200">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 text-center">Summary of Registration</h4>
                                        <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient</p>
                                                <p className="text-xl font-black text-slate-800 uppercase leading-none">{data.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Consulting Under</p>
                                                <p className="text-xl font-black text-slate-800 uppercase leading-none">
                                                    Dr. {doctors.find(d => d.id == data.doctor_id)?.user.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
                                                <p className="text-lg font-bold text-slate-700 leading-none">
                                                    {data.appointment_date} • {data.appointment_time}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee Status</p>
                                                <p className="text-lg font-black text-emerald-600 leading-none">
                                                    ₹{data.amount} • {data.settlement ? 'COLLECTED' : 'PENDING'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between pt-6">
                                        <button 
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="px-10 py-5 bg-white text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm border border-slate-100 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="px-12 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95"
                                        >
                                            {processing ? 'Processing...' : 'Complete Registration'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </ReceptionLayout>
    );
}
