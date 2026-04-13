import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function DoctorDetails({ doctor }) {
    const qualification = Array.isArray(doctor?.qualification)
        ? doctor.qualification.join(', ')
        : String(doctor?.qualification || '-');

    const availableDays = Array.isArray(doctor?.available_days)
        ? doctor.available_days
        : [];

    return (
        <div className="public-page min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden pb-16 lg:pb-0 flex flex-col">
            <Head title={`Dr. ${doctor?.user?.name || 'Doctor'}`} />
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
                <Link href={route('our.doctors')} className="inline-flex items-center text-sm text-beige-700 font-semibold hover:underline">
                    ← Back to Doctors
                </Link>

                <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-beige-50 to-beige-100 border-b border-beige-100 px-5 sm:px-6 py-5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <img
                                src={doctor?.image || '/images/default.jpg'}
                                alt={doctor?.user?.name}
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md"
                            />

                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dr. {doctor?.user?.name}</h1>
                                <p className="text-beige-700 font-semibold mt-1 text-lg">{doctor?.department?.name}</p>
                                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                                    <span className="px-3 py-1 rounded-full bg-white text-gray-700 border border-gray-200">₹{doctor?.fee || '-'}</span>
                                    <span className="px-3 py-1 rounded-full bg-white text-gray-700 border border-gray-200">{qualification}</span>
                                </div>
                            </div>

                            <Link href={route('book.appointment', { slug: doctor?.slug })} className="inline-flex items-center justify-center bg-beige-600 hover:bg-beige-700 text-white px-5 py-3 rounded-lg font-semibold shadow-sm self-start sm:self-center">
                                Book Appointment
                            </Link>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-5">
                            <div className="rounded-2xl bg-beige-50/60 border border-beige-100 p-5">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Doctor Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-beige-600 border border-beige-100 shrink-0">🏥</div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-gray-500">Department</p>
                                            <p className="font-semibold text-gray-900">{doctor?.department?.name || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-beige-600 border border-beige-100 shrink-0">🎓</div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-gray-500">Qualification</p>
                                            <p className="font-semibold text-gray-900">{qualification}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-beige-600 border border-beige-100 shrink-0">💰</div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-gray-500">Consultation Fee</p>
                                            <p className="font-semibold text-gray-900">₹{doctor?.fee || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-beige-600 border border-beige-100 shrink-0">📅</div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-gray-500">Available Days</p>
                                            <p className="font-semibold text-gray-900">{availableDays.length ? availableDays.join(', ') : 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-3">About Dr. {doctor?.user?.name}</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    Dr. {doctor?.user?.name} is a highly skilled healthcare professional with comprehensive training and experience in the field of {doctor?.department?.name || 'medicine'}.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                                <h3 className="text-base font-bold text-gray-900 mb-4">Availability</h3>
                                <div className="flex flex-wrap gap-2">
                                    {availableDays.length ? availableDays.map((day) => (
                                        <span key={day} className="px-3 py-1.5 rounded-full bg-beige-50 text-beige-700 border border-beige-100 text-sm font-medium">
                                            {day}
                                        </span>
                                    )) : (
                                        <p className="text-sm text-gray-500">Availability not specified.</p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-beige-600 text-white p-5 shadow-sm">
                                <h3 className="text-base font-bold mb-2">Book this doctor</h3>
                                <p className="text-beige-100 text-sm mb-4">Proceed to appointment booking with this doctor already selected.</p>
                                <Link href={route('book.appointment', { slug: doctor?.slug })} className="inline-flex items-center justify-center bg-white text-beige-700 hover:bg-beige-50 px-4 py-2.5 rounded-lg font-semibold">
                                    Continue Booking
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
