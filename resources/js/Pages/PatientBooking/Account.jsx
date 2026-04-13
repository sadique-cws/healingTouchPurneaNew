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
            { label: 'Login', href: route('login'), icon: LoginIcon },
            { label: 'Register', href: route('register'), icon: UserPlusIcon },
            { label: 'Forgot Password', href: route('password.request'), icon: LockIcon },
            { label: 'Admin Login', href: route('admin.login'), icon: BadgeIcon },
            { label: 'Doctor Login', href: route('doctor.login'), icon: StethoscopeIcon },
            { label: 'Reception Login', href: route('reception.login'), icon: PhoneIcon },
        ];

    const quickActions = [
        { label: 'Appointments', href: route('manage.appointments'), badge: user ? 'View' : 'Find', icon: CalendarIcon },
        { label: 'Book Now', href: route('book.appointment'), badge: 'New', icon: PlusIcon },
        { label: 'Doctors', href: route('our.doctors'), badge: 'List', icon: StethoscopeIcon },
    ];

    const displayName = user?.name || 'Guest User';
    const displayEmail = user?.email || 'Please login to view your details';
    const initials = displayName
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="public-page min-h-screen bg-[#f5f7fb] text-gray-900 antialiased overflow-x-hidden pb-16 lg:pb-0 flex flex-col">
            <Head title="Account | Healing Touch Hospital" />
            <Header />

            <main className="mx-auto flex w-full max-w-md flex-1 flex-col bg-[#f5f7fb] pb-8 pt-16">
                <section className="bg-gradient-to-b from-beige-700 via-beige-700 to-beige-800 px-4 pb-5 pt-5 text-white">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                            <span className="text-xl leading-none">←</span>
                        </Link>
                        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">My Account</div>
                        <div className="h-9 w-9" />
                    </div>

                    <div className="mt-4 flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white text-2xl font-black text-beige-700">
                            {initials || 'HT'}
                        </div>
                        <h1 className="mt-3 text-lg font-bold leading-tight">{displayName}</h1>
                        <p className="mt-1 max-w-[18rem] break-words text-sm text-white/90">{displayEmail}</p>
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            {user ? 'Logged in' : 'Guest mode'}
                        </div>
                    </div>
                </section>

                <section className="px-4">
                    <div className="-mt-5 rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                        <div className="grid grid-cols-3 gap-2">
                            {quickActions.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-3 text-center transition-colors hover:bg-beige-50/60"
                                    >
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-beige-50 text-beige-700">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <span className="text-[11px] font-semibold text-gray-700 leading-tight">{item.label}</span>
                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{item.badge}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="px-4 pt-4">
                    <div className="space-y-3">
                        <GroupCard title={user ? 'Account' : 'Login'}>
                            {authLinks.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <MenuRow key={item.label} href={item.href} icon={Icon} label={item.label} />
                                );
                            })}

                            {user && (
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="mt-1 flex w-full items-center justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500">⎋</span>
                                        Logout
                                    </span>
                                    <span className="text-base text-red-400">›</span>
                                </Link>
                            )}
                        </GroupCard>

                        <GroupCard title="Hospital Links">
                            {mainLinks.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <MenuRow key={item.label} href={item.href} icon={Icon} label={item.label} />
                                );
                            })}
                        </GroupCard>

                        <GroupCard title="Hospital Support">
                            <div className="space-y-3 px-1 pb-1 pt-1 text-sm text-gray-700">
                                <InfoRow icon={PhoneIcon} label="Phone" value={contact_phone || '-'} />
                                <InfoRow icon={MailIcon} label="Email" value={contact_email || '-'} />
                                <InfoRow icon={LocationIcon} label="Address" value={address || 'Purnea, Bihar'} />
                            </div>
                        </GroupCard>
                    </div>
                </section>

                <div className="px-4 pt-4">
                    <div className="rounded-2xl border border-beige-200 bg-beige-50 px-4 py-4 text-center">
                        <p className="text-sm font-semibold text-beige-800">Healing Touch Hospital</p>
                        <p className="mt-1 text-xs leading-relaxed text-beige-700/90">Quick access to your account, hospital services, and important links in one place.</p>
                    </div>
                </div>
                <section className="lg:hidden px-4 pt-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">Login Panels</h3>
                            <p className="text-xs text-gray-500 mt-1">Open the panel you need from mobile.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <Link href={route('login')} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-center font-semibold text-gray-700">Patient Login</Link>
                            <Link href={route('admin.login')} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-center font-semibold text-gray-700">Admin Login</Link>
                            <Link href={route('doctor.login')} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-center font-semibold text-gray-700">Doctor Login</Link>
                            <Link href={route('reception.login')} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-center font-semibold text-gray-700">Reception Login</Link>
                        </div>
                    </div>
                </section>
            </main>

            <PublicFooter
                address={address}
                contact_phone={contact_phone}
                contact_email={contact_email}
            />
        </div>
    );
}

