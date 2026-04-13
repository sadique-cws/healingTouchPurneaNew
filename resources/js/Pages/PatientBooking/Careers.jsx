import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';

export default function Careers({ careers = [] }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Careers" />
            <Header />

            <div className="max-w-6xl mx-auto px-4 pt-32 pb-12">
                <h1 className="text-3xl font-bold text-gray-900">Career Opportunities</h1>
                <p className="text-gray-600 mt-2">Join our healthcare team.</p>

                <div className="mt-8 grid gap-4">
                    {careers.length ? careers.map((career) => (
                        <div key={career.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{career.title}</h2>
                                    <p className="text-sm text-gray-500 mt-1">{career.location} {career.salary ? `• ${career.salary}` : ''}</p>
                                </div>
                                <Link href={route('career.detail', career.id)} className="text-sm font-semibold text-beige-700 hover:text-beige-800">
                                    View Details
                                </Link>
                            </div>
                            <p className="text-gray-700 mt-3 line-clamp-2">{career.description}</p>
                        </div>
                    )) : (
                        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">No openings available right now.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
