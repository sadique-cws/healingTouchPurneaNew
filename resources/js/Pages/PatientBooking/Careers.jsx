import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function Careers({ careers = [] }) {
    return (
        <div className="public-page min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden pb-16 lg:pb-0 flex flex-col">
            <Head title="Careers" />
            <Header />

            <main className="max-w-7xl mx-auto w-full px-4 pt-28 sm:pt-32 pb-10">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-gray-900">Career Opportunities</h1>
                    <p className="text-gray-600 mt-2">Join our healthcare team.</p>
                </div>

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
            </main>

            <PublicFooter />
        </div>
    );
}
