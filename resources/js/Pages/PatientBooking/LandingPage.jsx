import { Link, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function LandingPage({ hotelName, address, contact_phone, whatsapp_number, contact_email, doctors }) {
    const whatsappNumber = (whatsapp_number || contact_phone || '').replace(/[^0-9]/g, '');
    const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : null;
    const heroSlides = [
        {
            src: 'https://ik.imagekit.io/healingtouchpurnea/healingtouch/landingPageImages/heroImageHt.jpg?updatedAt=1746616206447',
            label: 'Family Care',
        },
        {
            src: '/images/hospital1.jpg',
            label: 'Modern Facility',
        },
        {
            src: '/images/hospital4.jpg',
            label: 'Critical Care',
        },
    ];
    const [activeHeroSlide, setActiveHeroSlide] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
        }, 3500);

        return () => window.clearInterval(timer);
    }, [heroSlides.length]);

    return (
        <div className="public-page min-h-screen bg-[#f5f7fb] md:bg-[#f8f9ff] font-sans text-gray-900 antialiased overflow-x-hidden pb-16 lg:pb-0 flex flex-col">
            <Head title="Healing Touch Hospital | Online Appointment Booking" />

            {/* Use the new full Header component */}
            <Header hospitalName={hotelName} />

            {/* Hero Section */}
            <section className="relative pt-20 pb-4 sm:pb-12 md:pt-28 md:pb-16 bg-[#f5f7fb] md:bg-beige-50 overflow-hidden md:border-b md:border-gray-200">
                <div className="container mx-auto px-3 sm:px-4 flex flex-col md:flex-row items-stretch md:items-center relative z-10 w-full max-w-7xl gap-3 md:gap-0">
                    <div className="md:w-1/2 mb-0 md:mb-0 px-0 md:px-4 order-2 md:order-1">
                        <div className="bg-transparent border-0 rounded-none p-0 md:bg-transparent md:border-0 md:rounded-none md:p-0">
                        <div className="inline-flex md:hidden items-center gap-2 rounded-full border border-beige-100 bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-beige-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                            Open for appointments
                        </div>
                        <h1 className="mt-2 md:mt-0 text-[1.65rem] sm:text-4xl md:text-5xl font-bold text-neutral-800 leading-tight mb-2 md:mb-3">
                            Compassionate Healthcare <span className="text-beige-700 block mt-1">For Your Family</span>
                        </h1>
                        <p className="text-[13px] sm:text-lg text-gray-600 mb-3 sm:mb-6 leading-relaxed max-w-xl">
                            Experience world-class medical care with our team of dedicated specialists and
                            patient-centered approach. Your health is our priority.
                        </p>
                        <div className="hidden md:flex flex-col sm:flex-row gap-2.5">
                            <Link href={route('book.appointment')} className="bg-beige-600 hover:bg-beige-700 text-white px-5 py-3 rounded-xl transition-colors duration-150 border border-beige-600 text-sm sm:text-base font-semibold flex items-center justify-center">
                                <span>Book Appointment</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <Link href={route('our.doctors')} className="bg-white text-beige-700 px-5 py-3 rounded-xl border border-beige-200 text-sm sm:text-base font-semibold flex items-center justify-center hover:bg-beige-50">
                                Browse Doctors
                            </Link>
                        </div>
                        <div className="md:hidden grid grid-cols-[1fr,auto] gap-2 mt-3">
                            <Link href={route('book.appointment')} className="rounded-xl border border-beige-600 bg-beige-600 px-4 py-3 text-sm font-black text-white shadow-sm flex items-center justify-center gap-2">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M5 11h14M6.75 21h10.5A2.25 2.25 0 0019.5 18.75V6.75A2.25 2.25 0 0017.25 4.5H6.75A2.25 2.25 0 004.5 6.75v12A2.25 2.25 0 006.75 21z" />
                                </svg>
                                Book Appointment
                            </Link>
                            <Link href={route('manage.appointments')} className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-xs font-black text-gray-700 shadow-sm flex items-center justify-center">
                                Manage
                            </Link>
                        </div>
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-2 mt-3 sm:mt-6 max-w-sm">
                            <div className="flex items-center bg-white md:bg-beige-50 rounded-xl border border-gray-200 md:border-beige-100 p-2.5 shadow-sm md:shadow-none">
                                <div className="bg-beige-100 p-2 rounded-lg mr-2.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-beige-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800 leading-none">10+</p>
                                    <p className="text-[11px] text-gray-600">Years Experience</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white md:bg-beige-50 rounded-xl border border-gray-200 md:border-beige-100 p-2.5 shadow-sm md:shadow-none">
                                <div className="bg-beige-100 p-2 rounded-lg mr-2.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-beige-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800 leading-none">5000+</p>
                                    <p className="text-[11px] text-gray-600">Treatments</p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative px-0 md:px-4 pt-0 md:pt-0 order-1 md:order-2">
                        <div className="relative h-[235px] sm:h-[320px] md:h-auto overflow-hidden rounded-2xl border border-gray-200 shadow-sm md:shadow-none bg-gray-200">
                            {heroSlides.map((slide, index) => (
                                <img
                                    key={slide.src}
                                    src={slide.src}
                                    alt={slide.label}
                                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 md:relative md:h-auto ${activeHeroSlide === index ? 'opacity-100' : 'opacity-0 md:opacity-100'} ${index > 0 ? 'md:hidden' : ''}`}
                                />
                            ))}
                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/55 to-transparent p-3 md:hidden">
                                <div className="text-white">
                                    <p className="text-xs font-black uppercase tracking-[0.16em] opacity-80">Healing Touch</p>
                                    <p className="text-base font-black">{heroSlides[activeHeroSlide].label}</p>
                                </div>
                                <div className="flex gap-1.5">
                                    {heroSlides.map((slide, index) => (
                                        <button
                                            key={slide.label}
                                            type="button"
                                            onClick={() => setActiveHeroSlide(index)}
                                            className={`h-1.5 rounded-full transition-all ${activeHeroSlide === index ? 'w-5 bg-white' : 'w-1.5 bg-white/60'}`}
                                            aria-label={`Show ${slide.label}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-3 left-3 md:-bottom-4 md:-left-4 bg-white p-2.5 rounded-lg border border-gray-200 flex items-center space-x-2 shadow-sm md:shadow-none">
                            <div className="bg-beige-100 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-beige-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Safe & Quality Care</p>
                                <p className="text-xs text-gray-500">Advanced protocols</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Doctors Section */}
            <section className="py-6 md:py-12 bg-gray-50">
                <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
                    <div className="mb-4 md:mb-10 md:text-center flex md:block items-end justify-between gap-3">
                        <div>
                            <span className="text-beige-600 font-semibold text-[11px] md:text-sm uppercase tracking-wider">Our Trusted Specialists</span>
                            <h2 className="text-xl md:text-4xl font-bold text-gray-800 mt-1 md:mt-2 md:mb-4">Meet Our <span className="text-beige-600">Experts</span></h2>
                        </div>
                        <Link href={route('our.doctors')} className="md:hidden shrink-0 text-xs font-black text-beige-700">View all</Link>
                        <div className="hidden md:block w-24 h-1 bg-beige-600 mx-auto"></div>
                    </div>

                    <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 overflow-x-auto md:overflow-visible no-scrollbar snap-x">
                        {doctors && doctors.length > 0 ? doctors.map((user) => (
                            <div key={user.id} className="bg-white rounded-xl md:rounded-lg overflow-hidden h-full flex flex-col border border-gray-200 min-w-[82%] sm:min-w-[48%] md:min-w-0 snap-start shadow-sm md:shadow-none">
                                <div className="p-3 md:p-4 flex-grow">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border border-beige-200"
                                                src={user.doctor?.image || '/images/default.jpg'}
                                                alt={`Dr. ${user.name}`}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base md:text-lg font-bold text-gray-800 truncate">Dr. {user.name}</h3>
                                            <p className="text-xs md:text-sm font-medium text-beige-600 truncate">{user.doctor?.department?.name}</p>
                                            <p className="text-xs md:text-sm font-medium text-gray-600 line-clamp-1">
                                                {Array.isArray(user.doctor?.qualification) ? user.doctor.qualification.join(', ') : user.doctor?.qualification || '-'}
                                            </p>
                                            <p className="font-medium text-xs line-clamp-1 text-gray-500 mt-1">
                                                {Array.isArray(user.doctor?.available_days) ? user.doctor.available_days.join(', ') : '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 md:mt-5 flex items-center text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-4 h-4" fill="#906A39" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-3 md:px-4 py-3 border-t border-gray-200 mt-auto flex gap-2">
                                    <Link
                                        href={route('doctors.detail', user.doctor?.slug)}
                                        className="flex-1 text-center py-2 rounded-md border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-white"
                                    >
                                        View Details
                                    </Link>
                                    <Link
                                        href={route('book.appointment', { slug: user.doctor?.slug })}
                                        className="flex-1 text-center py-2 rounded-md bg-beige-600 text-white text-sm font-semibold hover:bg-beige-700 border border-beige-600"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center text-gray-500 py-10">
                                No doctors available at the moment.
                            </div>
                        )}
                    </div>

                    <div className="hidden md:block mt-12 text-center">
                        <Link href={route('our.doctors')} className="text-beige-600 font-bold hover:text-beige-800 flex items-center justify-center gap-2">
                            View All Doctors <span>→</span>
                        </Link>
                    </div>
                </div>
            </section>


            {/* Facilities Section */}
            <section className="py-6 md:py-10 bg-white">
                <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
                    <div className="mb-4 md:mb-12 md:text-center">
                        <span className="text-beige-600 font-semibold text-[11px] md:text-sm uppercase tracking-wider">World-Class Medical Care</span>
                        <h2 className="text-xl md:text-4xl font-bold text-beige-900 mt-1 md:mt-2 md:mb-4">Our <span className="text-beige-600">Facilities</span></h2>
                        <div className="hidden md:block w-24 h-1 bg-beige-400 mx-auto mb-6"></div>
                        <p className="max-w-2xl md:mx-auto text-xs md:text-base text-gray-600">Experience healthcare excellence with our state-of-the-art facilities and compassionate medical professionals.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
                        <div className="hidden md:block bg-gray-50 md:bg-white p-4 md:p-6 rounded-xl md:rounded-lg border border-gray-200 group">
                            <div className="bg-beige-100 p-2.5 md:p-3 rounded-lg inline-block mb-3 md:mb-4 group-hover:bg-beige-200 transition-colors duration-150">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-10 md:w-10 text-beige-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2 md:mb-3">Expert Doctors</h3>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed">Board-certified specialists with years of experience dedicated to providing compassionate patient care.</p>
                            <div className="mt-4 flex items-center text-beige-600 font-medium">
                                <Link href={route('our.doctors')}><span>Learn more</span></Link>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div className="bg-gray-50 md:bg-white p-4 md:p-6 rounded-xl md:rounded-lg border border-gray-200 group">
                            <div className="bg-beige-100 p-2.5 md:p-3 rounded-lg inline-block mb-3 md:mb-4 group-hover:bg-beige-200 transition-colors duration-150">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 md:h-10 md:w-10 text-beige-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2 md:mb-3">Advanced Facilities</h3>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed">State-of-the-art medical equipment and modern healing environments designed for optimal patient recovery.</p>
                            <div className="mt-4 flex items-center text-beige-600 font-medium">
                                <Link href={route('services.page')}><span>Learn more</span></Link>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div className="bg-gray-50 md:bg-white p-4 md:p-6 rounded-xl md:rounded-lg border border-gray-200 group">
                            <div className="bg-beige-100 p-2.5 md:p-3 rounded-lg inline-block mb-3 md:mb-4 group-hover:bg-beige-200 transition-colors duration-150">
                                <svg xmlns="http://www.w3.org/200/svg" className="h-7 w-7 md:h-10 md:w-10 text-beige-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-base md:text-xl font-bold text-gray-800 mb-2 md:mb-3">Patient-Centered Care</h3>
                            <p className="text-sm md:text-base text-gray-600 leading-relaxed">Personalized treatment plans focused on your health and comfort, putting your needs at the center of everything we do.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section id="about" className="py-6 md:py-10 bg-beige-50 border-y border-gray-200">
                <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
                    <div className="mb-4 md:mb-12 md:text-center">
                        <span className="text-beige-600 font-semibold text-[11px] md:text-sm uppercase tracking-wider">Our Story</span>
                        <h2 className="text-xl md:text-4xl font-bold text-beige-900 mt-1 md:mt-2 md:mb-4">About <span className="text-beige-600">{hotelName}</span></h2>
                        <div className="hidden md:block w-24 h-1 bg-beige-400 mx-auto mb-6"></div>
                        <p className="text-xs md:text-base text-gray-600 max-w-3xl md:mx-auto">
                            Founded with a mission to provide accessible and exceptional healthcare to our community, serving with compassion since 1995.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <div className="md:w-1/2">
                            <div className="relative">
                                <img src="https://ik.imagekit.io/healingtouchpurnea/healingtouch/landingPageImages/hospital1.jpg?updatedAt=1746616525877" alt="Healing Touch Hospital Building" className="w-full h-[190px] md:h-auto object-cover rounded-xl md:rounded-lg border border-gray-200" />
                                <div className="absolute -bottom-3 right-3 md:-bottom-4 md:-right-4 bg-white py-2 px-3 md:px-4 rounded-lg border border-gray-200 shadow-sm md:shadow-none">
                                    <p className="text-gray-800 font-bold text-xs md:text-base">25+ Years of Excellence</p>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 mt-2 md:mt-0">
                            <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-6">Our Mission</h3>
                            <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-8 leading-relaxed">
                                At {hotelName}, our mission is to enhance the health and wellbeing of the communities we serve by providing patient-centered care that is compassionate, accessible, and of the highest quality.
                            </p>

                            <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-6">Our Values</h3>
                            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 text-beige-700">
                                {['Excellence', 'Compassion', 'Innovation', 'Integrity'].map((value) => (
                                    <li key={value} className="flex items-start bg-white p-2.5 md:p-3 rounded-lg border border-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-beige-600 mr-2 md:mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-xs md:text-base"><span className="font-bold text-gray-800">{value}</span><span className="hidden md:inline text-gray-700">: Delivering trusted, patient-first healthcare.</span></span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>


            <PublicFooter
                hospitalName={hotelName}
                address={address}
                contact_phone={contact_phone}
                contact_email={contact_email}
            />

            {whatsappHref && (
                <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed right-4 bottom-[4.5rem] lg:bottom-6 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white border border-green-500"
                    aria-label="Chat on WhatsApp"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                    </svg>
                </a>
            )}

           
        </div>
    );
}