function GroupCard({ title, children }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-4 py-3">
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-500">{title}</h2>
            </div>
            <div className="p-2">{children}</div>
        </div>
    );
}

function MenuRow({ href, icon: Icon, label }) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-beige-50/60"
        >
            <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600">
                    <Icon className="h-4 w-4" />
                </span>
                <span className="truncate text-sm font-medium text-gray-800">{label}</span>
            </span>
            <span className="text-lg text-gray-300">›</span>
        </Link>
    );
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-beige-700 border border-beige-100">
                <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">{label}</p>
                <p className="mt-1 break-words text-sm font-medium text-gray-800">{value}</p>
            </div>
        </div>
    );
}

function BaseIcon({ className = 'h-5 w-5' }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />;
}

function HomeIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5.25 9.75V21h13.5V9.75" />
        </svg>
    );
}

function StethoscopeIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 3v6a4 4 0 0 0 8 0V3" />
            <path d="M15 13a4 4 0 0 1-8 0" />
            <path d="M17 10v2a4 4 0 0 0 4 4h1" />
            <path d="M22 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
        </svg>
    );
}

function GridIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
        </svg>
    );
}

function CalendarIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v4M16 3v4M4 9h16" />
            <path d="M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
        </svg>
    );
}

function ClipboardIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3h6v2H9z" />
            <path d="M8 5h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
            <path d="M9 11h6M9 15h6" />
        </svg>
    );
}

function PhoneIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5Z" />
        </svg>
    );
}

function ImageIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
            <path d="m8 13 2.5-2.5 3 3 1.5-1.5L20 16" />
            <path d="M9 9h.01" />
        </svg>
    );
}

function BriefcaseIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 6h4a2 2 0 0 1 2 2v1H8V8a2 2 0 0 1 2-2Z" />
            <path d="M4 10h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a1 1 0 0 1 1-1Z" />
            <path d="M4 14h16" />
        </svg>
    );
}

function DocumentIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
            <path d="M14 3v5h5" />
            <path d="M9 13h6M9 17h6" />
        </svg>
    );
}

function ShieldIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3 20 7v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4Z" />
            <path d="M9.5 12.5 11 14l3.5-3.5" />
        </svg>
    );
}

function UserIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21a8 8 0 1 0-16 0" />
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        </svg>
    );
}

function DashboardIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h7v7H4zM13 4h7v11h-7zM4 13h7v7H4z" />
        </svg>
    );
}

function LoginIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M14 4h6v16h-6" />
        </svg>
    );
}

function UserPlusIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21a8 8 0 1 0-16 0" />
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            <path d="M19 8v6M16 11h6" />
        </svg>
    );
}

function LockIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 10V8a5 5 0 0 1 10 0v2" />
            <path d="M6 10h12v10H6z" />
            <path d="M12 14v2" />
        </svg>
    );
}

function BadgeIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3h8v4H8z" />
            <path d="M6 7h12v14H6z" />
            <path d="M9 12h6M9 16h4" />
        </svg>
    );
}

function MailIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16v12H4z" />
            <path d="m4 7 8 6 8-6" />
        </svg>
    );
}

function LocationIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z" />
            <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </svg>
    );
}

function PlusIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}
