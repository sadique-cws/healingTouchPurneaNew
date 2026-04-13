import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';

export default function CareerDetail({ career }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={career?.title || 'Career Detail'} />
            <Header />

            <div className="max-w-4xl mx-auto px-4 pt-32 pb-12">
                <Link href={route('careers.page')} className="text-sm text-beige-700 font-semibold">← Back to Careers</Link>

                <div className="mt-4 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-900">{career?.title}</h1>
                    <p className="text-sm text-gray-500 mt-2">{career?.location} {career?.salary ? `• ${career.salary}` : ''}</p>

                    <div className="mt-6 text-gray-700 whitespace-pre-line leading-relaxed">{career?.description}</div>
                </div>
            </div>
        </div>
    );
}
