import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function DoctorLayout({ children }) {
    const page = usePage();
    const { auth, doctor } = page.props;
    const currentUrl = page.url;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Dashboard', href: route('doctor.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    ];

    return (
        <div className="flex bg-[#f6f8fb] min-h-screen font-inter select-none">
            {/* Sidebar */}
            <aside className={`hidden md:block fixed inset-y-0 left-0 glass-sidebar transition-all duration-300 ease-in-out z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-5 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-[#00685f] rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-[#00685f]/15 rotate-2">H</div>
                            {isSidebarOpen && (
                                <div className="flex flex-col">
                                    <span className="text-lg font-black text-[#0d1c2e] leading-none font-manrope">Healing</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#00685f]">Doctor Panel</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <nav className="flex-1 px-3 space-y-1">
                        {navigation.map((item) => {
                            const isActive = currentUrl === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group relative ${
                                        isActive 
                                        ? 'bg-[#00685f]/10 text-[#00685f]' 
                                        : 'text-[#0d1c2e]/50 hover:bg-[#00685f]/5 hover:text-[#0d1c2e]'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 w-1 h-7 bg-[#00685f] rounded-r-full animate-in slide-in-from-left-full duration-300" />
                                    )}
                                    <svg className={`w-[22px] h-[22px] shrink-0 transition-transform duration-300 ${
                                        isActive ? 'text-[#00685f] scale-110' : 'text-[#0d1c2e]/40 group-hover:scale-110'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                    </svg>
                                    {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-4 pb-3">
                        <div className="rounded-xl border border-[#00685f]/10 bg-white/70 px-3 py-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#00685f]/50">Mode to Doctor Panel</p>
                            <Link href={route('userlandingpage')} className="mt-2 inline-flex text-xs font-semibold text-[#0d1c2e]/60 hover:text-[#00685f] transition-colors">Public Site</Link>
                        </div>
                    </div>

                    <div className="p-4 mt-auto">
                        <Link
                            method="post"
                            href={route('doctor.logout')}
                            as="button"
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/60 text-[#0d1c2e]/40 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
                        >
                            <svg className="w-[22px] h-[22px] shrink-0 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            {isSidebarOpen && <span className="font-black text-[10px] tracking-[0.2em] uppercase">Terminate Session</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ease-in-out ml-0 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-[#f6f8fb]/90 backdrop-blur-2xl px-4 md:px-8 py-3 md:py-5 flex justify-between items-center transition-all duration-300 border-b border-slate-200/60">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block p-2.5 bg-white rounded-xl text-[#0d1c2e]/60 hover:text-[#00685f] shadow-sm hover:shadow-md transition-all">
                        <svg className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    
                    <div className="flex items-center gap-3 md:gap-6 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-[#0d1c2e] font-manrope">DR. {doctor.name}</p>
                            <p className="text-[10px] font-black text-[#00685f] uppercase tracking-[0.3em] leading-none mt-1 opacity-60">Attending Physician</p>
                        </div>
                        <div className="relative group">
                            <div className="w-10 h-10 md:w-11 md:h-11 bg-white rounded-xl overflow-hidden border-2 border-white shadow-lg group-hover:border-[#00685f]/20 transition-all duration-300 cursor-pointer">
                                <img src={doctor.image || `https://ui-avatars.com/api/?name=${doctor.name}&background=00685f&color=fff&bold=true`} alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="px-4 md:px-8 pb-8 md:pb-10 pt-4 md:pt-5 inertia-transition-fade max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

