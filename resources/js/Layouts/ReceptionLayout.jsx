import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function ReceptionLayout({ children }) {
    const page = usePage();
    const { auth } = page.props;
    const currentUrl = page.url;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [appointmentAlerts, setAppointmentAlerts] = useState([]);
    const notificationAudioRef = useRef(null);

    const navigation = [
        { name: 'Dashboard', href: route('reception.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    ];

    useEffect(() => {
        const audio = new Audio('/sounds/notification.mp3');
        audio.preload = 'auto';
        notificationAudioRef.current = audio;

        if (!window.Echo) return;

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
            setAppointmentAlerts((previous) => [alertItem, ...previous]);
        });

        return () => window.Echo.leave('appointments-channel');
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

    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [currentUrl]);

    useEffect(() => {
        document.body.style.overflow = isMobileSidebarOpen ? 'hidden' : '';

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsMobileSidebarOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isMobileSidebarOpen]);

    const showSidebarLabels = isSidebarOpen || isMobileSidebarOpen;

    const handleSidebarToggle = () => {
        if (window.innerWidth < 1024) {
            setIsMobileSidebarOpen((prev) => !prev);
            return;
        }
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="flex bg-[#f4f6f9] min-h-screen font-inter select-none overflow-x-hidden w-full relative">
            {/* Backdrop for Mobile Sidebar */}
            {isMobileSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-900/60 transition-opacity lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ease-in-out z-50 w-[80vw] max-w-[18rem] lg:w-auto lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarOpen ? 'lg:w-72' : 'lg:w-24'}`}>
                <div className="flex flex-col h-full overflow-y-auto">
                    <div className="p-4 mb-2 md:p-6 md:mb-4 flex items-center gap-4">
                        <ApplicationLogo className="h-10 w-10 md:h-12 md:w-12 shrink-0 text-amber-500 shadow-sm" />
                        {showSidebarLabels && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-lg font-black text-slate-800 leading-tight truncate">Healing Touch</span>
                                <span className="text-[11px] uppercase tracking-widest font-bold text-slate-500 truncate mt-0.5">Front Desk</span>
                            </div>
                        )}
                    </div>

                    <nav className="flex-1 px-3 md:px-4 space-y-1.5">
                        {navigation.map((item) => {
                            const isActive = currentUrl === item.href || currentUrl.startsWith(`${item.href}/`) || currentUrl.startsWith(`${item.href}?`);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className={`flex items-center gap-3.5 p-3.5 md:p-4 rounded-2xl transition-all duration-300 group relative ${
                                        isActive 
                                        ? 'bg-gradient-to-r from-amber-50 to-white text-amber-600 border border-amber-100 shadow-sm' 
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 w-1.5 h-8 bg-amber-500 rounded-r-full" />
                                    )}
                                    <svg className={`w-6 h-6 md:w-7 md:h-7 shrink-0 transition-transform duration-300 ${
                                        isActive ? 'text-amber-500' : 'text-slate-400 group-hover:scale-105 group-hover:text-amber-400'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                                    </svg>
                                    {showSidebarLabels && <span className="font-bold text-base tracking-tight">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="px-4 pb-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Internal Area</p>
                            <Link href={route('userlandingpage')} className="inline-flex w-full items-center justify-center text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2.5 hover:text-amber-600 hover:border-amber-200 shadow-sm">
                                Public Site
                            </Link>
                        </div>
                    </div>

                    <div className="p-4 md:p-5 mt-auto border-t border-slate-100">
                        <Link
                            method="post"
                            href={route('reception.logout')}
                            as="button"
                            className="w-full flex items-center justify-center gap-3 p-3.5 md:p-4 rounded-xl bg-slate-50 border border-slate-100 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all duration-300 group shadow-sm"
                        >
                            <svg className="w-5 h-5 md:w-6 md:h-6 shrink-0 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            {showSidebarLabels && <span className="font-bold text-sm tracking-widest uppercase">Logout</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-300 ease-in-out min-h-screen flex flex-col w-full max-w-[100vw] ${isSidebarOpen ? 'lg:ml-72 lg:max-w-[calc(100vw-18rem)]' : 'lg:ml-24 lg:max-w-[calc(100vw-6rem)]'}`}>
                {/* Floating Notifications */}
                {appointmentAlerts.length > 0 && (
                    <div className="fixed top-4 right-4 z-[60] w-[calc(100vw-2rem)] max-w-sm space-y-3">
                        {appointmentAlerts.map((alertItem) => (
                            <div key={alertItem._alertId} className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-4 md:p-5 animate-in slide-in-from-top-4 duration-300">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">New Appointment</p>
                                        <p className="text-base font-bold text-slate-800 mt-1">{alertItem.patient_name || 'Patient'}</p>
                                        <p className="text-sm font-semibold text-slate-500 mt-1">Dr. {alertItem.doctor_name || 'N/A'} • {alertItem.appointment_time || '-'}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAppointmentAlerts((prev) => prev.filter((item) => item._alertId !== alertItem._alertId))}
                                        className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mobile & Desktop Header */}
                <header className={`fixed top-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/70 shadow-sm px-4 md:px-8 py-3 flex justify-between items-center transition-all duration-300 left-0 ${isSidebarOpen ? 'lg:left-72' : 'lg:left-24'}`}>
                    <button onClick={handleSidebarToggle} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-100 sm:hidden">
                        <svg className="w-5 h-5 md:w-6 md:h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    
                    <div className="flex items-center gap-3 md:gap-5 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm md:text-base font-black text-slate-800 leading-none">{auth.user.name}</p>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Reception</p>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-2xl overflow-hidden border border-amber-200 shadow-sm">
                            <img src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=fff&color=f59e0b&bold=true`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-24 pb-6 md:pt-24 md:pb-8 overflow-x-hidden">
                    {children}
                </div>
            </main>
        </div>
    );
}
