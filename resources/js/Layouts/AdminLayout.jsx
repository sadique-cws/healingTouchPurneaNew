import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Doctors', href: route('admin.doctors.index'), icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { name: 'Appointments', href: route('admin.appointments.index'), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Staff Users', href: route('admin.users.index'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Departments', href: route('admin.departments.index'), icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { name: 'Gallery', href: route('admin.gallery.index'), icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Careers', href: route('admin.careers.index'), icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745V6a2 2 0 012-2h14a2 2 0 012 2v7.255zM12 8a1 1 0 100-2 1 1 0 000 2z' },
        { name: 'Settings', href: route('admin.settings.index'), icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ];

    return (
        <div className="flex bg-slate-50 min-h-screen">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white shadow-2xl transition-all duration-300 z-50 overflow-hidden ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-teal-500/30">H</div>
                            {isSidebarOpen && (
                                <span className="text-lg font-black text-slate-800 tracking-tight whitespace-nowrap">HT Portal</span>
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
                                    ? 'bg-teal-50 text-teal-600' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <svg className={`w-6 h-6 shrink-0 transition-colors ${
                                    usePage().url === item.href ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-900'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                                {isSidebarOpen && <span className="font-bold text-sm tracking-wide">{item.name}</span>}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-6 border-t border-slate-100 mt-auto">
                        <Link
                            method="post"
                            href={route('admin.logout')}
                            as="button"
                            className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all group"
                        >
                            <svg className="w-6 h-6 shrink-0 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            {isSidebarOpen && <span className="font-bold text-sm tracking-wide uppercase">Logout</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5">
                    <div className="flex justify-between items-center">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div className="flex items-center space-x-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-800">{auth.user.name}</p>
                                <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest leading-none">Administrator</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm hover:border-teal-400 transition-colors cursor-pointer">
                                <img src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=0d9488&color=fff`} alt="" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
