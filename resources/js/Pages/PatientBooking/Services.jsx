import { Link, Head } from '@inertiajs/react';
import Header from '@/Components/Header';

export default function Services({ hospital_name, contact_phone, contact_email, address }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden">
            <Head title="Our Services | Healing Touch Hospital" />
            <Header />
            
            <section id="services" className="py-16 pt-32">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Medical Services</h1>
                        <p className="text-gray-600 max-w-3xl mx-auto">We offer a comprehensive range of medical services designed to meet the needs of our community with excellence and compassion.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-16 lg:px-10">
                        {/* Sidebar */}
                        <div className="lg:w-1/3">
                            {/* Service List Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-24">
                                <div className="bg-beige-600 p-6">
                                    <h3 className="text-2xl font-bold text-white flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        Our Services
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-1">
                                        {['Multispeciality', 'ICU', 'NICU', 'Ultrasound', 'Neurosurgery', 'X-RAY', 'Pathology', 'Painless Normal Delivery', '24 hrs Delivery Service'].map((service, idx) => (
                                            <li key={idx} className="group">
                                                <a href={`#${service.toLowerCase().replace(/ /g, '-')}`} className="flex items-center p-3 rounded-lg hover:bg-beige-50 transition duration-300">
                                                    <span className="text-beige-600 mr-3">
                                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                                    </span>
                                                    <span className="font-medium group-hover:text-beige-600">{service}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Hours Card */}
                                <div className="mt-8 border-t border-gray-100 pt-6 px-6 pb-6">
                                    <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-beige-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Operating Hours
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-gray-600">Monday - Friday</span>
                                            <span className="font-medium text-beige-600">8:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-gray-600">Saturday</span>
                                            <span className="font-medium text-beige-600">9:00 AM - 4:00 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-gray-600">Sunday</span>
                                            <span className="font-medium text-beige-600">Closed</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 bg-beige-50 rounded-lg p-3">
                                        <p className="text-beige-800 text-sm flex items-center">
                                            <span className="text-red-600 mr-2">🚨</span>
                                            Emergency care available 24/7
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Card */}
                                <div className="mt-4 px-6 pb-6">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h4 className="font-bold text-gray-800 mb-3">Need Help?</h4>
                                        <p className="text-gray-600 text-sm mb-3">Contact us for appointments or questions</p>
                                        <Link href={route('contact.page')} className="bg-beige-600 hover:bg-beige-700 text-white text-center rounded-lg py-2 px-4 block transition duration-300 w-full sm:w-auto">
                                            Call Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Descriptions */}
                        <div className="lg:w-2/3 space-y-8">
                            
                            <div id="multispeciality" className="bg-white rounded-2xl border border-gray-200 overflow-hidden transform transition duration-300 hover:-translate-y-1">
                                <div className="md:flex">
                                    <div className="md:w-1/3 relative overflow-hidden bg-gray-200 min-h-[200px]">
                                        <img src="/images/hospital1.jpg" alt="Multispeciality Care" className="absolute top-0 left-0 h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="md:w-2/3 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Multispeciality Care</h3>
                                        <p className="text-gray-600">Our multispeciality care unit provides expert consultation and treatment across various specialties including cardiology, orthopedics, gynecology.</p>
                                    </div>
                                </div>
                            </div>

                            <div id="icu" className="bg-white rounded-2xl border border-gray-200 overflow-hidden transform transition duration-300 hover:-translate-y-1">
                                <div className="md:flex">
                                    <div className="md:w-1/3 relative overflow-hidden bg-gray-200 min-h-[200px]">
                                        <img src="/images/hospital3.jpg" alt="ICU Services" className="absolute top-0 left-0 h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="md:w-2/3 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">ICU Services</h3>
                                        <p className="text-gray-600">Our ICU provides advanced critical care and monitoring for patients who are critically ill or recovering from surgery.</p>
                                    </div>
                                </div>
                            </div>

                            <div id="nicu" className="bg-white rounded-2xl border border-gray-200 overflow-hidden transform transition duration-300 hover:-translate-y-1">
                                <div className="md:flex">
                                    <div className="md:w-1/3 relative overflow-hidden bg-gray-200 min-h-[200px]">
                                        <img src="/images/hospital4.jpg" alt="NICU Services" className="absolute top-0 left-0 h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="md:w-2/3 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">NICU Services</h3>
                                        <p className="text-gray-600">Our Neonatal Intensive Care Unit (NICU) provides specialized care for premature and critically ill newborns.</p>
                                    </div>
                                </div>
                            </div>

                            <div id="ultrasound" className="bg-white rounded-2xl border border-gray-200 overflow-hidden transform transition duration-300 hover:-translate-y-1">
                                <div className="md:flex">
                                    <div className="md:w-1/3 relative overflow-hidden bg-gray-200 min-h-[200px]">
                                        <img src="/images/hospital5.jpg" alt="Ultrasound Services" className="absolute top-0 left-0 h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="md:w-2/3 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Ultrasound Services</h3>
                                        <p className="text-gray-600">We offer a wide range of ultrasound services to diagnose and monitor various health conditions.</p>
                                    </div>
                                </div>
                            </div>

                            <div id="neurosurgery" className="bg-white rounded-2xl border border-gray-200 overflow-hidden transform transition duration-300 hover:-translate-y-1">
                                <div className="md:flex">
                                    <div className="md:w-1/3 relative overflow-hidden bg-gray-200 min-h-[200px]">
                                        <img src="/images/hospital6.jpg" alt="Neurosurgery" className="absolute top-0 left-0 h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="md:w-2/3 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Neurosurgery</h3>
                                        <p className="text-gray-600">Our neurosurgery department specializes in the diagnosis and surgical treatment of neurological disorders, including brain and spinal surgeries.</p>
                                    </div>
                                </div>
                            </div>

                            <div id="x-ray" className="bg-white rounded-2xl border border-gray-200 overflow-hidden transform transition duration-300 hover:-translate-y-1">
                                <div className="md:flex">
                                    <div className="md:w-1/3 relative overflow-hidden bg-gray-200 min-h-[200px]">
                                        <img src="/images/hospital7.jpg" alt="X-RAY Services" className="absolute top-0 left-0 h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="md:w-2/3 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">X-RAY Services</h3>
                                        <p className="text-gray-600">We provide advanced X-ray imaging services to help diagnose injuries and other medical conditions quickly and accurately.</p>
                                    </div>
                                </div>
                            </div>

                            <div id="pathology" className="bg-white rounded-2xl border border-gray-200 overflow-hidden transform transition duration-300 hover:-translate-y-1">
                                <div className="md:flex">
                                    <div className="md:w-1/3 relative overflow-hidden bg-gray-200 min-h-[200px]">
                                        <img src="/images/hospital8.jpg" alt="Pathology Services" className="absolute top-0 left-0 h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="md:w-2/3 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Pathology Services</h3>
                                        <p className="text-gray-600">Our pathology department offers a wide range of diagnostic tests and services to help diagnose medical conditions accurately and swiftly.</p>
                                    </div>
                                </div>
                            </div>

                            <div id="painless-normal-delivery" className="bg-white rounded-2xl border border-gray-200 overflow-hidden transform transition duration-300 hover:-translate-y-1">
                                <div className="md:flex">
                                    <div className="md:w-1/3 relative overflow-hidden bg-gray-200 min-h-[200px]">
                                        <img src="/images/hospital3.jpg" alt="Painless Normal Delivery" className="absolute top-0 left-0 h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="md:w-2/3 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Painless Normal Delivery</h3>
                                        <p className="text-gray-600">We offer painless normal delivery options, ensuring a comfortable and safe childbirth experience.</p>
                                    </div>
                                </div>
                            </div>

                            <div id="24-hrs-delivery-service" className="bg-white rounded-2xl border border-gray-200 overflow-hidden transform transition duration-300 hover:-translate-y-1">
                                <div className="md:flex">
                                    <div className="md:w-1/3 relative overflow-hidden bg-gray-200 min-h-[200px]">
                                        <img src="/images/hospital5.jpg" alt="24 hrs Delivery Service" className="absolute top-0 left-0 h-full w-full object-cover object-center" />
                                    </div>
                                    <div className="md:w-2/3 p-8">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4">24 hrs Delivery Service</h3>
                                        <p className="text-gray-600">Our delivery service is available 24/7, ensuring you have access to expert care at any time of day or night.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
