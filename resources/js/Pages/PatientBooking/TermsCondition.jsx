import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function TermsCondition() {
    return (
        <div className="public-page min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden pb-10 flex flex-col">
            <Head title="Terms & Conditions - Healing Touch" />
            <Header />

            <div className="bg-slate-900 mt-16 pt-16 pb-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-800/[0.2] bg-[size:20px_20px]"></div>
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-900/50 to-transparent"></div>
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">Terms & Conditions</h1>
                    <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto mb-2">Please read these terms carefully before booking your appointment.</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Effective Date: April 23, 2026</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 w-full -mt-16 relative z-20 flex-1">
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col gap-8">
                    
                    <section>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-3">
                            1. Acceptance of Terms
                        </h2>
                        <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
                            <p>By accessing this booking portal and scheduling an appointment at Healing Touch, you agree to be bound by these Terms and Conditions. You agree to provide accurate and complete information, including a valid phone number where you can be reached prior to your appointment.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-3">
                            2. Appointment Booking rules
                        </h2>
                        <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
                            <p><strong>Next-Day Appointments:</strong> Online bookings made today are exclusively for the following day. An appointment booked after 12:00 AM (midnight) will be considered for the respective day's clinic schedule.</p>
                            <p><strong>Contact Validity:</strong> You must furnish your own phone number during registration. Healing Touch hospital is not responsible for booking failures, miscommunications, or cancellations if a third-party or invalid number is provided.</p>
                            <p><strong>Slot Availability:</strong> While we strive to adhere strictly to your selected time slot, appointment timings are approximate. Wait times may fluctuate based on emergency clinical requirements and the availability of the consulting doctor.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-3">
                            3. Payment & Fees
                        </h2>
                        <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
                            <p>All online bookings currently utilize a <strong>"Pay at Hospital"</strong> model. You are not required to make any online digital payments to secure a slot. The final consultation fee, as shown during the booking process, is to be paid physically at the reception desk upon your arrival.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-3">
                            4. Hospital Rights & Cancellations
                        </h2>
                        <div className="text-gray-600 text-sm md:text-base leading-relaxed space-y-4">
                            <p>Healing Touch reserves the right to cancel or reschedule appointments without prior notice due to unforeseen medical emergencies, doctor unavailability, or technical issues with the booking system.</p>
                            <p>If you are unable to attend your scheduled appointment, we request that you proactively cancel it by contacting our support desk or using the "Check Booking" portal to free the slot for other patients in need.</p>
                        </div>
                    </section>

                    <div className="mt-4 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                        <p className="text-sm md:text-base font-bold text-amber-800">
                            By continuing to use our services, you acknowledge that you have read, understood, and agreed to these terms. For any technical support, please dial <strong>96088 40667</strong>.
                        </p>
                    </div>

                </div>
            </div>

            <div className="h-16 w-full"></div>

            <PublicFooter />
        </div>
    );
}
