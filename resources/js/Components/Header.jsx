import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Header({ hospitalName = 'Healing Touch Hospital' }) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

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
        { name: 'Gallery', href: '#' }, // Assuming gallery link
        { name: 'Contact', href: route('contact.page') },
    ];

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-4' : 'bg-white/80 backdrop-blur-sm py-5'}`}>
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo Area */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="overflow-hidden rounded-xl h-11 w-11 flex items-center justify-center transition-all duration-500 bg-teal-50 border border-teal-100 group-hover:bg-teal-600 shadow-sm">
                                <span className="font-black text-teal-600 text-xl group-hover:text-white transition-colors">H</span>
                            </div>
                            <div>
                                <h1 className="font-black text-xl text-gray-800 tracking-tight leading-none group-hover:text-teal-600 transition-colors">
                                    <span className="text-teal-600">{firstWord}</span> {restOfName}
                                </h1>
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Hospital (Purnea)</p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-2">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href} 
                                className="px-4 py-2 rounded-xl text-[14px] font-bold text-gray-600 hover:text-teal-600 hover:bg-teal-50/50 transition-all duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Appointment Button */}
                    <div className="hidden md:block">
                        <Link 
                            href={route('book.appointment')} 
                            className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-7 py-3 rounded-xl transition-all duration-300 shadow-[0_4px_14px_0_rgba(13,148,136,0.39)] hover:shadow-teal-700/40 font-black text-sm tracking-wide uppercase flex items-center gap-2 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                            Book Appointment
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="lg:hidden flex items-center">
                        <button 
                            type="button" 
                            className="p-2 rounded-xl bg-gray-50 text-gray-500 hover:text-teal-600 transition-colors" 
                            onClick={() => setOpen(!open)}
                        >
                            {!open ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="lg:hidden bg-white/95 backdrop-blur-md shadow-2xl border-t border-gray-100 absolute left-0 right-0 overflow-hidden animate-slideDown">
                    <nav className="container mx-auto px-6 py-6 flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href} 
                                className="py-4 px-5 rounded-2xl text-gray-700 font-black tracking-wide hover:bg-teal-50 hover:text-teal-600 transition-all flex items-center justify-between group" 
                                onClick={() => setOpen(false)}
                            >
                                {link.name}
                                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        ))}
                        <Link 
                            href={route('book.appointment')} 
                            className="mt-4 bg-teal-600 text-white p-5 rounded-2xl font-black text-center shadow-lg active:scale-95 transition-transform uppercase tracking-widest" 
                            onClick={() => setOpen(false)}
                        >
                            Book Appointment
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
