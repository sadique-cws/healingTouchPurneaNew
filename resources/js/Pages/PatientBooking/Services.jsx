import { useMemo, useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function Services({ hospital_name, contact_phone, contact_email, address }) {
    const services = [
        {
            id: 'multispeciality',
            name: 'Multispeciality',
            title: 'Multispeciality Care',
            image: '/images/hospital1.jpg',
            description: 'Our multispeciality care unit provides expert consultation and treatment across cardiology, orthopedics, gynecology, and more.'
        },
        {
            id: 'icu',
            name: 'ICU',
            title: 'ICU Services',
            image: '/images/hospital3.jpg',
            description: 'Our ICU provides advanced critical care and continuous monitoring for seriously ill patients and post-surgery recovery.'
        },
        {
            id: 'nicu',
            name: 'NICU',
            title: 'NICU Services',
            image: '/images/hospital4.jpg',
            description: 'Our NICU offers specialized support for premature and critically ill newborns with expert neonatal supervision.'
        },
        {
            id: 'ultrasound',
            name: 'Ultrasound',
            title: 'Ultrasound Services',
            image: '/images/hospital5.jpg',
            description: 'We provide accurate ultrasound diagnostics for timely monitoring and treatment planning.'
        },
        {
            id: 'neurosurgery',
            name: 'Neurosurgery',
            title: 'Neurosurgery',
            image: '/images/hospital6.jpg',
            description: 'Our neurosurgery team handles complex brain and spine procedures with modern surgical care.'
        },
        {
            id: 'x-ray',
            name: 'X-RAY',
            title: 'X-RAY Services',
            image: '/images/hospital7.jpg',
            description: 'Fast and reliable X-ray imaging services for injury assessment and medical diagnosis.'
        },
        {
            id: 'pathology',
            name: 'Pathology',
            title: 'Pathology Services',
            image: '/images/hospital8.jpg',
            description: 'Comprehensive pathology testing with dependable reports for quick clinical decisions.'
        },
        {
            id: 'painless-normal-delivery',
            name: 'Painless Delivery',
            title: 'Painless Normal Delivery',
            image: '/images/hospital3.jpg',
            description: 'We offer painless normal delivery options for a safer, more comfortable childbirth experience.'
        },
        {
            id: '24-hrs-delivery-service',
            name: '24 Hrs Delivery',
            title: '24 hrs Delivery Service',
            image: '/images/hospital5.jpg',
            description: 'Round-the-clock delivery support ensures access to expert maternity care any time.'
        },
    ];

    const [selectedServiceId, setSelectedServiceId] = useState(services[0].id);

    const selectedService = useMemo(
        () => services.find((service) => service.id === selectedServiceId) ?? services[0],
        [selectedServiceId]
    );

    return (
        <div className="public-page min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden pb-24 lg:pb-0 flex flex-col">
            <Head title="Our Services | Healing Touch Hospital" />
            <Header />
            
            <main id="services" className="flex-1 py-8 sm:py-12 pt-24 sm:pt-28 w-full">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
                    <div className="text-center mb-8 sm:mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Medical Services</h1>
                        <p className="text-gray-600 max-w-3xl mx-auto">Choose a service below to instantly see details. Built for fast browsing on mobile like an app.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        <div className="lg:w-2/3 w-full">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <h2 className="text-base sm:text-lg font-bold text-gray-800">Browse Services</h2>
                                    <span className="text-xs text-gray-500">Tap service name</span>
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {services.map((service) => (
                                        <button
                                            key={service.id}
                                            type="button"
                                            onClick={() => setSelectedServiceId(service.id)}
                                            className={`snap-start shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                                                selectedServiceId === service.id
                                                    ? 'bg-beige-600 border-beige-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-beige-50 hover:border-beige-200'
                                            }`}
                                        >
                                            {service.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div id={selectedService.id} className="mt-4 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="relative h-52 sm:h-64 bg-gray-200">
                                    <img src={selectedService.image} alt={selectedService.title} className="absolute inset-0 h-full w-full object-cover object-center" />
                                </div>
                                <div className="p-4 sm:p-6">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{selectedService.title}</h3>
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{selectedService.description}</p>
                                </div>
                            </div>
                        </div>

                        <aside className="lg:w-1/3 w-full space-y-4">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
                                <h4 className="font-bold text-base text-gray-800 mb-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-beige-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Operating Hours
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Monday - Friday</span>
                                        <span className="font-medium text-beige-600">8:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Saturday</span>
                                        <span className="font-medium text-beige-600">9:00 AM - 4:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Sunday</span>
                                        <span className="font-medium text-beige-600">Closed</span>
                                    </div>
                                </div>
                                <div className="mt-3 bg-beige-50 border border-beige-100 rounded-lg p-2.5">
                                    <p className="text-beige-800 text-xs sm:text-sm flex items-center">
                                        <span className="text-red-600 mr-2">🚨</span>
                                        Emergency care available 24/7
                                    </p>
                                </div>
                            </div>

                            <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 sticky top-24">
                                <h4 className="font-bold text-gray-800 mb-2">Need Help?</h4>
                                <p className="text-gray-600 text-sm mb-3">Contact us for appointments or questions.</p>
                                <Link href={route('contact.page')} className="bg-beige-600 hover:bg-beige-700 text-white text-center rounded-lg border border-beige-600 py-2.5 px-4 block transition-colors duration-150 w-full">
                                    Call Now
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <div className="lg:hidden fixed bottom-20 right-4 z-40">
                <Link href={route('contact.page')} className="inline-flex items-center gap-2 bg-beige-600 hover:bg-beige-700 text-white rounded-full border border-beige-600 py-3 px-4 shadow-lg transition-colors duration-150">
                    <span className="text-base">📞</span>
                    <span className="text-sm font-semibold">Need Help? Call Now</span>
                </Link>
            </div>

            <PublicFooter
                hospitalName={hospital_name}
                address={address}
                contact_phone={contact_phone}
                contact_email={contact_email}
            />
        </div>
    );
}
