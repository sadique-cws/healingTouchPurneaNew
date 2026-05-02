import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

const DESKTOP_SIDEBAR_KEY = 'admin.sidebar.desktopOpen';

export default function AdminLayout({ children }) {
    const page = usePage();
    const { auth } = page.props;
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(() => {
        if (typeof window === 'undefined') {
            return true;
        }

        const savedValue = window.localStorage.getItem(DESKTOP_SIDEBAR_KEY);

        if (savedValue !== null) {
            return savedValue === 'true';
        }

        return true;
    });
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
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        window.localStorage.setItem(DESKTOP_SIDEBAR_KEY, String(isDesktopSidebarOpen));
    }, [isDesktopSidebarOpen]);

    useEffect(() => {
        setIsMobileSidebarOpen(false);
    }, [page.url]);

    const handleSidebarToggle = () => {
        if (window.innerWidth < 1024) {
            setIsMobileSidebarOpen((previous) => !previous);
            return;
        }

        setIsDesktopSidebarOpen((previous) => !previous);
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

    const showSidebarLabels = isDesktopSidebarOpen || isMobileSidebarOpen;

    return (
        <div className="flex bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen h-screen font-inter select-none overflow-x-hidden">
            {isMobileSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-[78vw] max-w-xs bg-white border-r border-slate-200/50 overflow-hidden flex flex-col transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isDesktopSidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-4 border-b border-slate-100">
                        <div className="flex items-center  gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                                <ApplicationLogo className="h-6 w-6" />
                            </div>
                            {showSidebarLabels && (
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold text-slate-900 leading-none truncate">Healing Touch</span>
                                    <span className="text-xs text-teal-600 font-semibold">Admin</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
                        {navigation.map((item) => {
                            const isActive = page.url === item.href || page.url.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group ${
                                        isActive 
                                            ? 'bg-teal-50 text-teal-700 font-semibold' 
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-teal-600 rounded-r-full" />
                                    )}
                                    <svg className={`w-5 h-5 flex-shrink-0 transition-transform ${
                                        isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                    </svg>
                                    {showSidebarLabels && <span className="text-sm font-medium truncate">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Section */}
                    <div className="border-t border-slate-100 p-3 space-y-3">
                        <Link
                            href={route('userlandingpage')}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                        >
                            <svg className="w-5 h-5 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {showSidebarLabels && <span className="font-medium">Public Site</span>}
                        </Link>

                        <Link
                            method="post"
                            href={route('admin.logout')}
                            as="button"
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            {showSidebarLabels && <span>Logout</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white border-b border-slate-200/50 backdrop-blur-md shrink-0">
                    <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3.5 lg:py-4">
                        <button 
                            onClick={handleSidebarToggle} 
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            <svg className="w-6 h-6 lg:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className={`w-6 h-6 hidden lg:block transition-transform duration-300 ${isDesktopSidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="text-right hidden xs:block">
                                <p className="text-sm font-semibold text-slate-900">{auth.user.name}</p>
                                <p className="text-xs text-slate-500 font-medium">Admin</p>
                            </div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg overflow-hidden shadow-md">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=14b8a6&color=fff&bold=true`} 
                                    alt={auth.user.name}
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Notification Alerts */}
                {appointmentAlerts.length > 0 && (
                    <div className="fixed bottom-4 sm:bottom-auto sm:top-20 right-4 z-[60] max-w-sm space-y-2">
                        {appointmentAlerts.slice(0, 3).map((alertItem) => (
                            <div 
                                key={alertItem._alertId} 
                                className="bg-white rounded-lg shadow-lg border border-teal-100 p-4 animate-in slide-in-from-top-2 duration-300 max-w-xs"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">New Appointment</p>
                                        <p className="text-sm font-semibold text-slate-900 mt-1.5 truncate">{alertItem.patient_name || 'Patient'}</p>
                                        <p className="text-xs text-slate-600 mt-1">Dr. {alertItem.doctor_name || 'N/A'}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{alertItem.appointment_time || '-'}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAppointmentAlerts((previousAlerts) => previousAlerts.filter((item) => item._alertId !== alertItem._alertId))}
                                        className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

