import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const page = usePage();
    const { auth } = page.props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [appointmentAlerts, setAppointmentAlerts] = useState([]);
    const notificationAudioRef = useRef(null);

    useEffect(() => {
        const audio = new Audio('/sounds/notification.mp3');
        audio.preload = 'auto';
        notificationAudioRef.current = audio;

        if (!window.Echo) {
            return;
        }

        const channel = window.Echo.channel('appointments-channel');

        channel.listen('.appointment-booked', (payload) => {
            const notificationAudio = notificationAudioRef.current;
            if (notificationAudio) {
                notificationAudio.currentTime = 0;
                notificationAudio.play().catch(() => {});
            }

            const alertItem = {
                ...payload,
                _alertId: `${payload?.id || 'appointment'}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            };

            setAppointmentAlerts((previousAlerts) => [alertItem, ...previousAlerts]);
        });

        return () => {
            window.Echo.leave('appointments-channel');
        };
    }, []);

    useEffect(() => {
        const syncLayout = () => {
            setIsSidebarOpen(window.innerWidth >= 1024);
            setIsMobileSidebarOpen(false);
        };

        syncLayout();
        window.addEventListener('resize', syncLayout);

        return () => window.removeEventListener('resize', syncLayout);
    }, []);

    const handleSidebarToggle = () => {
        if (window.innerWidth < 1024) {
            setIsMobileSidebarOpen((previous) => !previous);
            return;
        }

        setIsSidebarOpen((previous) => !previous);
    };

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

    const showSidebarLabels = isSidebarOpen || isMobileSidebarOpen;

    return (
        <div className="flex bg-[#f6f8fb] min-h-screen font-inter select-none">
            {isMobileSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 glass-sidebar transition-all duration-300 ease-in-out z-50 w-[85vw] max-w-[18rem] lg:w-auto lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}>
                <div className="flex flex-col h-full overflow-y-auto">
                    <div className="p-5 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-[#00685f] rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-[#00685f]/15 rotate-2">H</div>
                            {showSidebarLabels && (
                                <div className="flex flex-col">
                                    <span className="text-lg font-black text-[#0d1c2e] leading-none font-manrope">Healing</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#00685f]">Touch Portal</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <nav className="flex-1 px-3 space-y-1">
                        {navigation.map((item) => {
                            const isActive = page.url === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileSidebarOpen(false)}
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
                                    {showSidebarLabels && <span className="font-bold text-sm tracking-tight leading-none">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-4 pb-3">
                        <div className="rounded-xl border border-[#00685f]/10 bg-white/70 px-3 py-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#00685f]/50">Mode to Admin Panel</p>
                            <Link href={route('userlandingpage')} className="mt-2 inline-flex text-xs font-semibold text-[#0d1c2e]/60 hover:text-[#00685f] transition-colors">Public Site</Link>
                        </div>
                    </div>

                    <div className="p-4 mt-auto">
                        <Link
                            method="post"
                            href={route('admin.logout')}
                            as="button"
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/60 text-[#0d1c2e]/40 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
                        >
                            <svg className="w-[22px] h-[22px] shrink-0 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            {showSidebarLabels && <span className="font-black text-[10px] tracking-[0.2em] uppercase">Terminate Session</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ease-in-out ml-0 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                {appointmentAlerts.length > 0 && (
                    <div className="fixed top-4 right-4 z-[60] max-w-sm w-full space-y-3">
                        {appointmentAlerts.map((alertItem) => (
                            <div key={alertItem._alertId} className="bg-white rounded-xl shadow-lg border border-[#00685f]/20 p-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-black text-[#00685f] uppercase tracking-[0.2em]">New Appointment</p>
                                        <p className="text-sm font-bold text-[#0d1c2e] mt-1">{alertItem.patient_name || 'Patient'}</p>
                                        <p className="text-xs text-[#0d1c2e]/70 mt-1">Dr. {alertItem.doctor_name || 'N/A'} • {alertItem.appointment_time || '-'}</p>
                                        <p className="text-xs text-[#0d1c2e]/70 mt-0.5">ID: {alertItem.appointment_no || '-'}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAppointmentAlerts((previousAlerts) => previousAlerts.filter((item) => item._alertId !== alertItem._alertId))}
                                        className="text-[#0d1c2e]/40 hover:text-[#0d1c2e] transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Header */}
                <header className="sticky top-0 z-40 bg-[#f6f8fb]/90 backdrop-blur-2xl px-4 sm:px-6 md:px-8 py-4 md:py-5 flex justify-between items-center transition-all duration-300 border-b border-slate-200/60">
                    <button onClick={handleSidebarToggle} className="p-2.5 bg-white rounded-xl text-[#0d1c2e]/60 hover:text-[#00685f] shadow-sm hover:shadow-md transition-all">
                        <svg className="w-5 h-5 transition-transform duration-500 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-[#0d1c2e] font-manrope">{auth.user.name}</p>
                            <p className="text-[10px] font-black text-[#00685f] uppercase tracking-[0.3em] leading-none mt-1 opacity-60">System Admin</p>
                        </div>
                        <div className="relative group">
                            <div className="w-11 h-11 bg-white rounded-xl overflow-hidden border-2 border-white shadow-lg group-hover:border-[#00685f]/20 transition-all duration-300 cursor-pointer">
                                <img src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=00685f&color=fff&bold=true`} alt="" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="px-4 sm:px-6 md:px-8 pb-8 md:pb-10 pt-5 inertia-transition-fade">
                    {children}
                </div>
            </main>
        </div>
    );
}

