import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function CareerDetail({ career }) {
    return (
        <div className="public-page min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden pb-10 flex flex-col">
            <Head title={career?.title || 'Job Opening - Healing Touch'} />
            <Header />

            <div className="bg-slate-900 mt-16 pt-12 sm:pt-16 pb-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[size:20px_20px]"></div>
                <div className="max-w-4xl mx-auto relative z-10 text-left">
                    <Link href={route('careers.page')} className="inline-flex items-center gap-2 text-sm text-beige-400 font-bold hover:text-beige-300 transition-colors mb-6 bg-white/5 py-1.5 px-3 rounded-lg border border-white/5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to all openings
                    </Link>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">{career?.title}</h1>
                    <div className="flex flex-wrap items-center gap-3">
                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-widest border border-slate-700">
                             <span>📍</span> {career?.location}
                         </span>
                         {career?.salary && (
                             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 rounded-lg text-xs font-bold uppercase tracking-widest">
                                 <span>💰</span> {career.salary}
                             </span>
                         )}
                         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-beige-900/30 text-beige-400 border border-beige-800/50 rounded-lg text-xs font-bold uppercase tracking-widest">
                             <span>⏱️</span> Full Time
                         </span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 w-full -mt-10 relative z-20 flex-1">
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-900/5 border border-slate-100 mb-10 flex flex-col gap-6">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3">Job Description</h2>
                    <div className="prose prose-slate max-w-none text-gray-700 whitespace-pre-line leading-relaxed sm:text-lg">
                        {career?.description}
                    </div>
                    
                    <div className="mt-8 p-6 bg-beige-50 rounded-2xl border border-beige-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                             <h3 className="text-lg font-black text-gray-900">Interested in this role?</h3>
                             <p className="text-sm font-bold text-gray-500 mt-1">Please drop your updated resume at the hospital reception desk or email us directly.</p>
                        </div>
                        <a href="mailto:contact@healingtouch.in" className="w-full sm:w-auto text-center px-8 py-4 bg-beige-600 hover:bg-beige-700 text-white rounded-xl text-lg font-black transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-beige-600/30">
                            Apply via Email
                        </a>
                    </div>
                </div>
            </div>

            <PublicFooter />
        </div>
    );
}
