import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function Account({ hospital_name, address, contact_phone, contact_email }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const mainLinks = [
        { label: 'Home', href: '/', icon: HomeIcon },
        { label: 'Our Doctors', href: route('our.doctors'), icon: StethoscopeIcon },
        { label: 'Services', href: route('services.page'), icon: GridIcon },
        { label: 'Book Appointment', href: route('book.appointment'), icon: CalendarIcon },
        { label: 'Manage Appointments', href: route('manage.appointments'), icon: ClipboardIcon },
        { label: 'Contact', href: route('contact.page'), icon: PhoneIcon },
        { label: 'Gallery', href: route('gallery.page'), icon: ImageIcon },
        { label: 'Careers', href: route('careers.page'), icon: BriefcaseIcon },
        { label: 'Terms & Conditions', href: route('terms.conditions'), icon: DocumentIcon },
        { label: 'Privacy Policy', href: route('privacy.policy'), icon: ShieldIcon },
    ];

    const authLinks = user
        ? [
            { label: 'My Profile Settings', href: route('profile.edit'), icon: UserIcon },
            { label: 'Dashboard', href: route('dashboard'), icon: DashboardIcon },
        ]
        : [
            { label: 'Patient Login', href: route('login'), icon: LoginIcon },
            { label: 'Register', href: route('register'), icon: UserPlusIcon },
            { label: 'Doctor Login', href: route('doctor.login'), icon: StethoscopeIcon },
            { label: 'Reception Login', href: route('reception.login'), icon: PhoneIcon },
            { label: 'Admin Login', href: route('admin.login'), icon: BadgeIcon },
            { label: 'Forgot Password', href: route('password.request'), icon: LockIcon },
        ];

    const quickActions = [
        { label: 'Appointments', href: route('manage.appointments'), badge: user ? 'View' : 'Find', icon: CalendarIcon },
        { label: 'Book Now', href: route('book.appointment'), badge: 'New', icon: PlusIcon },
        { label: 'Doctors', href: route('our.doctors'), badge: 'List', icon: StethoscopeIcon },
    ];

    const displayName = user?.name || 'Guest User';
    const displayEmail = user?.email || 'Login to manage your health';
    const initials = displayName
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="public-page min-h-screen bg-[#f3f5f9] text-gray-900 antialiased overflow-x-hidden flex flex-col">
            <Head title="Account | Healing Touch Hospital" />
            <Header />

            <main className="mx-auto w-full max-w-lg lg:max-w-6xl flex-1 px-4 sm:px-6 lg:px-8 pb-20 pt-20 sm:pt-24 md:pb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
                
                {/* LEFT SIDE: Profile Header + Quick Actions */}
                <div className="flex flex-col gap-5 lg:w-1/3 lg:shrink-0 lg:sticky lg:top-24 lg:self-start">
                    {/* App-like Profile Card */}
                    <div className="relative rounded-xl bg-white shadow-[0_8px_22px_rgb(0,0,0,0.04)] border border-gray-100 p-5 flex flex-col items-center text-center">
                        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-beige-700 text-3xl font-black text-white shadow-md ring-2 ring-white">
                            {initials || 'HT'}
                            {user && (
                                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-500"></span>
                            )}
                        </div>
                        <div className="relative z-10 mt-4 max-w-full">
                            <h1 className="text-xl font-extrabold text-gray-900 px-2 break-words leading-tight">{displayName}</h1>
                            <p className="mt-1 text-sm font-medium text-gray-500 break-all leading-snug">{displayEmail}</p>
                        </div>
                        <div className="relative z-10 mt-5 w-full flex justify-center">
                            <div className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm">
                                {user ? (
                                    <><span className="h-2 w-2 rounded-sm bg-emerald-500 animate-pulse" /> Verified Patient</>
                                ) : (
                                    <><span className="h-2 w-2 rounded-sm bg-amber-500" /> Guest Mode</>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions - App style Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {quickActions.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="group flex flex-col items-center justify-center gap-2.5 rounded-lg bg-white p-4 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 active:scale-95"
                                >
                                    <div className="relative flex h-12 w-12 items-center justify-center rounded-md bg-beige-50 text-beige-700 group-hover:bg-beige-600 group-hover:text-white transition-colors duration-300">
                                        <Icon className="h-5 w-5" />
                                        <span className="absolute -top-1.5 -right-1.5 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[9px] font-black tracking-widest text-white shadow-sm ring-2 ring-white">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-800 leading-tight text-center">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="order-last lg:order-none mt-0 lg:mt-auto">
                        <div className="rounded-xl bg-beige-900 p-5 text-white shadow-lg shadow-beige-900/15 relative overflow-hidden border border-beige-800">
                            <h3 className="text-sm font-black uppercase tracking-widest text-beige-200 mb-4 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-sm bg-emerald-400"></span>
                                Support & Reach Us
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <ContactRow icon={PhoneIcon} label="Helpline" value={contact_phone || '-'} />
                                <ContactRow icon={MailIcon} label="Email Us" value={contact_email || '-'} />
                                <ContactRow icon={LocationIcon} label="Location" value={address || 'Purnea, Bihar'} />
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT SIDE: Menus & Support */}
                <div className="flex flex-col gap-6 lg:w-2/3 lg:flex-1">
                    
                    {/* Settings / Account Group */}
                    <SettingsGroup title={user ? "Account Settings" : "Authentication"} items={authLinks} />

                    {/* Hospital Links Group */}
                    <SettingsGroup title="Explore Hospital" items={mainLinks} />

                    {/* Logout Button (if logged in) */}
                    {user && (
                        <div className="mt-2 mb-2">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white p-4 text-sm font-bold text-red-600 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-red-100 transition-all hover:bg-red-50 hover:border-red-200 active:scale-[0.98]"
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-100 text-red-600">⎋</span>
                                Logout securely
                            </Link>
                        </div>
                    )}

                </div>
            </main>

            <div className="hidden lg:block">
                <PublicFooter
                    address={address}
                    contact_phone={contact_phone}
                    contact_email={contact_email}
                />
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// Components
// ---------------------------------------------------------

function SettingsGroup({ title, items }) {
    return (
        <div className="flex flex-col gap-2">
            <h2 className="px-4 text-xs font-black uppercase tracking-widest text-gray-400">{title}</h2>
            <div className="overflow-hidden rounded-xl bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100">
                <div className="flex flex-col divide-y divide-gray-50">
                    {items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-beige-50/40 active:bg-beige-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-50 text-gray-500 transition-colors group-hover:bg-white group-hover:text-beige-700 group-hover:shadow-sm group-hover:border group-hover:border-beige-100">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-[15px] font-bold text-gray-700 transition-colors group-hover:text-gray-900">{item.label}</span>
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center rounded-md text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-beige-400">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function ContactRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/10 text-white backdrop-blur-sm border border-white/5">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-beige-300">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// Icons
// ---------------------------------------------------------

function HomeIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5.25 9.75V21h13.5V9.75" />
        </svg>
    );
}

function StethoscopeIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 3v6a4 4 0 0 0 8 0V3" />
            <path d="M15 13a4 4 0 0 1-8 0" />
            <path d="M17 10v2a4 4 0 0 0 4 4h1" />
            <path d="M22 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
        </svg>
    );
}

function GridIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="7" x="3" y="3" rx="1.5" />
            <rect width="7" height="7" x="14" y="3" rx="1.5" />
            <rect width="7" height="7" x="14" y="14" rx="1.5" />
            <rect width="7" height="7" x="3" y="14" rx="1.5" />
        </svg>
    );
}

function CalendarIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2v4M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
        </svg>
    );
}

function ClipboardIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="20" x="5" y="2" rx="2" />
            <path d="M9 2v4h6V2" />
            <path d="M9 12h6M9 16h6" />
        </svg>
    );
}

function PhoneIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
    );
}

function ImageIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <circle cx="8" cy="8" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
    );
}

function BriefcaseIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="7" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}

function DocumentIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M3 15h6M3 19h6M8 11h8" />
        </svg>
    );
}

function ShieldIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function UserIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
    );
}

function DashboardIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
    );
}

function LoginIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" x2="3" y1="12" y2="12" />
        </svg>
    );
}

function UserPlusIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
    );
}

function LockIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

function BadgeIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function MailIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
}

function LocationIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

function PlusIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}
