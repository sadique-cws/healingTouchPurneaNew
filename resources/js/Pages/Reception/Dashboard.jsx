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
    const [wizardError, setWizardError] = useState('');

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
    const inputBaseClass = 'w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/20 font-bold text-slate-800 text-sm md:text-base transition-all';

    const confirmAction = (message) => window.confirm(message);

    const getSlotMeta = (slot) => {
        if (slot?.status === 'elapsed') {
            return { label: 'Past Slot', button: 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' };
        }
        const remaining = Math.max(0, 4 - Number(slot?.booked ?? 0));
        if (remaining >= 3) return { label: 'Available', button: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/80 active:bg-emerald-200' };
        if (remaining === 2) return { label: 'Filling Up', button: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/80 active:bg-amber-200' };
        if (remaining === 1) return { label: 'Almost Full', button: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100/80 active:bg-rose-200' };
        return { label: 'Full', button: 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' };
    };

    const groupSlots = (slots) => {
        const groups = { morning: [], afternoon: [], evening: [] };
        (slots || []).forEach((slot) => {
            const [timePart, meridiem] = String(slot.slot || '').split(' ');
            const hourPart = Number((timePart || '0:00').split(':')[0]);
            let hour24 = hourPart % 12 + (String(meridiem).toUpperCase() === 'PM' ? 12 : 0);
            if (hour24 < 12) groups.morning.push(slot);
            else if (hour24 < 16) groups.afternoon.push(slot);
            else groups.evening.push(slot);
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
            setSlotsMessage(error?.response?.data?.error || error?.response?.data?.message || 'No slots available.');
        }).finally(() => {
            if (isMounted) setLoadingSlots(false);
        });
        return () => { isMounted = false; };
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
        if (!confirmAction('Complete this registration?')) return;
        
        const reqFields = ['name', 'phone', 'age', 'gender', 'address', 'doctor_id', 'appointment_date', 'appointment_time', 'amount'];
        if (reqFields.some(f => !data[f]) || !selectedDoctor?.slug) {
            setSlotsMessage('Please complete all required fields and select an available slot.');
            setStep(2);
            return;
        }

        post(route('reception.appointment.store'), {
            onSuccess: () => {
                setIsRegModalOpen(false);
                setStep(1);
                setWizardError('');
                reset();
            },
            onError: (errs) => { console.error('Reg err:', errs); setStep(2); }
        });
    };

    const validateStepOne = () => {
        if (!data.phone || String(data.phone).length !== 10) return 'Please enter a valid 10-digit mobile number.';
        if (!data.name?.trim()) return 'Please enter patient name.';
        if (!data.age) return 'Please enter age.';
        if (!data.gender) return 'Please select gender.';
        if (!data.address?.trim()) return 'Please enter address/locality.';
        return '';
    };

    const validateStepTwo = () => {
        if (!data.doctor_id) return 'Please select a consultant.';
        if (!data.appointment_date) return 'Please select appointment date.';
        if (!selectedDoctor?.slug) return 'Selected doctor is invalid. Please re-select doctor.';
        if (!data.appointment_time) return 'Please select an available time slot.';
        if (!data.amount) return 'Consultation fee is missing.';
        return '';
    };

    const handleStepOneNext = () => {
        const errorMessage = validateStepOne();
        if (errorMessage) {
            setWizardError(errorMessage);
            return;
        }

        setWizardError('');
        setStep(2);
    };

    const handleStepTwoNext = () => {
        const errorMessage = validateStepTwo();
        if (errorMessage) {
            setWizardError(errorMessage);
            return;
        }

        setWizardError('');
        setStep(3);
    };

    const updateStatus = (id, status) => {
        if (confirmAction(`Change status to ${status.replace('_', ' ')}?`)) {
            router.patch(route('reception.appointment.status', id), { status });
        }
    };

    const collectPayment = (id) => {
        if (confirmAction('Confirm payment collection?')) {
            router.post(route('reception.appointment.collect', id));
        }
    };

    const downloadTomorrow = () => { window.location.href = route('reception.download.tomorrow'); };

    return (
        <ReceptionLayout>
            <Head title="Reception Dashboard" />

            <div className="pb-24 md:pb-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
                
                {/* Header Title */}
                <div className="pt-1 md:pt-0">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-none">Front Desk</h2>
                    <p className="text-sm text-slate-500 font-bold mt-1.5">Patient queue & registrations</p>
                </div>

                {/* Stats: mobile slider, laptop/desktop grid */}
                <div className="flex md:grid md:grid-cols-3 gap-3 overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory pb-1 w-full">
                    <StatCard icon={<FootfallIcon />} label="Footfall" value={stats.total} color="amber" />
                    <StatCard icon={<QueueIcon />} label="Queue" value={stats.checked_in} color="emerald" />
                    <StatCard icon={<CancelIcon />} label="Void" value={stats.cancelled} color="red" />
                </div>

                {/* Actions & Filters */}
                <div className="bg-white p-3.5 md:p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 items-center justify-between">
                    <form onSubmit={handleSearch} className="relative w-full md:flex-1 max-w-sm">
                        <input 
                            type="text" 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500/20"
                            placeholder="Mobile no. or name..."
                        />
                        <SearchIcon className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
                    </form>
                    
                    <div className="flex w-full md:w-auto items-center justify-between gap-2.5 overflow-x-auto no-scrollbar">
                        <div className="flex bg-slate-50 p-1 rounded-lg shrink-0">
                            {['today', 'tomorrow'].map(d => (
                                <button 
                                    key={d} onClick={() => handleFilter('date', d)}
                                    className={`px-4 py-2 rounded-md font-black text-[11px] uppercase tracking-widest transition-all ${
                                        filters.date === d ? 'bg-white text-amber-600 shadow-sm border border-amber-100' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button onClick={downloadTomorrow} className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200">
                                <ExportIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => setIsRegModalOpen(true)} className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-[11px] uppercase tracking-widest shadow-sm">
                                <PlusIcon className="w-4 h-4 text-amber-400" /> New Reg
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full">
                     {/* Mobile List View */}
                    <div className="md:hidden flex flex-col gap-2 w-full">
                        {appointments.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-500 text-sm font-bold">No active registrations found.</p>
                            </div>
                        ) : (
                            appointments.map(apt => (
                                <MobileAptCard 
                                    key={apt.id} 
                                    apt={apt} 
                                    collectPayment={collectPayment} 
                                    updateStatus={updateStatus} 
                                />
                            ))
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden w-full">
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left min-w-[980px]">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Token</th>
                                        <th className="px-4 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Patient</th>
                                        <th className="px-4 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Consultant</th>
                                        <th className="px-4 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Payment</th>
                                        <th className="px-4 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                        <th className="px-4 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {appointments.length === 0 && (
                                        <tr><td colSpan="6" className="py-12 text-center text-slate-500 text-sm font-bold">No records found.</td></tr>
                                    )}
                                    {appointments.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-4 py-3">
                                                <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center font-black text-sm shadow-sm border border-slate-200">
                                                    {apt.queue_number}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-black text-slate-900 leading-tight uppercase">{apt.patient.name}</p>
                                                <p className="text-xs font-bold text-slate-500 font-mono mt-1">{apt.patient.phone}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-bold text-slate-800">Dr. {apt.doctor.user.name}</p>
                                                <p className="text-xs font-black text-amber-600 uppercase tracking-widest mt-1">{apt.appointment_time}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col gap-2 items-start">
                                                    <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-widest ${apt.payment?.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                                        {apt.payment?.status}
                                                    </span>
                                                    {apt.payment?.status === 'due' && (
                                                        <button onClick={() => collectPayment(apt.id)} className="text-[11px] font-black text-slate-900 border-b-2 border-slate-300 hover:border-amber-500 hover:text-amber-600 transition-colors uppercase tracking-widest mt-1">
                                                            Collect ₹{apt.doctor.fee}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusSelect status={apt.status} onChange={(val) => updateStatus(apt.id, val)} />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('reception.appointment.edit', apt.id)} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                                                        <EditIcon className="w-4 h-4" />
                                                    </Link>
                                                    <a href={route('appointment.receipt', apt.id)} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-amber-600 hover:border-amber-200 transition-all shadow-sm">
                                                        <PrintIcon className="w-4 h-4" />
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
            </div>

            {/* Mobile Fixed Floating Action Button (App Feel) */}
            <button 
                onClick={() => setIsRegModalOpen(true)}
                className="md:hidden fixed bottom-5 right-5 w-14 h-14 bg-slate-900 text-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center border border-slate-800 active:scale-95 transition-transform z-40"
            >
                <PlusIcon className="w-6 h-6 text-amber-400" />
            </button>

            {/* Registration Modal */}
            {isRegModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-slate-900/45 backdrop-blur-sm">
                    <div className="bg-white w-full h-[100dvh] md:h-auto md:max-h-[88vh] md:max-w-4xl md:rounded-2xl rounded-none shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                        
                        {/* Header */}
                        <div className="flex-none p-4 md:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {step > 1 && (
                                    <button type="button" onClick={() => setStep(step - 1)} className="p-2.5 bg-white rounded-full shadow-sm text-slate-600 hover:text-amber-600 border border-slate-200">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                )}
                                <div>
                                    <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight leading-none">New Registration</h3>
                                    <p className="text-[11px] font-black text-amber-500 uppercase tracking-widest mt-1.5">Step {step} of 3</p>
                                    <StepProgress step={step} />
                                </div>
                            </div>
                            <button onClick={() => { setIsRegModalOpen(false); setStep(1); setWizardError(''); reset(); }} className="w-10 h-10 flex items-center justify-center bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-full transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        {/* Body scrollable */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-white relative no-scrollbar">
                            {Object.keys(errors).length > 0 && (
                                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-100">
                                    <ul className="list-disc pl-5 space-y-1">
                                        {Object.values(errors).map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                            )}

                            {wizardError && (
                                <div className="mb-4 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm font-bold border border-amber-200">
                                    {wizardError}
                                </div>
                            )}

                            <form id="regForm" onSubmit={submitBooking}>
                                {/* STEP 1 */}
                                <div className={`space-y-4 ${step === 1 ? 'block animate-in slide-in-from-right-4' : 'hidden'}`}>
                                    <InputField label="Mobile Number" error={errors.phone}>
                                        <input type="tel" maxLength="10" placeholder="10 Digits" className={inputBaseClass} value={data.phone} onChange={e => setData('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
                                    </InputField>
                                    <InputField label="Patient Name" error={errors.name}>
                                        <input type="text" placeholder="Full name" className={inputBaseClass} value={data.name} onChange={e => setData('name', e.target.value)} />
                                    </InputField>
                                    <div className="grid grid-cols-2 gap-3">
                                        <InputField label="Age">
                                            <input type="number" placeholder="Years" className={inputBaseClass} value={data.age} onChange={e => setData('age', e.target.value)} />
                                        </InputField>
                                        <InputField label="Gender">
                                            <select className={inputBaseClass} value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                                <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                                            </select>
                                        </InputField>
                                    </div>
                                    <InputField label="Locality / Address">
                                        <input type="text" placeholder="Area name" className={inputBaseClass} value={data.address} onChange={e => setData('address', e.target.value)} />
                                    </InputField>
                                </div>

                                {/* STEP 2 */}
                                <div className={`space-y-4 ${step === 2 ? 'block animate-in slide-in-from-right-4' : 'hidden'}`}>
                                    <InputField label="Select Consultant">
                                        <select className={`${inputBaseClass} border-amber-200 bg-amber-50/50 focus:bg-white`} value={data.doctor_id} onChange={e => handleDoctorSelect(e.target.value)}>
                                            <option value="">-- Choose Doctor --</option>
                                            {doctors.map(doc => (
                                                <option key={doc.id} value={doc.id}>Dr. {doc.user?.name} ({doc.department?.name})</option>
                                            ))}
                                        </select>
                                    </InputField>
                                    <InputField label="Appointment Date">
                                        <input type="date" min={todayDate} className={inputBaseClass} value={data.appointment_date} onChange={e => setData('appointment_date', e.target.value)} />
                                    </InputField>

                                    {slotsMessage && <p className="text-sm font-bold text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-100">{slotsMessage}</p>}
                                    
                                    <div className="bg-slate-50 border border-slate-200 p-3.5 md:p-4 rounded-xl">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Time Slots</label>
                                        {loadingSlots ? (
                                            <div className="h-24 flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"/></div>
                                        ) : availableSlots.length ? (
                                            <div className="space-y-5">
                                                {['morning', 'afternoon', 'evening'].map(g => slotGroups[g]?.length > 0 && (
                                                    <div key={g}>
                                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">{g}</p>
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
                                                            {slotGroups[g].map(slot => {
                                                                const active = data.appointment_time === slot.slot;
                                                                const meta = getSlotMeta(slot);
                                                                return (
                                                                    <button 
                                                                        key={slot.slot} type="button" disabled={!slot.bookable} onClick={() => slot.bookable && setData('appointment_time', slot.slot)}
                                                                        className={`py-2.5 rounded-lg text-xs font-black font-mono transition-all border ${active ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-105' : meta.button}`}
                                                                    >
                                                                        {slot.slot}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p className="text-sm text-slate-500 font-bold text-center py-6">No slots available for this doctor.</p>}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <InputField label="Fee Amount">
                                            <input type="text" readOnly className={`${inputBaseClass} font-mono bg-slate-200/50`} value={`₹ ${data.amount || 0}`} />
                                        </InputField>
                                        <div className="flex items-end pb-1.5">
                                            <label className="flex items-center justify-center gap-3 cursor-pointer bg-amber-50 px-4 py-3.5 rounded-xl border border-amber-200 w-full hover:bg-amber-100 transition-colors">
                                                <input type="checkbox" checked={data.settlement} onChange={e => setData('settlement', e.target.checked)} className="w-6 h-6 rounded text-amber-600 border-amber-300 focus:ring-0 focus:ring-offset-0" />
                                                <span className="text-xs font-black text-amber-900 uppercase tracking-widest">Paid (Cash)</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* STEP 3 */}
                                <div className={`space-y-4 ${step === 3 ? 'block animate-in fade-in zoom-in-95' : 'hidden'}`}>
                                    <div className="text-center py-8">
                                        <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full mx-auto flex items-center justify-center mb-5 border-4 border-amber-50">
                                            <ClipboardIcon className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-800">Ready to Book</h3>
                                        <p className="text-sm font-bold text-slate-500 mt-2">Please double check all the details.</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl space-y-4 font-mono text-base border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-center"><span className="text-slate-400 font-black uppercase tracking-widest text-xs">Patient</span><span className="font-bold text-slate-800 text-right">{data.name}<span className="block text-sm text-slate-500">{data.phone}</span></span></div>
                                        <div className="flex justify-between items-center"><span className="text-slate-400 font-black uppercase tracking-widest text-xs">Doctor</span><span className="font-bold text-slate-800">Dr. {doctors.find(d => d.id == data.doctor_id)?.user?.name}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-slate-400 font-black uppercase tracking-widest text-xs">When</span><span className="font-bold text-slate-800 text-right">{data.appointment_date}<span className="block text-amber-600">{data.appointment_time}</span></span></div>
                                        <div className="flex justify-between items-center border-t border-slate-300 pt-5"><span className="text-slate-500 font-black uppercase tracking-widest text-xs">Fee Total</span><span className="font-black text-emerald-600 text-xl">₹{data.amount} <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded ml-2 align-middle">{data.settlement ? 'CASH' : 'DUE'}</span></span></div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        {/* Sticky Bottom Actions */}
                        <div className="flex-none p-3.5 md:p-4 bg-white border-t border-slate-200 shadow-[0_-10px_20px_rgb(0,0,0,0.03)] flex gap-3">
                            {step === 1 && <button type="button" onClick={handleStepOneNext} className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-500/30 transition-all active:scale-95">Next Step</button>}
                            {step === 2 && <button type="button" disabled={loadingSlots} onClick={handleStepTwoNext} className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-500/30 transition-all active:scale-95">Review Details</button>}
                            {step === 3 && <button type="submit" form="regForm" disabled={processing} className="w-full py-3.5 bg-slate-900 hover:bg-black text-amber-400 rounded-lg font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-slate-900/30 transition-all active:scale-95">{processing ? 'Saving Record...' : 'Confirm Registration'}</button>}
                        </div>
                    </div>
                </div>
            )}

        </ReceptionLayout>
    );
}

function StatCard({ icon, label, value, color }) {
    const colorOpts = {
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        red: 'bg-red-50 text-red-600 border-red-100',
    };
    return (
        <div className="min-w-[165px] md:min-w-0 snap-start bg-white p-3.5 md:p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
            <div className={`w-11 h-11 ${colorOpts[color]} rounded-lg flex flex-none items-center justify-center`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <h4 className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter leading-none mt-1">{value}</h4>
            </div>
        </div>
    );
}

function StepProgress({ step }) {
    return (
        <div className="mt-2 flex items-center gap-1.5">
            {[1, 2, 3].map((item) => (
                <span
                    key={item}
                    className={`h-1.5 rounded-full transition-all ${item <= step ? 'w-6 bg-amber-500' : 'w-4 bg-slate-300'}`}
                />
            ))}
        </div>
    );
}

function MobileAptCard({ apt, collectPayment, updateStatus }) {
    return (
        <div className="group bg-white rounded-lg p-2.5 shadow-sm border border-slate-200 flex flex-col gap-2 relative overflow-hidden transition-all w-full leading-normal">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white shadow-lg shrink-0">
                        <span className="text-[10px] font-bold text-amber-500 leading-none tracking-widest uppercase">Token</span>
                        <span className="text-base font-black leading-none mt-1">{apt.queue_number}</span>
                    </div>
                    <div className="min-w-0 pr-2">
                        <h4 className="text-[15px] font-black text-slate-900 leading-tight uppercase truncate">{apt.patient.name}</h4>
                        <p className="text-[11px] font-bold text-slate-500 font-mono mt-1">{apt.patient.phone}</p>
                    </div>
                </div>
            </div>
            
              <div className="grid grid-cols-2 gap-2">
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Doctor</span>
                      <span className="text-[11px] font-bold text-slate-800 truncate max-w-[7rem] text-right">Dr. {apt.doctor.user.name}</span>
                  </div>
                  <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-2 flex justify-between items-center">
                      <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Slot</span>
                      <span className="text-[11px] font-black text-amber-800">{apt.appointment_time}</span>
                  </div>
            </div>

              <div className="grid grid-cols-4 gap-2 pt-2.5 border-t border-slate-100 mt-1">
                  <div className="col-span-4">
                     <StatusSelect status={apt.status} onChange={(val) => updateStatus(apt.id, val)} fullWidth compact />
                 </div>
                 {apt.payment?.status === 'due' && (
                     <button onClick={() => collectPayment(apt.id)} className="col-span-4 px-3 py-2.5 h-10 bg-slate-900 hover:bg-black text-amber-400 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg shrink-0">
                         Collect ₹{apt.doctor.fee}
                     </button>
                 )}
                 <Link href={route('reception.appointment.edit', apt.id)} className="w-full h-10 bg-white border border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg flex items-center justify-center shadow-sm">
                     <EditIcon className="w-5 h-5 mx-auto" />
                 </Link>
                 <a href={route('appointment.receipt', apt.id)} target="_blank" rel="noopener noreferrer" className="w-full h-10 bg-white border border-slate-200 text-slate-500 hover:text-amber-600 rounded-lg flex items-center justify-center shadow-sm col-span-2">
                     <PrintIcon className="w-5 h-5 mx-auto" />
                 </a>
            </div>
            
            {/* Absolute badge */}
            <div className={`absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl text-[9px] font-black uppercase tracking-widest ${apt.payment?.status === 'paid' ? 'bg-emerald-500 text-emerald-50' : 'bg-red-500 text-red-50'}`}>
                {apt.payment?.status}
            </div>
        </div>
    );
}

function StatusSelect({ status, onChange, fullWidth = false, compact = false }) {
    const activeClass = 
        status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
        status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
        status === 'checked_in' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-red-100 text-red-800 border-red-200';
    
    return (
        <select 
            value={status} onChange={(e) => onChange(e.target.value)}
            className={`text-[10px] font-black uppercase tracking-widest border focus:ring-2 focus:ring-offset-1 rounded-lg px-2.5 cursor-pointer transition-colors ${compact ? 'h-10' : 'h-12'} ${activeClass} ${fullWidth ? 'w-full col-span-4' : ''}`}
        >
            <option value="pending">Pending</option>
            <option value="checked_in">Checked In</option>
            <option value="confirmed">Completed</option>
            <option value="cancelled">Cancelled</option>
        </select>
    );
}

function InputField({ label, error, children }) {
    return (
        <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2.5">{label}</label>
            {children}
            {error && <p className="text-xs font-bold text-red-500 mt-2">{error}</p>}
        </div>
    );
}

function FootfallIcon() { return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>; }
function QueueIcon() { return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function CancelIcon() { return <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function PlusIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M12 4v16m8-8H4" /></svg>; }
function SearchIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>; }
function ExportIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>; }
function EditIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>; }
function PrintIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>; }
function ClipboardIcon({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>; }
