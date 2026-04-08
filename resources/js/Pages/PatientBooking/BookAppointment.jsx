import { Link, Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/Components/Header';

export default function BookAppointment({ departments, doctors, preselected_slug }) {
    const [step, setStep] = useState(1);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [appointmentId, setAppointmentId] = useState(null);

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
            axios.post(route('api.appointment.slots'), {
                doctor_slug: data.doctor_slug,
                date: data.date
            }).then(res => {
                setAvailableSlots(res.data.slots || []);
                setLoadingSlots(false);
            }).catch(() => setLoadingSlots(false));
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
        axios.post(route('api.appointment.book'), data).then(res => {
            if (res.data.success) {
                setAppointmentId(res.data.appointment.appointment_no);
                setStep(4);
            }
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

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-900 antialiased overflow-x-hidden">
            <Head title="Book Appointment | Healing Touch Hospital" />
            <Header />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24 pt-16">
                {/* Progress Header - Teal Banner */}
                <div className="mb-8 bg-[#0d9488] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Book Your Appointment</h1>
                            <p className="text-teal-100/80 text-sm mt-1">Schedule your visit with our specialists</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-teal-50 group cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="hover:underline">Already have an Appointment? Check existing appointment</span>
                        </div>
                    </div>

                    {/* Progress Steps - Styled to match screenshot */}
                    <div className="mt-12 flex items-center justify-between relative px-2 max-w-4xl mx-auto">
                        <div className="absolute top-[1.1rem] left-0 right-0 h-0.5 bg-teal-400/50 z-0 mx-8"></div>
                        <div className="absolute top-[1.1rem] left-0 h-0.5 bg-white z-0 mx-8 transition-all duration-500" style={{ width: `${(step - 1) * 50}%` }}></div>
                        
                        {[
                            { id: 1, label: 'Doctor' },
                            { id: 2, label: 'Details' },
                            { id: 3, label: 'Review' }
                        ].map((s, idx) => (
                            <div key={s.id} className="relative z-10 flex flex-col items-center">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s.id ? 'bg-white text-teal-700 shadow-lg scale-110' : 'bg-teal-700 text-teal-100 border border-teal-500/50'}`}>
                                    {step > s.id ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    ) : s.id}
                                </div>
                                <span className="mt-3 text-[11px] font-bold tracking-wider uppercase text-teal-50">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 1: Doctor/Date/Time */}
                {step === 1 && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                </div>
                                Select Department
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => setSelectedDepartment(null)} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedDepartment === null ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>All</button>
                                {departments.map(d => (
                                    <button key={d.id} onClick={() => setSelectedDepartment(d.id)} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedDepartment === d.id ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>{d.name}</button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-800">Choose Your Doctor</h2>
                                <div className="flex items-center gap-4">
                                    <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="rounded-lg border-gray-200 text-sm focus:ring-teal-500 focus:border-teal-500" min={new Date().toISOString().split('T')[0]} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredDoctors.map(doc => (
                                    <div key={doc.id} onClick={() => setData('doctor_slug', doc.slug)} className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${data.doctor_slug === doc.slug ? 'border-teal-500 bg-teal-50/50 shadow-sm' : 'border-gray-100 hover:border-teal-200 shadow-sm transition-shadow'}`}>
                                        <img src={doc.image || '/images/default.jpg'} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" alt="" />
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-900 truncate">Dr. {doc.user?.name}</h3>
                                            <p className="text-xs text-teal-600 font-bold uppercase tracking-wide">{doc.department?.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black text-gray-400">FEES:</span>
                                                <span className="text-sm font-black text-teal-700">₹{doc.fee}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {data.doctor_slug && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-slideUp">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Available Time Slots
                                </h2>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
                                    {loadingSlots ? (
                                        <div className="col-span-full py-8 text-center"><div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto"></div></div>
                                    ) : availableSlots.length ? availableSlots.map(slot => (
                                        <button key={slot} onClick={() => setData('time', slot)} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${data.time === slot ? 'bg-teal-600 text-white border-teal-600 shadow-lg' : 'bg-white border-gray-100 hover:border-teal-500 hover:text-teal-600'}`}>
                                            {slot}
                                        </button>
                                    )) : (
                                        <div className="col-span-full py-6 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100 font-semibold tracking-wide">Doctor is not available on this date.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <button disabled={!data.doctor_slug || !data.time} onClick={() => setStep(2)} className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-3.5 rounded-2xl font-black shadow-xl disabled:opacity-50 transition-all flex items-center gap-3">
                                PROCEED TO DETAILS
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
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
                            <button onClick={() => setStep(1)} className="text-teal-600 font-bold text-sm bg-teal-50 px-4 py-2 rounded-lg hover:bg-teal-100 transition-colors uppercase">← Back</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-2xl border-gray-200 focus:border-teal-500 focus:ring-teal-500 py-3.5 px-5 bg-gray-50/50" placeholder="Enter patient name" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                                <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value.slice(0,10))} className="w-full rounded-2xl border-gray-200 focus:border-teal-500 focus:ring-teal-500 py-3.5 px-5 bg-gray-50/50" placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Age</label>
                                    <input type="number" value={data.age} onChange={e => setData('age', e.target.value)} className="w-full rounded-2xl border-gray-200 focus:border-teal-500 focus:ring-teal-500 py-3.5 px-5 bg-gray-50/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Gender</label>
                                    <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full rounded-2xl border-gray-200 focus:border-teal-500 focus:ring-teal-500 py-3.5 px-5 bg-gray-50/50">
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Appointment Date</label>
                                <div className="py-3.5 px-5 bg-teal-50 rounded-2xl text-teal-700 font-bold border border-teal-100 flex justify-between items-center group">
                                    {formatDisplayDate(data.date)}
                                    <button onClick={() => setStep(1)} className="text-[10px] bg-white px-2 py-1 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">CHANGE</button>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Complete Address</label>
                                <input type="text" value={data.address} onChange={e => setData('address', e.target.value)} className="w-full rounded-2xl border-gray-200 focus:border-teal-500 focus:ring-teal-500 py-3.5 px-5 bg-gray-50/50" placeholder="Village / Road / House No." />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Pincode</label>
                                <input type="text" value={data.pincode} onChange={handlePincode} className="w-full rounded-2xl border-gray-200 focus:border-teal-500 focus:ring-teal-500 py-3.5 px-5 bg-gray-50/50 font-mono tracking-widest" placeholder="6820XX" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">City / Location</label>
                                <input type="text" value={data.city} onChange={e => setData('city', e.target.value)} className="w-full rounded-2xl border-gray-200 focus:border-teal-500 focus:ring-teal-500 py-3.5 px-5 bg-gray-50/50" />
                            </div>
                        </div>
                        <div className="flex justify-between mt-12 bg-gray-50 p-4 rounded-3xl">
                            <button onClick={() => setStep(1)} className="px-8 py-3.5 font-bold text-gray-500 hover:text-gray-800 transition-colors">BACK TO STEP 1</button>
                            <button disabled={!data.name || !data.phone || !data.address} onClick={() => setStep(3)} className="bg-teal-600 hover:bg-teal-700 text-white px-12 py-3.5 rounded-2xl font-black shadow-xl transition-all scale-105">REVIEW APPOINTMENT</button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review - MATCHED TO SCREENSHOT */}
                {step === 3 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 animate-fadeIn overflow-hidden">
                        <div className="p-8 border-b border-teal-50 bg-teal-50/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-teal-600">
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
                                            <p className="text-sm font-medium text-teal-600 uppercase tracking-wide">{selectedDoctor?.department?.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                            <p className="text-md font-bold text-gray-900">{formatDisplayDate(data.date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-5">
                                        <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
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
                                            <span className="text-2xl font-black text-teal-700">₹{selectedDoctor?.fee}</span>
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
                            <button onClick={submitBooking} className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-16 py-4 rounded-2xl font-black shadow-xl transition-all scale-110 active:scale-105 flex items-center gap-3">
                                CONFIRM APPOINTMENT
                                <svg className="w-5 h-5 bg-white/20 rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                    <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 text-center animate-bounceIn max-w-2xl mx-auto overflow-hidden relative">
                        {/* Decorative Background Ring */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0 opacity-50"></div>
                        
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner border-4 border-white">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Registration Complete!</h2>
                            <p className="text-gray-500 mb-10 font-medium">Your appointment has been successfully scheduled.</p>
                            
                            <div className="bg-[#f8fafc] border-2 border-dashed border-teal-200 p-8 rounded-3xl max-w-sm mx-auto mb-10 group transition-all hover:bg-teal-50 hover:border-teal-300">
                                <p className="text-[10px] text-teal-600 uppercase font-black tracking-[0.2em] mb-3">Your Appointment Number</p>
                                <p className="text-5xl font-mono font-black text-gray-900 group-hover:scale-110 transition-transform">{appointmentId}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    DOWNLOAD RECEIPT
                                </button>
                                <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                    BACK TO HOME
                                </Link>
                            </div>
                            
                            <div className="mt-12 flex items-center justify-center gap-3 text-sm font-bold text-teal-600 bg-teal-50 py-3 px-6 rounded-full w-fit mx-auto border border-teal-100 animate-pulse">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
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

