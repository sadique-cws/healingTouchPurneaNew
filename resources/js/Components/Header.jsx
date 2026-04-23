import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Header({ hospitalName = 'Healing Touch Hospital', hideMobileTabs = false }) {
    const [scrolled, setScrolled] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const hospitalNameParts = hospitalName.split(' ');
    const firstWord = hospitalNameParts[0];
    const restOfName = hospitalNameParts.slice(1).join(' ');

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: route('services.page') },
        { name: 'Our Doctors', href: route('our.doctors') },
        { name: 'About Us', href: route('about.page') },
        { name: 'Gallery', href: route('gallery.page') },
        { name: 'Careers', href: route('careers.page') },
        { name: 'Contact', href: route('contact.page') },
    ];

    const mobileTabs = [
        {
            name: 'Home',
            href: '/',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10.5L12 3l9 7.5M5.25 9.75V21h13.5V9.75" />
                </svg>
            )
        },
        {
            name: 'Search',
            href: route('our.doctors'),
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            name: 'Book',
            href: route('book.appointment'),
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            name: 'Services',
            href: route('services.page'),
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            )
        },
        {
            name: 'Profile',
            href: route('account.page'),
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
    ];

    const normalizePath = (href) => {
        if (!href) return '/';
        if (href.startsWith('http')) {
            try {
                return new URL(href).pathname;
            } catch {
                return href;
            }
        }
        return href;
    };

    return (
        <>
            <header className={`fixed w-full top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 py-3' : 'bg-white/90 backdrop-blur-sm border-b border-gray-100 py-4'}`}>
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-3 group">
                                <ApplicationLogo className="h-10 w-10 shrink-0 text-beige-700 transition-transform duration-150 group-hover:scale-105" />
                                <div className="leading-none">
                                    <h1 className="font-black text-lg sm:text-xl text-gray-800 tracking-tight leading-none group-hover:text-beige-700 transition-colors">
                                        <span className="text-beige-700">{firstWord}</span> {restOfName}
                                    </h1>
                                    <p className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Hospital (Purnea)</p>
                                </div>
                            </Link>
                        </div>

                        <nav className="hidden lg:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    href={link.href} 
                                    className="px-3 py-2 rounded-lg text-[13px] font-semibold text-gray-600 hover:text-beige-700 hover:bg-beige-50/60 transition-colors duration-150"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="hidden lg:block">
                            <Link 
                                href={route('book.appointment')} 
                                className="bg-beige-600 hover:bg-beige-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-150 border border-beige-600 font-bold text-[11px] tracking-wide uppercase flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                                Book Appointment
                            </Link>
                        </div>

                        <div className="lg:hidden">
                            <Link
                                href={route('booking.help')}
                                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-beige-700 hover:border-beige-200"
                                aria-label="Booking Help"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.25 9a3.75 3.75 0 117.5 0c0 1.35-.74 2.22-1.95 2.88-1.02.55-1.8 1.05-1.8 2.12v.25M12 17h.01" />
                                </svg>
                            </Link>
                        </div>

                    </div>
                </div>
            </header>

            {!hideMobileTabs && <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.03)] border-t border-gray-100 pb-safe">
                <div className="grid grid-cols-5 gap-1 px-2.5 py-1.5 pb-2">
                        {mobileTabs.map((tab) => {
                            const tabPath = normalizePath(tab.href);
                            const currentPath = normalizePath(url);
                            const isActive = currentPath === tabPath || (tabPath !== '/' && currentPath.startsWith(tabPath));

                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`flex flex-col items-center justify-center rounded-lg py-1.5 transition-colors duration-150 ${isActive ? 'text-beige-700' : 'text-gray-500 hover:text-beige-700'}`}
                                >
                                    <span className="leading-none">{tab.icon}</span>
                                    <span className="text-[10px] font-bold mt-1 truncate">{tab.name}</span>
                                </Link>
                            );
                        })}
                </div>
            </div>}
        </>
    );
}
