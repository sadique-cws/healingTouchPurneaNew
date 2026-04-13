import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function BookingHelp({ hospital_name, address, contact_phone, contact_email }) {
    const steps = [
        'Select department and doctor.',
        'Choose tomorrow\'s available slot.',
        'Fill patient details carefully.',
        'Review details and confirm booking.',
        'Download receipt and keep appointment number.',
    ];

    return (
        <div className="public-page min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden pb-16 lg:pb-0 flex flex-col">
            <Head title="Booking Help" />
            <Header hospitalName={hospital_name} />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 pt-24 sm:pt-28 pb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">How Booking Works</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-2">Follow these steps to complete your appointment booking smoothly.</p>

                    <div className="mt-6 space-y-3">
                        {steps.map((item, idx) => (
                            <div key={item} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
                                <span className="w-7 h-7 shrink-0 rounded-full bg-beige-600 text-white text-xs font-bold flex items-center justify-center">
                                    {idx + 1}
                                </span>
                                <p className="text-sm sm:text-base text-gray-800">{item}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 sm:p-4">
                        <p className="text-sm text-amber-800 font-medium">Important:</p>
                        <ul className="mt-2 space-y-1 text-sm text-amber-700">
                            <li>- Slot availability is live and can fill anytime.</li>
                            <li>- Booking is final only after confirmation screen appears.</li>
                            <li>- Keep your phone number correct for updates.</li>
                        </ul>
                    </div>
                </div>
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
