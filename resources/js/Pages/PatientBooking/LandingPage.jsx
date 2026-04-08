import { Link, Head } from '@inertiajs/react';
import Header from '@/Components/Header';

export default function LandingPage({ hotelName, address, contact_phone, whatsapp_number, contact_email, doctors }) {
    return (
        <div className="min-h-screen bg-gradient-to-r from-beige-50 to-beige-100 font-sans text-gray-900 antialiased overflow-x-hidden">
            <Head title="Healing Touch Hospital | Online Appointment Booking" />

            {/* Use the new full Header component */}
            <Header hospitalName={hotelName} />

            {/* Hero Section */}
            <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 bg-gradient-to-r from-beige-50 to-beige-100 overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-5"></div>
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10 w-full max-w-7xl">
                    <div className="md:w-1/2 mb-10 md:mb-0 px-6 animate-fadeIn">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 leading-tight mb-4">
                            Compassionate Healthcare <span className="text-beige-700 block mt-1">For Your Family</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Experience world-class medical care with our team of dedicated specialists and
                            patient-centered approach. Your health is our priority.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href={route('book.appointment')} className="group relative bg-beige-600 hover:bg-beige-700 text-white px-8 py-3.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-medium flex items-center justify-center">
                                <span>Book Appointment</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                {/* Ping Animation */}
                                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-beige-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-beige-500"></span>
                                </span>
                            </Link>
                        </div>
                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-6 mt-10">
                            <div className="flex items-center">
                                <div className="bg-beige-100 p-3 rounded-full mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-beige-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-2xl text-gray-800">10+</p>
                                    <p className="text-sm text-gray-600">Years of Experience</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="bg-beige-100 p-3 rounded-full mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-beige-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-2xl text-gray-800">5000+</p>
                                    <p className="text-sm text-gray-600">Successful Treatments</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative animate-slideInRight px-6 pt-10">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-beige-200 to-beige-300 rounded-full blur-lg opacity-70"></div>
                            <img src="https://ik.imagekit.io/healingtouchpurnea/healingtouch/landingPageImages/heroImageHt.jpg?updatedAt=1746616206447" alt="Doctor with patient" className="w-full h-auto rounded-2xl shadow-2xl relative" />
                        </div>
                        {/* Floating Elements */}
                        <div className="absolute top-10 -left-6 bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3 animate-float">
                            <div className="bg-beige-100 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-beige-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Safe & Quality Care</p>
                                <p className="text-xs text-gray-500">Advanced protocols</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Facilities Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="text-beige-600 font-semibold text-sm uppercase tracking-wider">World-Class Medical Care</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-beige-900 mt-2 mb-4">Our <span className="text-beige-600">Facilities</span></h2>
                        <div className="w-24 h-1 bg-beige-400 mx-auto mb-6"></div>
                        <p className="max-w-2xl mx-auto text-gray-600">Experience healthcare excellence with our state-of-the-art facilities and compassionate medical professionals.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group hover:-translate-y-1">
                            <div className="bg-beige-100 p-4 rounded-full inline-block mb-6 group-hover:bg-beige-200 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-beige-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Expert Doctors</h3>
                            <p className="text-gray-600 leading-relaxed">Board-certified specialists with years of experience dedicated to providing compassionate patient care.</p>
                            <div className="mt-6 flex items-center text-beige-600 font-medium">
                                <Link href={route('our.doctors')}><span>Learn more</span></Link>  
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group hover:-translate-y-1">
                            <div className="bg-beige-100 p-4 rounded-full inline-block mb-6 group-hover:bg-beige-200 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-beige-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Advanced Facilities</h3>
                            <p className="text-gray-600 leading-relaxed">State-of-the-art medical equipment and modern healing environments designed for optimal patient recovery.</p>
                            <div className="mt-6 flex items-center text-beige-600 font-medium">
                                <Link href={route('services.page')}><span>Learn more</span></Link>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 group hover:-translate-y-1">
                            <div className="bg-beige-100 p-4 rounded-full inline-block mb-6 group-hover:bg-beige-200 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-beige-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Patient-Centered Care</h3>
                            <p className="text-gray-600 leading-relaxed">Personalized treatment plans focused on your health and comfort, putting your needs at the center of everything we do.</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Services Highlights Section */}
            <section className="py-20 bg-white border-t border-gray-50">
                <div className="container mx-auto px-4 max-w-7xl text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-12">Our Major <span className="text-beige-600">Specialities</span></h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[
                            { icon: '🏥', name: 'ICU / NICU' },
                            { icon: '🧠', name: 'Neurosurgery' },
                            { icon: '🩺', name: 'Multispeciality' },
                            { icon: '🤰', name: 'Maternity' },
                            { icon: '🧪', name: 'Pathology' },
                            { icon: '🦴', name: 'Orthopedics' }
                        ].map((s, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-beige-50 hover:border-beige-200 transition-all cursor-default group">
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{s.icon}</div>
                                <p className="font-bold text-gray-700 text-sm">{s.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Doctors Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="text-beige-600 font-semibold text-sm uppercase tracking-wider">Our Trusted Specialists</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">Meet Our <span className="text-beige-600">Experts</span></h2>
                        <div className="w-24 h-1 bg-beige-600 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {doctors && doctors.length > 0 ? doctors.map((user) => (
                            <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                <div className="p-6 text-center">
                                    <div className="relative inline-block mb-4">
                                        <div className="absolute inset-0 bg-beige-600 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <img 
                                            src={user.doctor?.image || '/images/default.jpg'} 
                                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md relative z-10 mx-auto"
                                            alt={user.name}
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Dr. {user.name}</h3>
                                    <p className="text-beige-600 text-sm font-medium mb-4">{user.doctor?.department?.name}</p>
                                    <Link 
                                        href={route('book.appointment', { slug: user.doctor?.slug })}
                                        className="inline-block w-full py-2 bg-beige-50 text-beige-700 font-bold rounded-lg border border-beige-100 hover:bg-beige-600 hover:text-white transition-colors"
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
                    
                    <div className="mt-12 text-center">
                        <Link href={route('our.doctors')} className="text-beige-600 font-bold hover:text-beige-800 flex items-center justify-center gap-2">
                            View All Doctors <span>→</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
