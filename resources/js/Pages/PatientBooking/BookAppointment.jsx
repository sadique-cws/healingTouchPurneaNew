import { Link, Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function BookAppointment({ departments = [], doctors = [], preselected_slug }) {
    const [step, setStep] = useState(1);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [slotsMessage, setSlotsMessage] = useState('');
    const [appointmentId, setAppointmentId] = useState(null);
    const [receiptUrl, setReceiptUrl] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
    const isDoctorLocked = Boolean(selectedDoctor);

    const resetDoctorSelection = () => {
        setData('doctor_slug', '');
        setData('time', '');
        setAvailableSlots([]);
        setSlotsMessage('');
        setSelectedDepartment(null);
    };

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

    const submitBooking = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setSubmitError('');
        setIsSubmitting(true);

        try {
            const slotCheckResponse = await axios.post(route('api.appointment.slots'), {
                doctor_slug: data.doctor_slug,
                date: data.date,
            });

            const latestSlots = slotCheckResponse?.data?.slots || [];
            const currentSlot = latestSlots.find((slot) => slot.slot === data.time);

            if (!currentSlot || !currentSlot.bookable) {
                setAvailableSlots(latestSlots);
                setSlotsMessage('This selected slot has just been booked. Please choose another available time.');
                setData('time', '');
                setStep(1);
                return;
            }

            const res = await axios.post(route('api.appointment.book'), data);
            if (res.data.success) {
                setAppointmentId(res.data.appointment.appointment_no);
                setReceiptUrl(res.data.receipt_url || '');
                setStep(4);
            }
        } catch (error) {
            setSubmitError(error?.response?.data?.message || 'Unable to book appointment right now.');
        } finally {
            setIsSubmitting(false);
        }
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
    const hasSelectableSlots = availableSlots.some((slot) => slot.bookable);

    return (
        <div className="public-page min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden pb-16 lg:pb-0 flex flex-col">
            <Head title="Book Appointment | Healing Touch Hospital" />
            <Header />
            
            <div className="max-w-6xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-8 mt-16">
                <div className="mb-4 md:mb-6 bg-gradient-to-r from-beige-600 to-beige-800 rounded-xl py-3 md:py-4 px-4 md:px-6 text-white border border-beige-700">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <h1 className="text-lg md:text-xl font-bold">Book Your Appointment</h1>
                            <p className="text-beige-100 text-xs opacity-90 mt-0.5">Schedule your visit with our specialists</p>
                        </div>
                        <Link href={route('manage.appointments')} className="hidden md:inline-flex items-center text-white hover:text-beige-200 text-[11px] sm:text-xs mt-1 md:mt-0 ml-auto text-right">
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
                                    <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs transition-all duration-300 ${step >= s.id ? 'bg-white text-beige-700 border-2 border-white' : 'bg-beige-700 text-white border border-beige-300'}`}>
                                        {step > s.id ? (
                                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                        ) : s.id}
                                    </div>
                                    <span className="mt-1 text-[8px] md:text-[10px] font-medium text-white truncate text-center">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:hidden mt-3 flex justify-end">
                        <Link href={route('manage.appointments')} className="inline-flex items-center text-white hover:text-beige-200 text-[11px] ml-auto text-right">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Already have an Appointment? Check existing appointment
                        </Link>
                    </div>
                </div>

                {/* Step 1: Doctor/Date/Time */}
                {step === 1 && (
                    <div className="space-y-4 sm:space-y-6">
                        {!isDoctorLocked && (
                        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <div className="p-2 bg-beige-100 rounded-lg text-beige-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                </div>
                                Select Department
                            </h2>
                            {departments.length > 0 ? (
                                <div className="overflow-x-auto no-scrollbar pb-1">
                                <div className="grid grid-rows-2 grid-flow-col auto-cols-max gap-2 w-max min-w-full">
                                    <button onClick={() => setSelectedDepartment(null)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${selectedDepartment === null ? 'bg-beige-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>All Departments</button>
                                    {departments.map(d => (
                                        <button key={d.id} onClick={() => setSelectedDepartment(d.id)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${selectedDepartment === d.id ? 'bg-beige-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>{d.name}</button>
                                    ))}
                                </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-sm font-medium">
                                    No departments available right now.
                                </div>
                            )}
                        </div>
                        )}

                        <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <h2 className="text-lg font-bold text-gray-800">{selectedDoctor ? 'Selected Doctor' : 'Choose a Doctor'}</h2>
                                <div className="flex items-center gap-3">
                                    <div className="text-xs sm:text-sm text-gray-500">Doctor-wise booking is available for tomorrow only.</div>
                                </div>
                            </div>

                            {selectedDoctor && (
                                <div className="border border-beige-200 rounded-lg overflow-hidden bg-beige-50">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-beige-100 bg-white">
                                        <h3 className="font-semibold text-gray-900">Selected Doctor</h3>
                                        <button
                                            type="button"
                                            onClick={resetDoctorSelection}
                                            className="text-sm text-beige-700 hover:text-beige-800 font-semibold"
                                        >
                                            Change Doctor
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-[220px,1fr]">
                                        <div className="p-4 sm:p-5 flex items-center justify-center lg:border-r border-beige-100">
                                            <div className="text-center w-full">
                                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-white border border-beige-200 mx-auto">
                                                    <img
                                                        src={selectedDoctor.image || '/images/default.jpg'}
                                                        className="w-full h-full object-cover"
                                                        alt={selectedDoctor.user?.name || 'Doctor'}
                                                    />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mt-4">Dr. {selectedDoctor.user?.name}</h3>
                                                <p className="text-sm font-medium text-beige-600">{selectedDoctor.department?.name}</p>
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-5">
                                            <h4 className="text-sm font-medium text-gray-500 mb-3">Doctor Information</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Qualification</p>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {Array.isArray(selectedDoctor.qualification)
                                                            ? selectedDoctor.qualification.join(', ')
                                                            : selectedDoctor.qualification || 'Not specified'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Consultation Fee</p>
                                                    <p className="text-sm font-semibold text-gray-800">₹{selectedDoctor.fee}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Department</p>
                                                    <p className="text-sm font-semibold text-gray-800">{selectedDoctor.department?.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Available Days</p>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {Array.isArray(selectedDoctor.available_days)
                                                            ? selectedDoctor.available_days.join(', ')
                                                            : 'Not specified'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!selectedDoctor && filteredDoctors.length > 0 ? (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredDoctors.map(doc => (
                                        <div key={doc.id} onClick={() => { setData('doctor_slug', doc.slug); setData('time', ''); }} className={`p-3 sm:p-4 rounded-xl border transition-colors cursor-pointer flex items-center gap-3 sm:gap-4 ${data.doctor_slug === doc.slug ? 'ring-2 ring-beige-500 bg-beige-50 border-beige-200' : 'hover:bg-gray-50 border-gray-200'}`}>
                                            <img src={doc.image || '/images/default.jpg'} className="w-16 h-16 rounded-lg object-cover border border-gray-200" alt="" />
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
                            ) : !selectedDoctor ? (
                                <div className="mt-4 p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-sm font-medium">
                                    {selectedDepartment
                                        ? 'No doctors found for this department.'
                                        : 'No doctors available right now.'}
                                </div>
                            ) : null}
                        </div>

                        {data.doctor_slug && (
                            <div className="bg-white p-5 rounded-xl border border-gray-200">
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
                                                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2.5">
                                                            {slots.map((slot) => {
                                                                const meta = getSlotMeta(slot.booked);
                                                                const isActive = data.time === slot.slot;

                                                                return (
                                                                    <button
                                                                        key={slot.slot}
                                                                        type="button"
                                                                        disabled={!slot.bookable}
                                                                        onClick={() => slot.bookable && setData('time', slot.slot)}
                                                                        className={`py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-colors ${isActive ? 'bg-beige-600 text-white border-beige-600' : `${meta.button}`}`}
                                                                    >
                                                                        {slot.slot}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ) : null;
                                            })}

                                            <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
                                                {[
                                                    { label: 'Available', dot: 'bg-green-500' },
                                                    { label: 'Filling', dot: 'bg-yellow-500' },
                                                    { label: 'Last', dot: 'bg-red-500' },
                                                    { label: 'Full', dot: 'bg-gray-400' },
                                                ].map((item) => (
                                                    <div key={item.label} className="inline-flex items-center gap-1.5">
                                                        <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`}></span>
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

                        <div className="hidden sm:flex flex-col sm:flex-row justify-between gap-3 text-sm items-center mt-5">
                            <Link href={route('manage.appointments')} className="inline-flex items-center text-beige-600 hover:underline text-md mt-1 md:mt-0">
                                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Check your appointment.
                            </Link>

                            <button disabled={!data.doctor_slug || !data.time} onClick={() => setStep(2)} className="w-full sm:w-auto px-6 py-3 bg-beige-600 text-white rounded-xl border border-beige-600 hover:bg-beige-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beige-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold">
                                <span>Continue</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div className="sm:hidden h-20" />
                        <div className="sm:hidden fixed bottom-[5.5rem] inset-x-0 z-40 px-3">
                            <button
                                disabled={!data.doctor_slug || !data.time}
                                onClick={() => setStep(2)}
                                className="w-full px-6 py-3 bg-beige-600 text-white rounded-xl border border-beige-600 hover:bg-beige-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beige-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold"
                            >
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
                    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-200">
                        <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-gray-100 pb-4 sm:pb-5">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Patient Information</h2>
                                <p className="text-gray-500 text-xs sm:text-sm mt-1">Please fill your details for appointment confirmation.</p>
                            </div>
                            <button onClick={() => setStep(1)} className="text-beige-700 font-semibold text-xs sm:text-sm bg-beige-50 px-3 sm:px-4 py-2 rounded-lg hover:bg-beige-100 transition-colors">← Back</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Full Name</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3 px-4 bg-gray-50/70" placeholder="Enter patient name" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Mobile Number</label>
                                <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value.slice(0,10))} className="w-full rounded-xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3 px-4 bg-gray-50/70" placeholder="+91 XXXXX XXXXX" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Age</label>
                                    <input type="number" value={data.age} onChange={e => setData('age', e.target.value)} className="w-full rounded-xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3 px-4 bg-gray-50/70" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-2">Gender</label>
                                    <select value={data.gender} onChange={e => setData('gender', e.target.value)} className="w-full rounded-xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3 px-4 bg-gray-50/70">
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Appointment Date</label>
                                <div className="py-3 px-4 bg-beige-50 rounded-xl text-beige-700 font-semibold border border-beige-100 flex justify-between items-center group">
                                    {formatDisplayDate(data.date)}
                                    <button onClick={() => setStep(1)} className="text-[10px] bg-white px-2 py-1 rounded-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">CHANGE</button>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Complete Address</label>
                                <input type="text" value={data.address} onChange={e => setData('address', e.target.value)} className="w-full rounded-xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3 px-4 bg-gray-50/70" placeholder="Village / Road / House No." />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Pincode</label>
                                <input type="text" value={data.pincode} onChange={handlePincode} className="w-full rounded-xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3 px-4 bg-gray-50/70 font-mono tracking-widest" placeholder="6820XX" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">City / Location</label>
                                <input type="text" value={data.city} onChange={e => setData('city', e.target.value)} className="w-full rounded-xl border-gray-200 focus:border-beige-500 focus:ring-beige-500 py-3 px-4 bg-gray-50/70" />
                            </div>
                        </div>
                        <div className="hidden sm:flex flex-col sm:flex-row justify-between mt-8 sm:mt-10 bg-gray-50 p-3 sm:p-4 rounded-2xl gap-3">
                            <button onClick={() => setStep(1)} className="w-full sm:w-auto px-6 py-3 font-semibold text-gray-600 hover:text-gray-800 bg-white rounded-xl border border-gray-200 transition-colors">Back to Step 1</button>
                            <button disabled={!data.name || !data.phone || !data.address} onClick={() => setStep(3)} className="w-full sm:w-auto bg-beige-600 hover:bg-beige-700 text-white px-8 sm:px-10 py-3 rounded-xl border border-beige-600 font-semibold transition-colors disabled:opacity-50">Review Appointment</button>
                        </div>

                        <div className="sm:hidden h-20" />
                        <div className="sm:hidden fixed bottom-[5.5rem] inset-x-0 z-40 px-3">
                            <button
                                disabled={!data.name || !data.phone || !data.address}
                                onClick={() => setStep(3)}
                                className="w-full bg-beige-600 hover:bg-beige-700 text-white py-3 rounded-xl border border-beige-600 font-semibold transition-colors disabled:opacity-50"
                            >
                                Review Appointment
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review - MATCHED TO SCREENSHOT */}
                {step === 3 && (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="p-4 sm:p-6 md:p-8 border-b border-beige-50 bg-beige-50/30">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="p-2.5 sm:p-3 bg-white rounded-xl text-beige-600 border border-beige-100 shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Review Your Appointment Details</h2>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Please verify all details before confirming your appointment.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 md:p-8">
                            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                                {/* Left Side: Appointment Info */}
                                <div className="space-y-5 sm:space-y-6">
                                    <h3 className="text-sm sm:text-md font-semibold text-gray-800 border-b pb-3">Appointment Information</h3>
                                    
                                    <div className="flex items-start gap-4">
                                        <img src={selectedDoctor?.image || '/images/default.jpg'} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-gray-200" alt="" />
                                        <div>
                                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Doctor</p>
                                            <p className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Dr. {selectedDoctor?.user?.name}</p>
                                            <p className="text-xs sm:text-sm font-medium text-beige-600 uppercase tracking-wide">{selectedDoctor?.department?.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-beige-50 rounded-xl text-beige-600 border border-beige-100 shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Date</p>
                                            <p className="text-sm sm:text-base font-semibold text-gray-900">{formatDisplayDate(data.date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-beige-50 rounded-xl text-beige-600 border border-beige-100 shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Time</p>
                                            <p className="text-sm sm:text-base font-semibold text-gray-900">{data.time}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Financial Info */}
                                <div className="bg-gray-50/80 p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 flex flex-col h-full">
                                    <div className="flex-grow space-y-5">
                                        <div className="flex justify-between items-center text-gray-600 font-medium pb-4 border-b border-gray-200 text-sm sm:text-base gap-4">
                                            <span>Consultation Fee</span>
                                            <span className="font-semibold text-gray-800">₹{selectedDoctor?.fee}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-600 font-medium text-sm sm:text-base gap-4">
                                            <span>Payment Method</span>
                                            <span className="font-semibold text-gray-800 uppercase tracking-wide text-right">Pay_at_hospital</span>
                                        </div>
                                        <div className="pt-6 flex justify-between items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-lg sm:text-xl font-bold text-gray-900">Total</span>
                                                <span className="text-[10px] text-gray-400 italic">To be paid at the hospital</span>
                                            </div>
                                            <span className="text-xl sm:text-2xl font-bold text-beige-700">₹{selectedDoctor?.fee}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Patient Info Section */}
                            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-100">
                                <h3 className="text-sm sm:text-md font-semibold text-gray-800 mb-5">Patient Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Name</p>
                                        <p className="font-semibold text-gray-900 break-words">{data.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Phone</p>
                                        <p className="font-semibold text-gray-900 break-words">{data.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Age / Gender</p>
                                        <p className="font-semibold text-gray-900 capitalize">{data.age} Y / {data.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Location</p>
                                        <p className="font-semibold text-gray-900 break-words">{data.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:flex p-4 sm:p-6 md:p-8 bg-gray-50/50 flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                            <button onClick={() => setStep(2)} className="w-full sm:w-auto px-5 sm:px-8 py-3 font-semibold text-gray-600 bg-white rounded-xl border border-gray-200 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Edit Details
                            </button>
                            <button disabled={isSubmitting} onClick={submitBooking} className="w-full sm:w-auto bg-beige-600 hover:bg-beige-700 disabled:opacity-60 text-white px-6 sm:px-10 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                                {isSubmitting ? 'Checking slot...' : 'Confirm Appointment'}
                                {!isSubmitting && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                            </button>
                        </div>

                        <div className="sm:hidden px-4 pb-3 text-left">
                            <button onClick={() => setStep(2)} className="text-sm font-semibold text-gray-600">← Edit Details</button>
                        </div>
                        <div className="sm:hidden h-20" />
                        <div className="sm:hidden fixed bottom-[5.5rem] inset-x-0 z-40 px-3">
                            <button
                                disabled={isSubmitting}
                                onClick={submitBooking}
                                className="w-full bg-beige-600 hover:bg-beige-700 disabled:opacity-60 text-white py-3 rounded-xl border border-beige-600 font-semibold"
                            >
                                {isSubmitting ? 'Checking slot...' : 'Confirm Appointment'}
                            </button>
                        </div>
                        {submitError && (
                            <div className="px-4 sm:px-8 pb-4 sm:pb-6 text-sm font-medium text-red-600">{submitError}</div>
                        )}
                    </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 text-center max-w-xl mx-auto overflow-hidden relative">
                        {/* Decorative Background Ring */}
                        <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-beige-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0 opacity-50"></div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-beige-100 text-beige-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-beige-200">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 leading-tight">Registration Complete!</h2>
                            <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-7 font-medium">Your appointment has been successfully scheduled.</p>
                            
                            <div className="bg-gray-50 border border-dashed border-beige-200 p-4 sm:p-5 rounded-xl max-w-sm mx-auto mb-5 sm:mb-7">
                                <p className="text-[10px] text-beige-600 uppercase font-semibold tracking-[0.18em] mb-2">Your Appointment Number</p>
                                <p className="text-2xl sm:text-4xl font-mono font-bold text-gray-900 whitespace-nowrap">{appointmentId}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a href={receiptUrl || '#'} className="bg-beige-600 hover:bg-beige-700 text-white px-5 sm:px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2" target="_blank" rel="noreferrer">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Download Receipt
                                </a>
                                <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 sm:px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                    Back to Home
                                </Link>
                            </div>
                            
                            <div className="mt-8 sm:mt-12 inline-flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-beige-700 bg-beige-50 py-2.5 px-4 sm:px-6 rounded-full mx-auto border border-beige-100">
                                <span className="relative flex h-2 w-2 shrink-0">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-beige-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-beige-500"></span>
                                </span>
                                <span className="text-center">Confirmation SMS sent to +91 {data.phone.slice(0, 5)} {data.phone.slice(5)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <PublicFooter />
        </div>
    );
}

