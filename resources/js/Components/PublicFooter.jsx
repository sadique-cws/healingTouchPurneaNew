import { Link, usePage } from '@inertiajs/react';

export default function PublicFooter({
    hospitalName: hospitalNameProp,
    address: addressProp,
    contact_phone: contactPhoneProp,
    contact_email: contactEmailProp,
}) {
    const page = usePage();
    const props = (page && page.props) || {};

    const hospitalName = hospitalNameProp || props.hospital_name || props.hotelName || 'Healing Touch Hospital';
    const address = addressProp || props.address || props.settings?.address || 'Purnea, Bihar';
    const contact_phone = contactPhoneProp || props.contact_phone || props.contactPhone || props.settings?.contact_phone || '-';
    const contact_email = contactEmailProp || props.contact_email || props.contactEmail || props.settings?.contact_email || '-';

    const whatsapp = props.whatsapp_number || props.whatsapp || props.settings?.whatsapp_number || '';
    const whatsappHref = whatsapp ? `https://wa.me/${(whatsapp || '').replace(/[^0-9]/g, '')}` : null;

    return (
        <footer className="mt-auto bg-white border-t border-gray-200 text-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{hospitalName}</h3>
                        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                            Compassionate and accessible healthcare with trusted specialists and modern facilities.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <Link href="/" className="text-gray-600 hover:text-beige-700 transition-colors">Home</Link>
                            <Link href={route('our.doctors')} className="text-gray-600 hover:text-beige-700 transition-colors">Doctors</Link>
                            <Link href={route('services.page')} className="text-gray-600 hover:text-beige-700 transition-colors">Services</Link>
                            <Link href={route('book.appointment')} className="text-gray-600 hover:text-beige-700 transition-colors">Book Appointment</Link>
                            <Link href={route('gallery.page')} className="text-gray-600 hover:text-beige-700 transition-colors">Gallery</Link>
                            <Link href={route('contact.page')} className="text-gray-600 hover:text-beige-700 transition-colors">Contact</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Login Panels</h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <Link href={route('login')} className="text-gray-600 hover:text-beige-700 transition-colors">Patient Login</Link>
                            <Link href={route('admin.login')} className="text-gray-600 hover:text-beige-700 transition-colors">Admin Login</Link>
                            <Link href={route('doctor.login')} className="text-gray-600 hover:text-beige-700 transition-colors">Doctor Login</Link>
                            <Link href={route('reception.login')} className="text-gray-600 hover:text-beige-700 transition-colors">Reception Login</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>{address}</p>
                            <p>{contact_phone}</p>
                            <p>{contact_email}</p>
                            {whatsappHref && (
                                <p>
                                    <a href={whatsappHref} target="_blank" rel="noreferrer" className="text-beige-700 font-medium">Chat on WhatsApp</a>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
                    <p>© {new Date().getFullYear()} {hospitalName}. All rights reserved.</p>
                    <p>Designed for seamless web + mobile app experience.</p>
                </div>
            </div>
        </footer>
    );
}
