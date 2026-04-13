import { Link, Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/Components/Header';

export default function BookAppointment({ departments, doctors, preselected_slug }) {
    const [step, setStep] = useState(1);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsMessage, setSlotsMessage] = useState('');
    const [appointmentId, setAppointmentId] = useState(null);
    const [receiptUrl, setReceiptUrl] = useState('');
    const [submitError, setSubmitError] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        doctor_slug: preselected_slug || '',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        time: '',
        name: '',
        email: '',
        phone: '',
        gender: '',
        age: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        notes: ''
    });

    const filteredDoctors = selectedDepartment 
        ? doctors.filter(d => d.department_id === selectedDepartment)
        : doctors;

    const selectedDoctor = doctors.find(d => d.slug === data.doctor_slug);

    useEffect(() => {
        if (data.doctor_slug && data.date) {
            setLoadingSlots(true);
            setSlotsMessage('');
            axios.post(route('api.appointment.slots'), {
                doctor_slug: data.doctor_slug,
                date: data.date
            }).then(res => {
                setAvailableSlots(res.data.slots || []);
                setSlotsMessage(res.data.message || '');
                setLoadingSlots(false);
            }).catch((error) => {
                setAvailableSlots([]);
                setSlotsMessage(error?.response?.data?.error || error?.response?.data?.message || 'No appointment slots available for this date.');
                setLoadingSlots(false);
            });
        }
    }, [data.doctor_slug, data.date]);

    const handlePincode = (e) => {
        const pin = e.target.value;
        setData('pincode', pin);
        if (pin.length === 6) {
            axios.get(`https://api.postalpincode.in/pincode/${pin}`).then(res => {
                if (res.data[0].Status === 'Success') {
                    const po = res.data[0].PostOffice[0];
                    setData(d => ({ ...d, city: po.Block || po.Name, state: po.State, pincode: pin }));
                }
            });
        }
    };

    const submitBooking = (e) => {
        e.preventDefault();
        setSubmitError('');
        axios.post(route('api.appointment.book'), data).then(res => {
            if (res.data.success) {
                setAppointmentId(res.data.appointment.appointment_no);
                setReceiptUrl(res.data.receipt_url || '');
                setStep(4);
            }
        }).catch((error) => {
            setSubmitError(error?.response?.data?.message || 'Unable to book appointment right now.');
        });
    };

    const formatDisplayDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatShortDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short'
        });
    };

    const getSlotMeta = (booked) => {
        const remaining = Math.max(0, 4 - booked);

        if (remaining >= 3) {
            return {
                label: 'Available (3-4 slots)',
                chip: 'bg-green-100 text-green-700 border-green-200',
                button: 'bg-green-100 border-green-200 text-green-700 hover:bg-green-200',
            };
        }

        if (remaining === 2) {
            return {
                label: 'Filling Up (2 slots)',
                chip: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                button: 'bg-yellow-100 border-yellow-200 text-yellow-700 hover:bg-yellow-200',
            };
        }

        if (remaining === 1) {
            return {
                label: 'Almost Full (1 slot)',
                chip: 'bg-red-100 text-red-700 border-red-200',
                button: 'bg-red-100 border-red-200 text-red-700 hover:bg-red-200',
            };
        }

        return {
            label: 'Full (0 slots)',
            chip: 'bg-gray-100 text-gray-500 border-gray-200',
            button: 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed',
        };
    };

    const groupSlots = (slots) => {
        const groups = {
            morning: [],
            afternoon: [],
            evening: [],
        };

        (slots || []).forEach((slot) => {
            const hourPart = slot.slot.split(':')[0];
            const hour = Number(hourPart);

            if (hour < 12) {
                groups.morning.push(slot);
            } else if (hour < 16) {
                groups.afternoon.push(slot);
            } else {
                groups.evening.push(slot);
            }
        });

        return groups;
    };

    const slotGroups = groupSlots(availableSlots);
    const hasSelectableSlots = availableSlots.some((slot) => slot.bookable);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden">
            <Head title="Book Appointment | Healing Touch Hospital" />
            <Header />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
                <div className="mb-4 md:mb-6 bg-gradient-to-r from-beige-600 to-beige-800 rounded-xl py-3 md:py-4 px-4 md:px-6 text-white shadow-md">
                    <div className="flex flex-wrap items-center justify-between">
                        <div>
                            <h1 className="text-lg md:text-xl font-bold">Book Your Appointment</h1>
                            <p className="text-beige-100 text-xs opacity-90 mt-0.5">Schedule your visit with our specialists</p>
                        </div>
                        <Link href={route('manage.appointments')} className="inline-flex items-center text-white hover:text-beige-200 text-xs mt-1 md:mt-0">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Already have an Appointment? Check existing appointment
                        </Link>
                    </div>

                    <div className="mt-3 relative">
                        <div className="absolute top-3 left-0 right-0 h-0.5 bg-beige-300 rounded-full z-0 mx-6 md:mx-12"></div>
                        <div className="absolute top-3 left-0 h-0.5 bg-white rounded-full z-10 transition-all duration-500 mx-6 md:mx-12" style={{ width: `${Math.min(90, (step - 1) * 30)}%` }}></div>
                        <div className="relative z-20 flex items-center justify-between gap-2 md:gap-6">
                            {[
                                { id: 1, label: 'Doctor' },
                                { id: 2, label: 'Details' },
                                { id: 3, label: 'Review' }
                            ].map((s) => (
                                <div key={s.id} className="flex flex-1 flex-col items-center min-w-0">
                                    <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs transition-all duration-300 shadow-sm ${step >= s.id ? 'bg-white text-beige-700 border-2 border-white' : 'bg-beige-700 text-white border border-beige-300'}`}>
                                        {step > s.id ? (
                                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                        ) : s.id}
                                    </div>
                                    <span className="mt-1 text-[8px] md:text-[10px] font-medium text-white truncate text-center">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step 1: Doctor/Date/Time */}
                {step === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-white p-5 rounded-xl shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <div className="p-2 bg-beige-100 rounded-lg text-beige-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                </div>
                                Select Department
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => setSelectedDepartment(null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${selectedDepartment === null ? 'bg-beige-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>All Departments</button>
                                {departments.map(d => (
                                    <button key={d.id} onClick={() => setSelectedDepartment(d.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${selectedDepartment === d.id ? 'bg-beige-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>{d.name}</button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                                <h2 className="text-lg font-bold text-gray-800">Choose a Doctor</h2>
                                <div className="text-sm text-gray-500">Doctor-wise booking is available for tomorrow only.</div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredDoctors.map(doc => (
                                    <div key={doc.id} onClick={() => setData('doctor_slug', doc.slug)} className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${data.doctor_slug === doc.slug ? 'ring-2 ring-beige-500 bg-beige-50' : 'hover:shadow-md hover:border-beige-200'}`}>
                                        <img src={doc.image || '/images/default.jpg'} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" alt="" />
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-900 truncate">Dr. {doc.user?.name}</h3>
                                            <p className="text-xs text-beige-600 font-bold uppercase tracking-wide">{doc.department?.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black text-gray-400">FEES:</span>
                                                <span className="text-sm font-black text-beige-700">₹{doc.fee}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {data.doctor_slug && (
                            <div className="bg-white p-5 rounded-xl shadow-sm animate-slideUp">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-beige-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        Select Date
                                    </h2>
                                </div>

                                {slotsMessage && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                                        {slotsMessage}
                                    </div>
                                )}

                                <div className="mb-6">
                                    <div className="flex border-b border-gray-200">
                                        <button type="button" className="py-3 px-6 border-b-2 font-medium text-sm focus:outline-none border-beige-600 text-beige-600">
                                            Tomorrow
                                            <span className="text-xs block text-gray-500">{formatShortDate(data.date)}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 sm:p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-5 h-5 text-beige-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <h3 className="text-lg font-semibold text-gray-800">Select Appointment Time</h3>
                                    </div>

                                    {loadingSlots ? (
                                        <div className="py-8 text-center">
                                            <div className="animate-spin h-8 w-8 border-4 border-beige-500 border-t-transparent rounded-full mx-auto"></div>
                                        </div>
                                    ) : availableSlots.length > 0 ? (
                                        <div className="space-y-5">
                                            {[
                                                { key: 'morning', label: 'Morning (Before 12 PM)' },
                                                { key: 'afternoon', label: 'Afternoon (12 PM - 4 PM)' },
                                                { key: 'evening', label: 'Evening (After 4 PM)' },
                                            ].map((group) => {
                                                const slots = slotGroups[group.key] || [];

                                                return slots.length ? (
                                                    <div key={group.key}>
                                                        <div className="flex items-center gap-2 text-gray-600 font-semibold mb-3">
                                                            <span className="text-lg">{group.key === 'morning' ? '☀' : group.key === 'afternoon' ? '☼' : '☾'}</span>
                                                            <span>{group.label}</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                                                            {slots.map((slot) => {
                                                                const meta = getSlotMeta(slot.booked);
                                                                const isActive = data.time === slot.slot;

                                                                return (
                                                                    <button
                                                                        key={slot.slot}
                                                                        type="button"
                                                                        disabled={!slot.bookable}
                                                                        onClick={() => slot.bookable && setData('time', slot.slot)}
                                                                        className={`py-3 rounded-lg text-sm font-semibold border transition-all ${isActive ? 'bg-beige-600 text-white border-beige-600 shadow-md' : `${meta.button}`}`}
                                                                    >
                                                                        {slot.slot}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ) : null;
                                            })}

                                            <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3 text-xs sm:text-sm">
                                                {[
                                                    { label: 'Available (3-4 slots)', chip: 'bg-green-100 text-green-700 border-green-200' },
                                                    { label: 'Filling Up (2 slots)', chip: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                                                    { label: 'Almost Full (1 slot)', chip: 'bg-red-100 text-red-700 border-red-200' },
                                                    { label: 'Full (0 slots)', chip: 'bg-gray-100 text-gray-500 border-gray-200' },
                                                ].map((item) => (
                                                    <div key={item.label} className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border ${item.chip}`}>
                                                        <span className={`w-3 h-3 rounded-full border ${item.chip.split(' ')[0]}`}></span>
                                                        <span>{item.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-10 text-center rounded-2xl border border-dashed border-red-200 bg-red-50">
                                            <div className="text-red-500 font-semibold mb-1">No appointment time available for this doctor on tomorrow.</div>
                                            <div className="text-sm text-red-400">Choose another doctor or try again later.</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm text-balance items-center mt-6">
                            <Link href={route('manage.appointments')} className="inline-flex items-center text-beige-600 hover:underline text-md mt-1 md:mt-0">
                                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Check your appointment.
                            </Link>

                            <button disabled={!data.doctor_slug || !data.time} onClick={() => setStep(2)} className="px-6 py-2.5 bg-beige-600 text-white rounded-md shadow-sm hover:bg-beige-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beige-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                                <span>Continue</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Patient Info */}
                {step === 2 && (
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fadeIn">
                        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5">
                            <div>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase">Patient Information</h2>
                                <p className="text-gray-400 text-sm mt-1">Please provide accurate details for registration.</p>
                            </div>
                            <button onClick={() => setStep(1)} className="text-beige-600 font-bold text-sm bg-beige-50 px-4 py-2 rounded-lg hover:bg-beige-100 transition-colors uppercase">← Back</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-2xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3.5 px-5 bg-gray-50/50" placeholder="Enter patient name" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                                <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value.slice(0,10))} className="w-full rounded-2xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3.5 px-5 bg-gray-50/50" placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Age</label>
                                    <input type="number" value={data.age} onChange={e => setData('age', e.target.value)} className="w-full rounded-2xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3.5 px-5 bg-gray-50/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Gender</label>
                                    <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full rounded-2xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3.5 px-5 bg-gray-50/50">
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Appointment Date</label>
                                <div className="py-3.5 px-5 bg-beige-50 rounded-2xl text-beige-700 font-bold border border-beige-100 flex justify-between items-center group">
                                    {formatDisplayDate(data.date)}
                                    <button onClick={() => setStep(1)} className="text-[10px] bg-white px-2 py-1 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">CHANGE</button>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Complete Address</label>
                                <input type="text" value={data.address} onChange={e => setData('address', e.target.value)} className="w-full rounded-2xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3.5 px-5 bg-gray-50/50" placeholder="Village / Road / House No." />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Pincode</label>
                                <input type="text" value={data.pincode} onChange={handlePincode} className="w-full rounded-2xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3.5 px-5 bg-gray-50/50 font-mono tracking-widest" placeholder="6820XX" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">City / Location</label>
                                <input type="text" value={data.city} onChange={e => setData('city', e.target.value)} className="w-full rounded-2xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3.5 px-5 bg-gray-50/50" />
                            </div>
                        </div>
                        <div className="flex justify-between mt-12 bg-gray-50 p-4 rounded-3xl">
                            <button onClick={() => setStep(1)} className="px-8 py-3.5 font-bold text-gray-500 hover:text-gray-800 transition-colors">BACK TO STEP 1</button>
                            <button disabled={!data.name || !data.phone || !data.address} onClick={() => setStep(3)} className="bg-beige-600 hover:bg-beige-700 text-white px-12 py-3.5 rounded-2xl font-black shadow-xl transition-all scale-105">REVIEW APPOINTMENT</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review - MATCHED TO SCREENSHOT */}
                {step === 3 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 animate-fadeIn overflow-hidden">
                        <div className="p-8 border-b border-beige-50 bg-beige-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-beige-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Review Your Appointment Details</h2>
                                    <p className="text-sm text-gray-500 mt-1">Please verify all details before confirming your appointment.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid lg:grid-cols-2 gap-12">
                                {/* Left Side: Appointment Info */}
                                <div className="space-y-8">
                                    <h3 className="text-md font-bold text-gray-800 border-b pb-4">Appointment Information</h3>
                                    
                                    <div className="flex items-start gap-5">
                                        <img src={selectedDoctor?.image || '/images/default.jpg'} className="w-16 h-16 rounded-xl object-cover shadow-md border-2 border-white" alt="" />
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Doctor</p>
                                            <p className="text-lg font-bold text-gray-900">Dr. {selectedDoctor?.user?.name}</p>
                                            <p className="text-sm font-medium text-beige-600 uppercase tracking-wide">{selectedDoctor?.department?.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="p-3 bg-beige-50 rounded-xl text-beige-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                            <p className="text-md font-bold text-gray-900">{formatDisplayDate(data.date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="p-3 bg-beige-50 rounded-xl text-beige-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</p>
                                            <p className="text-md font-bold text-gray-900">{data.time}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Financial Info */}
                                <div className="bg-gray-50/80 p-8 rounded-3xl border border-gray-100 flex flex-col h-full">
                                    <div className="flex-grow space-y-6">
                                        <div className="flex justify-between items-center text-gray-500 font-medium pb-4 border-b border-gray-200">
                                            <span>Consultation Fee</span>
                                            <span className="font-bold text-gray-800">₹{selectedDoctor?.fee}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-500 font-medium">
                                            <span>Payment Method</span>
                                            <span className="font-bold text-gray-800 uppercase tracking-wide">Pay_at_hospital</span>
                                        </div>
                                        <div className="pt-8 flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-xl font-black text-gray-900">Total</span>
                                                <span className="text-[10px] text-gray-400 italic">To be paid at the hospital</span>
                                            </div>
                                            <span className="text-2xl font-black text-beige-700">₹{selectedDoctor?.fee}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Patient Info Section */}
                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <h3 className="text-md font-bold text-gray-800 mb-6">Patient Information</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Name</p>
                                        <p className="font-bold text-gray-900">{data.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                                        <p className="font-bold text-gray-900">{data.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Age / Gender</p>
                                        <p className="font-bold text-gray-900 capitalize">{data.age} Y / {data.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                                        <p className="font-bold text-gray-900">{data.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <button onClick={() => setStep(2)} className="w-full sm:w-auto px-8 py-3.5 font-bold text-gray-500 hover:text-gray-800 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                EDIT DETAILS
                            </button>
                            <button onClick={submitBooking} className="w-full sm:w-auto bg-beige-600 hover:bg-beige-700 text-white px-16 py-4 rounded-2xl font-black shadow-xl transition-all scale-110 active:scale-105 flex items-center gap-3">
                                CONFIRM APPOINTMENT
                                <svg className="w-5 h-5 bg-white/20 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </button>
                        </div>
                        {submitError && (
                            <div className="px-8 pb-6 text-sm font-semibold text-red-600">{submitError}</div>
                        )}
                    </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                    <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 text-center animate-bounceIn max-w-2xl mx-auto overflow-hidden relative">
                        {/* Decorative Background Ring */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-beige-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0 opacity-50"></div>
                        
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-beige-100 text-beige-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner border-4 border-white">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Registration Complete!</h2>
                            <p className="text-gray-500 mb-10 font-medium">Your appointment has been successfully scheduled.</p>
                            
                            <div className="bg-gray-50 border-2 border-dashed border-beige-200 p-8 rounded-3xl max-w-sm mx-auto mb-10 group transition-all hover:bg-beige-50 hover:border-beige-300">
                                <p className="text-[10px] text-beige-600 uppercase font-black tracking-[0.2em] mb-3">Your Appointment Number</p>
                                <p className="text-5xl font-mono font-black text-gray-900 group-hover:scale-110 transition-transform">{appointmentId}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href={receiptUrl || '#'} className="bg-beige-600 hover:bg-beige-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2" target="_blank" rel="noreferrer">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    DOWNLOAD RECEIPT
                                </a>
                                <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                    BACK TO HOME
                                </Link>
                            </div>
                            
                            <div className="mt-12 flex items-center justify-center gap-3 text-sm font-bold text-beige-600 bg-beige-50 py-3 px-6 rounded-full w-fit mx-auto border border-beige-100 animate-pulse">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-beige-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-beige-500"></span>
                                </span>
                                Confirmation SMS sent to +91 {data.phone.slice(0, 5)} {data.phone.slice(5)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

