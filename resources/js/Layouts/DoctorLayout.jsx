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
        <div className="flex bg-[#f8f9ff] min-h-screen font-inter select-none">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 glass-sidebar transition-all duration-500 ease-in-out z-50 ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-8 mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-[#00685f] rounded-2xl flex items-center justify-center text-white font-black shrink-0 shadow-2xl shadow-[#00685f]/20 rotate-3">H</div>
                            {isSidebarOpen && (
                                <div className="flex flex-col">
                                    <span className="text-xl font-black text-[#0d1c2e] leading-none font-manrope">Healing</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#00685f]">Doctor Panel</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = currentUrl === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group relative ${
                                        isActive 
                                        ? 'bg-[#00685f]/10 text-[#00685f]' 
                                        : 'text-[#0d1c2e]/50 hover:bg-[#00685f]/5 hover:text-[#0d1c2e]'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 w-1.5 h-8 bg-[#00685f] rounded-r-full animate-in slide-in-from-left-full duration-500" />
                                    )}
                                    <svg className={`w-6 h-6 shrink-0 transition-transform duration-300 ${
                                        isActive ? 'text-[#00685f] scale-110' : 'text-[#0d1c2e]/40 group-hover:scale-110'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                    </svg>
                                    {isSidebarOpen && <span className="font-bold text-sm tracking-tight">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-8 mt-auto">
                        <Link
                            method="post"
                            href={route('doctor.logout')}
                            as="button"
                            className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-white/50 text-[#0d1c2e]/40 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
                        >
                            <svg className="w-6 h-6 shrink-0 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            {isSidebarOpen && <span className="font-black text-[10px] tracking-[0.2em] uppercase">Terminate Session</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'ml-72' : 'ml-24'}`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-[#f8f9ff]/80 backdrop-blur-2xl px-12 py-8 flex justify-between items-center transition-all duration-300">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-white rounded-2xl text-[#0d1c2e]/60 hover:text-[#00685f] shadow-sm hover:shadow-md transition-all">
                        <svg className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    
                    <div className="flex items-center space-x-8">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-[#0d1c2e] font-manrope">DR. {doctor.name}</p>
                            <p className="text-[10px] font-black text-[#00685f] uppercase tracking-[0.3em] leading-none mt-1 opacity-60">Attending Physician</p>
                        </div>
                        <div className="relative group">
                            <div className="w-12 h-12 bg-white rounded-2xl overflow-hidden border-[3px] border-white shadow-xl group-hover:border-[#00685f]/20 transition-all duration-500 cursor-pointer">
                                <img src={doctor.image || `https://ui-avatars.com/api/?name=${doctor.name}&background=00685f&color=fff&bold=true`} alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="px-12 pb-12 inertia-transition-fade max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

