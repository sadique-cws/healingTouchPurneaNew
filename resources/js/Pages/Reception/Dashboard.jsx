import ReceptionLayout from '@/Layouts/ReceptionLayout';
import { Head, router, useForm, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard({ appointments = [], filters = {}, doctors = [], stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsMessage, setSlotsMessage] = useState('');

    const todayDate = new Date().toISOString().split('T')[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        age: '',
        gender: 'male',
        address: '',
        city: 'Purnea',
        doctor_id: '',
        appointment_date: todayDate,
        appointment_time: '',
        amount: '',
        settlement: true,
        notes: '',
    });

    const selectedDoctor = doctors.find(d => String(d.id) === String(data.doctor_id));

    const confirmAction = (message) => window.confirm(message);

    const getSlotMeta = (slot) => {
        if (slot?.status === 'elapsed') {
            return {
                label: 'Past Slot',
                button: 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed',
            };
        }

        const booked = Number(slot?.booked ?? 0);
        const remaining = Math.max(0, 4 - booked);

        if (remaining >= 3) {
            return {
                label: 'Available (3-4 slots)',
                button: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
            };
        }

        if (remaining === 2) {
            return {
                label: 'Filling Up (2 slots)',
                button: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100',
            };
        }

        if (remaining === 1) {
            return {
                label: 'Almost Full (1 slot)',
                button: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100',
            };
        }

        return {
            label: 'Full (0 slots)',
            button: 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed',
        };
    };

    const groupSlots = (slots) => {
        const groups = { morning: [], afternoon: [], evening: [] };

        (slots || []).forEach((slot) => {
            const [timePart, meridiem] = String(slot.slot || '').split(' ');
            const hourPart = Number((timePart || '0:00').split(':')[0]);
            let hour24 = hourPart % 12;

            if (String(meridiem).toUpperCase() === 'PM') {
                hour24 += 12;
            }

            if (hour24 < 12) {
                groups.morning.push(slot);
            } else if (hour24 < 16) {
                groups.afternoon.push(slot);
            } else {
                groups.evening.push(slot);
            }
        });

        return groups;
    };

    const slotGroups = groupSlots(availableSlots);

    useEffect(() => {
        if (!selectedDoctor?.slug || !data.appointment_date) {
            setAvailableSlots([]);
            setSlotsMessage('');
            return;
        }

        let isMounted = true;
        setLoadingSlots(true);
        setSlotsMessage('');

        axios.post(route('api.appointment.slots'), {
            doctor_slug: selectedDoctor.slug,
            date: data.appointment_date,
        }).then((res) => {
            if (!isMounted) return;
            setAvailableSlots(res.data.slots || []);
            setSlotsMessage(res.data.message || res.data.error || '');
        }).catch((error) => {
            if (!isMounted) return;
            setAvailableSlots([]);
            setSlotsMessage(error?.response?.data?.error || error?.response?.data?.message || 'No appointment slots available.');
        }).finally(() => {
            if (!isMounted) return;
            setLoadingSlots(false);
        });

        return () => {
            isMounted = false;
        };
    }, [selectedDoctor?.slug, data.appointment_date]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('reception.dashboard'), { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key, value) => {
        router.get(route('reception.dashboard'), { ...filters, [key]: value }, { preserveState: true });
    };

    const handleDoctorSelect = (id) => {
        const doc = doctors.find(d => d.id == id);
        setData('doctor_id', id);
        setData('amount', doc ? doc.fee : '');
        setData('appointment_time', '');
        setSlotsMessage('');
    };

    const submitBooking = (e) => {
        e.preventDefault();

        if (!confirmAction('Complete this registration?')) {
            return;
        }
        
        // Validate required fields before submission
        const requiredFields = ['name', 'phone', 'age', 'gender', 'address', 'doctor_id', 'appointment_date', 'appointment_time', 'amount'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            setSlotsMessage('Please complete all required fields and select an available slot.');
            setStep(2);
            return;
        }

        if (!selectedDoctor?.slug) {
            setSlotsMessage('Please select a doctor before booking.');
            setStep(2);
            return;
        }

        if (!data.appointment_time) {
            setSlotsMessage('Please select an available time slot.');
            setStep(2);
            return;
        }

        post(route('reception.appointment.store'), {
            onSuccess: () => {
                setIsRegModalOpen(false);
                setStep(1);
                reset();
            },
            onError: (errors) => {
                console.error('Registration errors:', errors);
                setStep(2);
            }
        });
    };

    const updateStatus = (id, status) => {
        if (!confirmAction(`Change appointment status to ${status.replace('_', ' ')}?`)) {
            return;
        }
        router.patch(route('reception.appointment.status', id), { status });
    };

    const collectPayment = (id) => {
        if (confirmAction('Confirm payment collection?')) {
            router.post(route('reception.appointment.collect', id));
        }
    };

    const downloadTomorrow = () => {
        window.location.href = route('reception.download.tomorrow');
    };

    return (
        <ReceptionLayout>
            <Head title="Reception Dashboard" />

            <div className="space-y-6 md:space-y-8">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 md:gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Front Desk Ledger</h2>
                        <p className="text-slate-500 font-medium">Managing patient registrations and clinical queue</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                        <div className="flex bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                            {['today', 'tomorrow'].map(d => (
                                <button 
                                    key={d}
                                    onClick={() => handleFilter('date', d)}
                                    className={`px-4 md:px-5 py-2.5 rounded-md font-black text-[11px] uppercase tracking-widest transition-all ${
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
                                className="px-4 md:px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-black text-[11px] uppercase tracking-widest border border-slate-100 shadow-sm flex items-center gap-2.5"
                            >
                                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
                                Export Tomorrow
                            </button>
                            <button 
                                onClick={() => setIsRegModalOpen(true)}
                                className="px-5 md:px-7 py-3.5 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2.5"
                            >
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                New Registration
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Ledger */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                            <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Footfall</p>
                            <h4 className="text-2xl font-black text-slate-800 tracking-tighter mt-0.5">{stats.total}</h4>
                        </div>
                    </div>
                    <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Queue</p>
                            <h4 className="text-2xl font-black text-slate-800 tracking-tighter mt-0.5">{stats.checked_in}</h4>
                        </div>
                    </div>
                    <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Void Transactions</p>
                            <h4 className="text-3xl font-black text-slate-800 tracking-tighter">{stats.cancelled}</h4>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 md:p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Active Registrations</h3>
                            <form onSubmit={handleSearch} className="relative w-full md:w-80 lg:w-96">
                            <input 
                                type="text" 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-700"
                                placeholder="Search by name or mobile..."
                            />
                            <svg className="w-5 h-5 absolute left-4 top-4.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </form>
                    </div>

                    <div className="md:hidden divide-y divide-slate-100">
                        {appointments.map((apt) => (
                            <div key={apt.id} className="p-4 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-black/10">
                                                {apt.queue_number}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 leading-tight uppercase tracking-tight">{apt.patient.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{apt.patient.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${apt.payment?.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {apt.payment?.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Doctor</p>
                                        <p className="mt-1 text-sm font-bold text-slate-700">Dr. {apt.doctor.user.name}</p>
                                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-1">{apt.appointment_time}</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                        <select 
                                            value={apt.status}
                                            onChange={(e) => updateStatus(apt.id, e.target.value)}
                                            className={`mt-1 w-full text-[10px] font-black uppercase tracking-widest border-none rounded-lg px-3 py-2 focus:ring-0 cursor-pointer ${
                                                apt.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                                apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                                apt.status === 'checked_in' ? 'bg-blue-50 text-blue-600' : 
                                                'bg-red-50 text-red-600'
                                            }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="checked_in">Checked In</option>
                                            <option value="confirmed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {apt.payment?.status === 'due' && (
                                        <button 
                                            onClick={() => collectPayment(apt.id)}
                                            className="flex-1 py-3 bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest"
                                        >
                                            Collect ₹{apt.doctor.fee}
                                        </button>
                                    )}
                                    <Link 
                                        href={route('reception.appointment.edit', apt.id)}
                                        className="flex-1 py-3 bg-white border border-slate-100 rounded-lg text-slate-700 font-black text-[10px] uppercase tracking-widest text-center"
                                    >
                                        Edit
                                    </Link>
                                    <a
                                        href={route('appointment.receipt', apt.id)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-3 bg-amber-50 text-amber-600 rounded-lg font-black text-[10px] uppercase tracking-widest text-center"
                                        title="Print PDF Receipt"
                                    >
                                        PDF
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left min-w-[980px]">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Queue</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultant</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {appointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-black/10">
                                                {apt.queue_number}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
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
                                                className={`text-[10px] font-black uppercase tracking-widest border-none rounded-md px-3 py-1.5 focus:ring-0 cursor-pointer ${
                                                    apt.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                                    apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                                    apt.status === 'checked_in' ? 'bg-blue-50 text-blue-600' : 
                                                    'bg-red-50 text-red-600'
                                                }`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="checked_in">Checked In</option>
                                                <option value="confirmed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link 
                                                    href={route('reception.appointment.edit', apt.id)}
                                                    className="p-3 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-slate-900 shadow-sm transition-all hover:scale-105"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </Link>
                                                <a
                                                    href={route('appointment.receipt', apt.id)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-amber-600 shadow-sm transition-all hover:scale-105"
                                                    title="Print PDF Receipt"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                                </a>
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
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm" style={{backdropFilter: 'blur(4px)'}}>
                    <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
                        <div className="p-5 sm:p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Patient Registration</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Step {step} of 3</p>
                            </div>
                            <button onClick={() => { setIsRegModalOpen(false); setStep(1); }} className="p-2.5 hover:bg-white rounded-lg transition-colors shadow-sm">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={submitBooking} className="p-4 sm:p-5 md:p-8 overflow-y-auto flex-1">
                            {Object.keys(errors).length > 0 && (
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Validation Errors</p>
                                    <ul className="space-y-1">
                                        {Object.entries(errors).map(([field, message]) => (
                                            <li key={field} className="text-[11px] text-red-600 font-bold">• {message}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Patient Full Name</label>
                                            <input 
                                                type="text" 
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                                placeholder="Enter full name"
                                            />
                                            {errors.name && <p className="text-red-500 text-[10px] font-bold mt-2">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Mobile Number</label>
                                            <input 
                                                type="tel" 
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                                placeholder="10-digit mobile"
                                                maxLength="10"
                                            />
                                            {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-2">{errors.phone}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Age</label>
                                                <input 
                                                    type="number" 
                                                    value={data.age}
                                                    onChange={e => setData('age', e.target.value)}
                                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Gender</label>
                                                <select 
                                                    value={data.gender}
                                                    onChange={e => setData('gender', e.target.value)}
                                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                                >
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Address / Locality</label>
                                            <input 
                                                type="text" 
                                                value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                                placeholder="Street, area, or colony"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-6 border-t border-slate-50">
                                        <button 
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-500/30 transition-all"
                                        >
                                            Next: Appointment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Select Consultant</label>
                                            <select 
                                                value={data.doctor_id}
                                                onChange={e => handleDoctorSelect(e.target.value)}
                                                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                            >
                                                <option value="">Select Doctor...</option>
                                                {doctors && doctors.length > 0 ? doctors.map(doc => (
                                                    <option key={doc.id} value={doc.id}>
                                                        Dr. {doc.user?.name || 'Unknown'} ({doc.department?.name || 'Unassigned'})
                                                    </option>
                                                )) : <option disabled>No doctors available</option>}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Date</label>
                                                <input 
                                                    type="date" 
                                                    value={data.appointment_date}
                                                    onChange={e => setData('appointment_date', e.target.value)}
                                                    min={todayDate}
                                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-800"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Available Time Slots</label>
                                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Selected Date • {data.appointment_date}</span>
                                            </div>

                                            {slotsMessage && (
                                                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-[11px] font-bold">
                                                    {slotsMessage}
                                                </div>
                                            )}

                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                {loadingSlots ? (
                                                    <div className="py-6 text-center">
                                                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
                                                    </div>
                                                ) : availableSlots.length > 0 ? (
                                                    <div className="space-y-5">
                                                        {[
                                                            { key: 'morning', label: 'Morning' },
                                                            { key: 'afternoon', label: 'Afternoon' },
                                                            { key: 'evening', label: 'Evening' },
                                                        ].map((group) => {
                                                            const slots = slotGroups[group.key] || [];

                                                            return slots.length ? (
                                                                <div key={group.key}>
                                                                    <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                                        <span>{group.label}</span>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2.5">
                                                                        {slots.map((slot) => {
                                                                            const meta = getSlotMeta(slot);
                                                                            const isActive = data.appointment_time === slot.slot;

                                                                            return (
                                                                                <button
                                                                                    key={slot.slot}
                                                                                    type="button"
                                                                                    disabled={!slot.bookable}
                                                                                    onClick={() => slot.bookable && setData('appointment_time', slot.slot)}
                                                                                    className={`py-2.5 px-2 rounded-lg border text-xs font-black transition-all ${isActive ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10' : meta.button}`}
                                                                                >
                                                                                    {slot.slot}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            ) : null;
                                                        })}

                                                        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Available</span>
                                                            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />Filling</span>
                                                            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" />Almost Full</span>
                                                            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" />Full</span>
                                                            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" />Past</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="py-8 text-center rounded-lg border border-dashed border-slate-200 bg-white">
                                                        <p className="text-sm font-bold text-slate-700">No slots found for this doctor.</p>
                                                        <p className="text-xs text-slate-500 mt-1">Select another doctor or check back later.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Consultation Fee</label>
                                            <input 
                                                type="number" 
                                                value={data.amount}
                                                readOnly
                                                className="w-full px-4 py-3.5 bg-slate-100 border-none rounded-lg font-black text-slate-800"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg">
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
                                    <div className="flex justify-between pt-5 border-t border-slate-50 gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="px-6 py-4 bg-white text-slate-500 rounded-lg font-black text-xs uppercase tracking-widest shadow-sm border border-slate-100 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setStep(3)}
                                            disabled={!data.appointment_time || loadingSlots}
                                            className="px-6 py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-500/30 transition-all"
                                        >
                                            Next: Final Review
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                                    <div className="bg-slate-50 p-5 md:p-7 rounded-lg border-2 border-dashed border-slate-200">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center">Summary of Registration</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient</p>
                                                <p className="text-xl font-black text-slate-800 uppercase leading-none">{data.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Consulting Under</p>
                                                <p className="text-xl font-black text-slate-800 uppercase leading-none">
                                                    Dr. {doctors.find(d => d.id == data.doctor_id)?.user?.name || 'Unassigned'}
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
                                    
                                    <div className="flex justify-between pt-5 gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="px-6 py-4 bg-white text-slate-500 rounded-lg font-black text-xs uppercase tracking-widest shadow-sm border border-slate-100 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="px-6 py-4 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95"
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
