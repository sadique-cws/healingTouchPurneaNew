import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Header from '@/Components/Header';

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
        <div className="min-h-screen bg-gray-50">
            <Head title="Manage Appointments" />
            <Header />

            <div className="max-w-6xl mx-auto px-4 pt-32 pb-12">
                <h1 className="text-3xl font-bold text-gray-900">Manage Appointments</h1>
                <p className="text-gray-600 mt-2">Find your booking and cancel with OTP if needed.</p>

                <form onSubmit={submitSearch} className="mt-6 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button type="button" onClick={() => setSearchMethod('phone')} className={`px-4 py-2 rounded-full text-sm font-semibold ${searchMethod === 'phone' ? 'bg-beige-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                            Search by Phone
                        </button>
                        <button type="button" onClick={() => setSearchMethod('email')} className={`px-4 py-2 rounded-full text-sm font-semibold ${searchMethod === 'email' ? 'bg-beige-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                            Search by Email
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {searchMethod === 'phone' ? (
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="md:col-span-2 rounded-lg border-gray-200" />
                        ) : (
                            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="md:col-span-2 rounded-lg border-gray-200" />
                        )}
                        <button className="bg-beige-600 hover:bg-beige-700 text-white rounded-lg font-semibold px-4 py-2.5">Search</button>
                    </div>
                </form>

                <div className="mt-6 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                    {hasResults ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3">Reference</th>
                                        <th className="px-4 py-3">Doctor</th>
                                        <th className="px-4 py-3">Date/Time</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id} className="border-t">
                                            <td className="px-4 py-3 font-semibold text-gray-800">{appointment.reference_id}</td>
                                            <td className="px-4 py-3 text-gray-700">Dr. {appointment.doctor_name}</td>
                                            <td className="px-4 py-3 text-gray-700">{appointment.appointment_date} • {appointment.appointment_time}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 flex items-center gap-2">
                                                <Link href={route('appointment.receipt', appointment.id)} className="text-sm font-semibold text-beige-700">Receipt</Link>
                                                {appointment.status !== 'cancelled' && (
                                                    <button onClick={() => sendOtp(appointment.id)} className="text-sm font-semibold text-red-600">Cancel (OTP)</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">No appointments found.</div>
                    )}
                </div>

                {selectedId && (
                    <form onSubmit={verifyOtp} className="mt-6 bg-white rounded-xl border border-gray-100 p-5 shadow-sm max-w-md">
                        <h3 className="font-semibold text-gray-900">Enter OTP to Cancel</h3>
                        <input value={otpForm.data.otp} onChange={(e) => otpForm.setData('otp', e.target.value)} className="mt-3 w-full rounded-lg border-gray-200" placeholder="4-digit OTP" />
                        {errors?.otp && <p className="text-xs text-red-600 mt-1">{errors.otp}</p>}
                        <button disabled={otpForm.processing} className="mt-3 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2.5 font-semibold">
                            Verify & Cancel
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
