import { Link, Head } from '@inertiajs/react';
import Header from '@/Components/Header';

export default function About({ hospital_name, contact_phone, contact_email, address }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden">
            <Head title="About Us | Healing Touch Hospital" />
            <Header />
            
            <section className="bg-white py-16 px-4 md:px-12 mt-10 lg:px-24 pt-32">
                <div className="max-w-6xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">About Healing Touch Hospital, Purnea (Bihar) </h1>
                    <p className="text-lg text-gray-600 mb-12">
                        At Healing Touch Hospital, we are committed to providing compassionate, high-quality healthcare with a focus on patient well-being and comfort.
                    </p>
                </div>

                {/* Mission & Services Section */}
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mb-16 items-center">
                    <div>
                        <img src="/images/heroImageHt.jpg" alt="Healing Touch Hospital" className="rounded-2xl shadow-md w-full" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-gray-600 mb-4">
                            Our mission is to deliver exceptional medical care with a human touch. We aim to create a healing environment where every patient is treated with dignity, respect, and empathy.
                        </p>

                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Services</h2>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            <li>24/7 Emergency Care</li>
                            <li>Advanced Diagnostics & Imaging</li>
                            <li>Specialized Surgical Services</li>
                            <li>Maternity & Childcare</li>
                            <li>Outpatient & Inpatient Services</li>
                            <li>Wellness & Preventive Programs</li>
                        </ul>
                    </div>
                </div>

                {/* Final Call-to-Action */}
                <div className="max-w-6xl mx-auto mt-20 mb-16 text-center">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">Ready to Prioritize Your Health?</h3>
                    <p className="text-gray-600 mb-6">Book an appointment or visit us for compassionate, expert care today.</p>
                    <Link href={route('contact.page')} className="inline-block px-8 py-3 bg-beige-600 text-white font-medium rounded-full shadow hover:bg-beige-700 transition">
                        Contact Us
                    </Link>
                </div>
            </section>
        </div>
    );
}
