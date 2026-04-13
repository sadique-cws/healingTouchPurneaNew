import { Link } from '@inertiajs/react';

export default function PublicFooter({
    hospitalName = 'Healing Touch Hospital',
    address = '',
    contact_phone = '',
    contact_email = '',
}) {
    return (
        <footer className="hidden lg:block mt-auto bg-white border-t border-gray-200 text-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
                            <p>{address || 'Purnea, Bihar'}</p>
                            <p>{contact_phone || '-'}</p>
                            <p>{contact_email || '-'}</p>
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
