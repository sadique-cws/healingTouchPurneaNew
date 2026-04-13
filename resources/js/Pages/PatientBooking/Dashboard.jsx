import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function Dashboard({ stats, bookings = [], latestBooking, profile, hospital_name, address, contact_phone, contact_email }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const role = (user?.role || 'patient').toString();
    const roleLabel = role === 'admin' ? 'Admin Panel' : role === 'doctor' ? 'Doctor Panel' : role === 'reception' ? 'Reception Desk' : 'Patient Panel';

    const statCards = [
        { label: 'Total Bookings', value: stats?.total_bookings ?? 0, tone: 'text-slate-900' },
        { label: 'Upcoming', value: stats?.upcoming ?? 0, tone: 'text-emerald-700' },
        { label: 'Completed', value: stats?.completed ?? 0, tone: 'text-beige-700' },
        { label: 'Cancelled', value: stats?.cancelled ?? 0, tone: 'text-red-600' },
    ];

    return (
        <div className="public-page min-h-screen bg-[#f5f7fb] text-gray-900 antialiased overflow-x-hidden pb-16 lg:pb-0 flex flex-col">
            <Head title="My Dashboard | Healing Touch Hospital" />
            <Header />

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-28 sm:pt-32 pb-10">
                <section className="rounded-3xl border border-gray-200 bg-white p-5 md:p-7 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-beige-700">Patient Dashboard</p>
                            <h1 className="mt-2 text-2xl md:text-4xl font-black tracking-tight text-gray-900">Welcome, {profile?.name || user?.name || 'Guest'}</h1>
                            <p className="mt-2 text-sm text-gray-500">Your phone, email, and booking history in one place.</p>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                            <div className="h-12 w-12 rounded-full bg-beige-700 text-white flex items-center justify-center font-black">
                                {(profile?.initials || 'U').slice(0, 2)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{profile?.email || user?.email || '-'}</p>
                                <p className="text-xs text-gray-500">{profile?.phone || user?.phone || 'No phone linked'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {statCards.map((item) => (
                            <div key={item.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">{item.label}</p>
                                <p className={`mt-2 text-2xl font-black ${item.tone}`}>{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 rounded-2xl border border-beige-200 bg-beige-50 p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-beige-700">Mode to {roleLabel}</p>
                                <p className="mt-1 text-sm text-gray-600">Use the quick links below to jump to other panels if needed.</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link href={route('userlandingpage')} className="rounded-xl bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-gray-700 border border-beige-100">Public Site</Link>
                                <Link href={route('admin.login')} className="rounded-xl bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-gray-700 border border-beige-100">Admin</Link>
                                <Link href={route('doctor.login')} className="rounded-xl bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-gray-700 border border-beige-100">Doctor</Link>
                                <Link href={route('reception.login')} className="rounded-xl bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-gray-700 border border-beige-100">Reception</Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
                    <div className="lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-5 md:p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg md:text-xl font-black text-gray-900">Recent Bookings</h2>
                                <p className="text-sm text-gray-500">Latest appointment activity</p>
                            </div>
                            <Link href={route('manage.appointments')} className="rounded-xl border border-beige-200 bg-beige-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-beige-700">Manage</Link>
                        </div>

                        <div className="mt-5 space-y-3">
                            {bookings.length > 0 ? bookings.slice(0, 5).map((booking) => (
                                <div key={booking.id} className="rounded-2xl border border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gray-50/60">
                                    <div>
                                        <p className="text-sm font-black text-gray-900">{booking.reference_id}</p>
                                        <p className="text-sm text-gray-600">Dr. {booking.doctor_name || '-'} • {booking.department || '-'}</p>
                                        <p className="text-xs text-gray-500 mt-1">{booking.appointment_date} • {booking.appointment_time} • Queue #{booking.queue_number}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : booking.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{booking.status}</span>
                                        <Link href={route('appointment.receipt', booking.id)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700">Receipt</Link>
                                    </div>
                                </div>
                            )) : (
                                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center">
                                    <p className="text-sm font-semibold text-gray-700">No bookings found yet.</p>
                                    <p className="mt-1 text-xs text-gray-500">Book your first appointment to see it here.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-gray-400">Latest Booking</h3>
                            {latestBooking ? (
                                <div className="mt-3 space-y-2">
                                    <p className="text-lg font-black text-gray-900">{latestBooking.reference_id}</p>
                                    <p className="text-sm text-gray-600">Dr. {latestBooking.doctor_name || '-'}</p>
                                    <p className="text-sm text-gray-600">{latestBooking.appointment_date} • {latestBooking.appointment_time}</p>
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-gray-500">No recent appointment yet.</p>
                            )}
                        </div>

                        <div className="rounded-3xl border border-gray-200 bg-beige-50 p-5 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-beige-800">Quick Actions</h3>
                            <div className="mt-4 grid grid-cols-1 gap-2">
                                <Link href={route('book.appointment')} className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-800 border border-beige-100">Book Appointment</Link>
                                <Link href={route('manage.appointments')} className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-800 border border-beige-100">Manage Bookings</Link>
                                <Link href={route('account.page')} className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-800 border border-beige-100">Account Center</Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 lg:hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Panel Mode</p>
                            <p className="text-sm font-semibold text-gray-700">Patient Dashboard</p>
                        </div>
                        <Link href={route('userlandingpage')} className="rounded-xl bg-beige-700 px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-white">Public Site</Link>
                    </div>
                </section>
            </main>

            <PublicFooter
                hospitalName={hospital_name}
                address={address}
                contact_phone={contact_phone}
                contact_email={contact_email}
            />
        </div>
    );
}
