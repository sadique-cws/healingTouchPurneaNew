import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function DoctorLayout({ children }) {
    const { auth, doctor } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Dashboard', href: route('doctor.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'My Schedule', href: '#', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Patient Files', href: '#', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    ];

    return (
        <div className="flex bg-slate-50 min-h-screen font-['Inter']">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-[#0d9488] shadow-2xl transition-all duration-300 z-50 overflow-hidden ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 mb-8 mt-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-teal-600 font-black shrink-0 shadow-lg shadow-black/10">HT</div>
                            {isSidebarOpen && (
                                <span className="text-lg font-black text-white tracking-tight whitespace-nowrap uppercase">Clinician Portal</span>
                            )}
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-200 group ${
                                    usePage().url === item.href 
                                    ? 'bg-white/10 text-white' 
                                    : 'text-teal-100 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <svg className="w-6 h-6 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                                </svg>
                                {isSidebarOpen && <span className="font-bold text-sm tracking-wide">{item.name}</span>}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-6 mt-auto">
                        <Link
                            method="post"
                            href={route('doctor.logout')}
                            as="button"
                            className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-white/5 text-teal-50 hover:bg-red-500/20 hover:text-white transition-all group"
                        >
                            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            {isSidebarOpen && <span className="font-bold text-sm tracking-wide uppercase">Sign Out</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white shadow-sm px-8 py-5">
                    <div className="flex justify-between items-center">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-teal-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-800">DR. {doctor.name}</p>
                                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest leading-none">Consulting Physician</p>
                            </div>
                            <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-inner">
                                <img src={doctor.image || `https://ui-avatars.com/api/?name=${doctor.name}&background=0d9488&color=fff`} className="w-full h-full object-cover" alt="" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
