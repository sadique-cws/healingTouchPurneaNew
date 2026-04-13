import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function TermsCondition() {
    return (
        <div className="public-page min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden pb-16 lg:pb-0 flex flex-col">
            <Head title="Terms & Conditions" />
            <Header />

            <div className="max-w-4xl mx-auto px-4 pt-32 pb-12">
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
                    <p className="text-gray-700 mt-4 leading-relaxed">
                        By using this portal, you agree to provide accurate information for appointment booking,
                        follow hospital policies, and use services only for lawful healthcare purposes.
                        Appointment slots are subject to doctor availability and hospital operational constraints.
                    </p>
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
