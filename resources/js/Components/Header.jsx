import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Header({ hospitalName = 'Healing Touch Hospital' }) {
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
                                <div className="overflow-hidden rounded-lg h-10 w-10 flex items-center justify-center bg-beige-50 border border-beige-200 transition-colors duration-150 group-hover:bg-beige-100">
                                    <span className="font-black text-beige-700 text-lg">H</span>
                                </div>
                                <div>
                                    <h1 className="font-black text-xl text-gray-800 tracking-tight leading-none group-hover:text-beige-700 transition-colors">
                                        <span className="text-beige-700">{firstWord}</span> {restOfName}
                                    </h1>
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Hospital (Purnea)</p>
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

                    </div>
                </div>
            </header>

            <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
                <div className="grid grid-cols-5 gap-1 px-3 py-2.5">
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
            </div>
        </>
    );
}
