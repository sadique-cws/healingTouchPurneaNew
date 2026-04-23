import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function Careers({ careers = [] }) {
    return (
        <div className="public-page min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden pb-10 flex flex-col">
            <Head title="Careers - Healing Touch" />
            <Header />

            <div className="bg-slate-900 mt-16 pt-16 pb-28 px-4 relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-beige-900/20 via-slate-900 to-slate-900"></div>
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <span className="bg-white/10 text-beige-100 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block border border-white/10">Join Healing Touch</span>
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">Build the future of <br className="hidden sm:block"/>healthcare with us.</h1>
                    <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto mb-2">We are always looking for passionate, skilled individuals to join our mission of delivering exceptional medical care to the society.</p>
                </div>
            </div>

            <main className="max-w-5xl mx-auto w-full px-4 -mt-16 relative z-20 flex-1 pb-16">
                
                <div className="flex items-center justify-between mb-6 px-2">
                    <h2 className="text-xl font-black text-gray-900">Open Positions</h2>
                    <span className="text-sm font-bold text-gray-500">{careers.length} job{careers.length !== 1 && 's'} available</span>
                </div>

                <div className="grid gap-4 sm:gap-6">
                    {careers.length ? careers.map((career) => (
                        <div key={career.id} className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                <div className="flex-1">
                                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 group-hover:text-beige-600 transition-colors">{career.title}</h3>
                                    
                                    <div className="flex flex-wrap items-center gap-2 mt-3 mb-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold font-mono">
                                            <span>📍</span> {career.location}
                                        </span>
                                        {career.salary && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold font-mono">
                                                <span>💰</span> {career.salary}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-beige-50 text-beige-700 border border-beige-100 rounded-lg text-xs font-bold font-mono">
                                            <span>⏱️</span> Full Time
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-2 md:line-clamp-3 w-4/5">
                                        {career.description}
                                    </p>
                                </div>
                                
                                <div className="shrink-0 flex items-center justify-start sm:justify-end w-full sm:w-auto border-t sm:border-0 border-gray-100 pt-4 sm:pt-0 mt-2 sm:mt-0">
                                    <Link 
                                        href={route('career.detail', career.id)} 
                                        className="w-full sm:w-auto text-center px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-black transition-all active:scale-95"
                                    >
                                        Apply Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-gray-900">No Openings Available</h3>
                            <p className="text-gray-500 mt-2">Currently, there are no open positions. Please check back later or drop your resume at our hospital desk.</p>
                        </div>
                    )}
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
