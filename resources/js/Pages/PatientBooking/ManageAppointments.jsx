import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function ManageAppointments({ filters, appointments = [] }) {
    const [searchMethod, setSearchMethod] = useState(filters?.method || 'phone');
    const [phone, setPhone] = useState(filters?.phone || '');
    const [email, setEmail] = useState(filters?.email || '');
    const [selectedId, setSelectedId] = useState(null);

    const { errors } = usePage().props;

    const otpForm = useForm({ otp: '' });

    const hasResults = useMemo(() => appointments.length > 0, [appointments]);

    const submitSearch = (event) => {
        event.preventDefault();
        router.get(route('manage.appointments'), {
            method: searchMethod,
            phone,
            email,
        }, { preserveState: true });
    };

    const sendOtp = (id) => {
        setSelectedId(id);
        router.post(route('manage.appointments.send-otp', id), {}, { preserveScroll: true });
    };

    const verifyOtp = (event) => {
        event.preventDefault();
        if (!selectedId) return;

        otpForm.post(route('manage.appointments.verify-otp', selectedId), {
            preserveScroll: true,
            onSuccess: () => otpForm.reset('otp'),
        });
    };

    return (
        <div className="public-page min-h-screen bg-gray-50 flex flex-col justify-between font-sans text-gray-900 antialiased overflow-x-hidden">
            <Head title="Manage Appointments" />
            
            <header className="w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 py-3 fixed top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img src="/healingTouchLogo.jpeg" alt="Logo" className="h-9 w-9 shrink-0 object-cover rounded-full" />
                        <div className="leading-none">
                            <div className="font-black text-lg text-gray-800 tracking-tight leading-none"><span className="text-beige-700">Healing</span> Touch</div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Booking Portal</p>
                        </div>
                    </div>
                    <a href="https://healingtouchpurnea.com" className="text-xs font-bold text-gray-600 hover:text-beige-700 bg-gray-100 hover:bg-beige-50 px-3 py-1.5 rounded-full transition-colors">
                        Back to Website
                    </a>
                </div>
            </header>

            <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col pt-24 pb-10 px-4">
                <div className="bg-white rounded-md border border-gray-200 p-5 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-black text-gray-900">Manage Appointments</h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">Track or cancel your bookings via OTP.</p>
                    </div>
                    <Link href={route('login')} className="bg-beige-50 hover:bg-beige-100 text-beige-700 font-bold px-5 py-2.5 rounded-md border border-beige-200 transition-colors text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                        Patient Login
                    </Link>
                </div>

                <form onSubmit={submitSearch} className="bg-white rounded-md border border-gray-200 p-4 sm:p-5 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button type="button" onClick={() => setSearchMethod('phone')} className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${searchMethod === 'phone' ? 'bg-beige-600 text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
                            By Phone
                        </button>
                        <button type="button" onClick={() => setSearchMethod('email')} className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${searchMethod === 'email' ? 'bg-beige-600 text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
                            By Email
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {searchMethod === 'phone' ? (
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="md:col-span-2 rounded-md border-gray-200 text-sm font-semibold focus:border-beige-500 focus:ring-beige-500" />
                        ) : (
                            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="md:col-span-2 rounded-md border-gray-200 text-sm font-semibold focus:border-beige-500 focus:ring-beige-500" />
                        )}
                        <button className="bg-beige-600 hover:bg-beige-700 text-white rounded-md font-bold px-4 py-2.5 transition-colors shadow-sm text-sm">Search</button>
                    </div>
                </form>

                <div className="mt-6 bg-white rounded-md border border-gray-200 overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                    {hasResults ? (
                        <>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full min-w-[760px]">
                                <thead className="bg-gray-50 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">
                                    <tr>
                                        <th className="px-5 py-4">Reference</th>
                                        <th className="px-5 py-4">Doctor</th>
                                        <th className="px-5 py-4">Date/Time</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id} className="border-t border-gray-100">
                                            <td className="px-5 py-4 font-bold text-gray-900 text-sm">{appointment.reference_id}</td>
                                            <td className="px-5 py-4 text-sm font-semibold text-gray-700">Dr. {appointment.doctor_name}</td>
                                            <td className="px-5 py-4 text-sm font-medium text-gray-600">{appointment.appointment_date} <span className="text-gray-300 mx-1">•</span> {appointment.appointment_time}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wide font-black ${appointment.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 flex items-center gap-3">
                                                <Link href={route('appointment.receipt', appointment.id)} className="text-xs font-bold text-beige-600 hover:text-beige-800 transition-colors">Receipt</Link>
                                                {appointment.status !== 'cancelled' && (
                                                    <button onClick={() => sendOtp(appointment.id)} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors">Cancel</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>

                            <div className="md:hidden divide-y divide-gray-100">
                                {appointments.map((appointment) => (
                                    <div key={appointment.id} className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Ref ID</p>
                                                <p className="font-bold text-gray-900 text-sm break-all">{appointment.reference_id}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wide font-black whitespace-nowrap ${appointment.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                                            <p className="text-sm font-bold text-gray-800">Dr. {appointment.doctor_name}</p>
                                            <p className="text-xs font-medium text-gray-500 mt-1">{appointment.appointment_date} <span className="mx-1">•</span> {appointment.appointment_time}</p>
                                        </div>
                                        <div className="flex items-center gap-3 pt-1">
                                            <Link href={route('appointment.receipt', appointment.id)} className="flex-1 text-center bg-beige-50 hover:bg-beige-100 text-beige-700 py-2 rounded-md text-xs font-bold border border-beige-200 transition-colors">View Receipt</Link>
                                            {appointment.status !== 'cancelled' && (
                                                <button onClick={() => sendOtp(appointment.id)} className="flex-1 text-center bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-md text-xs font-bold border border-red-100 transition-colors">Cancel (OTP)</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <p className="text-sm font-bold text-gray-600">No appointments found.</p>
                            <p className="text-xs font-medium text-gray-400 mt-1">Search by phone or email to view bookings.</p>
                        </div>
                    )}
                </div>

                {selectedId && (
                    <form onSubmit={verifyOtp} className="mt-6 bg-white rounded-md border border-gray-200 p-5 max-w-sm shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-md bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="font-black text-gray-900 text-sm">Cancel Appointment</h3>
                        </div>
                        <input value={otpForm.data.otp} onChange={(e) => otpForm.setData('otp', e.target.value)} className="w-full rounded-md border-gray-200 text-sm font-semibold focus:border-red-500 focus:ring-red-500" placeholder="Enter 4-digit OTP" />
                        {errors?.otp && <p className="text-[11px] font-bold text-red-500 mt-1.5">{errors.otp}</p>}
                        <button disabled={otpForm.processing} className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2.5 font-bold text-sm transition-colors shadow-sm disabled:opacity-70">
                            Verify & Cancel Booking
                        </button>
                    </form>
                )}
            </div>

            <footer className="hidden sm:block text-center py-6 text-xs text-gray-400 mt-auto">
                &copy; {new Date().getFullYear()} Healing Touch Hospital. All rights reserved.
            </footer>
        </div>
    );
}
