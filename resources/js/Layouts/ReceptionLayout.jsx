import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function ReceptionLayout({ children }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Dashboard', href: route('reception.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'New Registration', href: '#', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
        { name: 'Queue Today', href: '#', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    ];

    return (
        <div className="flex bg-slate-50 min-h-screen font-['Inter']">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-[#0f172a] shadow-2xl transition-all duration-300 z-50 overflow-hidden ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 mb-8 mt-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-amber-500/30">R</div>
                            {isSidebarOpen && (
                                <div className="flex flex-col">
                                    <span className="text-lg font-black text-white tracking-tight whitespace-nowrap leading-none">Desk Portal</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reception Unit</span>
                                </div>
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
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <svg className={`w-6 h-6 shrink-0 transition-colors ${
                                    usePage().url === item.href ? 'text-white' : 'text-slate-500 group-hover:text-white'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                                </svg>
                                {isSidebarOpen && <span className="font-bold text-sm tracking-wide">{item.name}</span>}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-6 mt-auto">
                        <Link
                            method="post"
                            href={route('reception.logout')}
                            as="button"
                            className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-white transition-all group"
                        >
                            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            {isSidebarOpen && <span className="font-bold text-sm tracking-wide uppercase">Close Session</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm px-8 py-5">
                    <div className="flex justify-between items-center">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-amber-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div className="flex items-center space-x-5">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-800">{auth.user.name}</p>
                                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none">Front Desk Executive</p>
                            </div>
                            <div className="w-11 h-11 bg-amber-50 rounded-2xl border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                                <img src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=f59e0b&color=fff`} className="w-full h-full object-cover" alt="" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
