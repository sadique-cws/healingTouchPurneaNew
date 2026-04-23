import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function PrivacyPolicy() {
    return (
        <div className="public-page min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden pb-10 flex flex-col">
            <Head title="Privacy Policy - Healing Touch" />
            <Header />

            <div className="bg-slate-900 mt-16 pt-16 pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[size:20px_20px]"></div>
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-900/50 to-transparent"></div>
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto mb-2">We value your trust. This policy explains how we collect, use, and protect your personal information.</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Last updated: April 23, 2026</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 w-full -mt-16 relative z-20 flex-1">
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col gap-8">
                    
                    <section>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-beige-50 text-beige-600 flex items-center justify-center text-lg">📋</span>
                            Data Collection & Usage
                        </h2>
                        <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
                            <p>At Healing Touch, we collect only the necessary patient and appointment details to provide safe, effective clinical services. This includes personal identification information (Name, Age, Gender), contact details (Phone Number, Address), and medical query history relevant to your visit.</p>
                            <p>We use this data to schedule your appointments, notify you via SMS/WhatsApp regarding booking status, and ensure that our medical staff has accurate records before your consultation. We guarantee that your personal data is handled securely and used exclusively for your healthcare and hospital operational procedures.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-beige-50 text-beige-600 flex items-center justify-center text-lg">⏳</span>
                            Data Retention
                        </h2>
                        <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
                            <p>We retain your personal data and appointment information only for as long as is necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, medical, accounting, or reporting requirements standard to Indian healthcare regulations.</p>
                            <p>Typically, patient booking records are retained to maintain continuity of care. Once the retention period expires or if you formally request data deletion, your personal data will be securely deleted or completely anonymized, provided there are no pending legal or statutory obligations requiring us to retain it.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-beige-50 text-beige-600 flex items-center justify-center text-lg">🛡️</span>
                            Data Security
                        </h2>
                        <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
                            <p>Healing Touch implements robust technical and administrative security measures to protect your personal information against unauthorized access, disclosure, alteration, or destruction. We do not sell, rent, or lease your personal data to any third-party marketing or advertising agencies.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-beige-50 text-beige-600 flex items-center justify-center text-lg">📞</span>
                            Contact Us
                        </h2>
                        <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
                            <p>If you have any questions about this Privacy Policy or how we handle your data, please contact our administrative desk or call us directly. We are committed to transparency and will address your concerns promptly.</p>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 inline-block">
                                <p className="font-bold text-gray-900">Healing Touch Hospital</p>
                                <p>Linebazar, Purnea, Bihar</p>
                                <p className="font-semibold text-beige-600 mt-2">Phone: 96088 40667</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
            
            <div className="h-16 w-full"></div>

            <PublicFooter />
        </div>
    );
}
