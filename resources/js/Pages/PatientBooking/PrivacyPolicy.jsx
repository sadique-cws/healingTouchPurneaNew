import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Privacy Policy" />
            <Header />

            <div className="max-w-4xl mx-auto px-4 pt-32 pb-12">
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                    <p className="text-gray-700 mt-4 leading-relaxed">
                        We collect only required appointment and patient details to deliver clinical services,
                        scheduling, and communication. Data is handled securely and used strictly for hospital
                        operations and patient care. We do not sell personal data to third parties.
                    </p>
                </div>
            </div>
        </div>
    );
}
