import { Head, Link, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function Account({ hospital_name, address, contact_phone, contact_email }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const mainLinks = [
        { label: 'Home', href: '/', icon: HomeIcon },
        { label: 'Book Appointment', href: route('book.appointment'), icon: CalendarIcon },
        { label: 'Manage Appointments', href: route('manage.appointments'), icon: ClipboardIcon },
        { label: 'Our Doctors', href: route('our.doctors'), icon: StethoscopeIcon },
        { label: 'Services', href: route('services.page'), icon: GridIcon },
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
    const displayEmail = user?.email || 'Login to manage your health securely';
    const initials = displayName
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="public-page min-h-screen bg-[#f3f5f9] text-gray-900 antialiased overflow-x-hidden flex flex-col">
            <Head title="Account Settings | Healing Touch" />
            <Header />

            <main className="mx-auto w-full max-w-lg lg:max-w-6xl flex-1 px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pb-12 flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
                
                {/* LEFT SIDE (Desktop fixes with mobile compactness) */}
                <div className="flex flex-col gap-4 lg:w-1/3 lg:shrink-0 lg:sticky lg:top-24 mt-2 lg:mt-0">
                    
                    {/* Compact Mobile Profile / Elegant Desktop Profile */}
                    <div className="relative rounded-3xl bg-white shadow-sm border border-gray-100 p-5 lg:p-6 lg:flex-col lg:text-center flex items-center lg:items-center justify-between lg:justify-start gap-4">
                        <div className="flex flex-col lg:items-center">
                            <div className="inline-flex flex-col items-start lg:items-center gap-1 mb-2">
                                <h1 className="text-xl lg:text-2xl font-black text-gray-900 leading-tight">{displayName}</h1>
                                 <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${user ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                     {user ? 'Verified Patient' : 'Guest Mode'}
                                 </span>
                            </div>
                            <p className="mt-1 text-xs lg:text-sm font-bold text-gray-500">{displayEmail}</p>
                            
                            {!user && (
                                <Link href={route('login')} className="mt-3 inline-flex items-center justify-center px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:bg-black transition-colors active:scale-95 w-max">
                                    Login
                                </Link>
                            )}
                        </div>
                        <div className="relative flex lg:mt-4 lg:mx-auto h-20 w-20 shrink-0 items-center justify-center rounded-3xl lg:rounded-full bg-beige-100 text-3xl font-black text-beige-700 shadow-inner lg:shadow-md lg:ring-4 lg:ring-white">
                            {initials || 'HT'}
                            {user && <span className="absolute bottom-1 right-1 lg:bottom-0 lg:right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />}
                        </div>
                    </div>
                    
                    {/* Quick Actions (Visually prominent App Grid) */}
                    <div className="grid grid-cols-3 gap-2.5 lg:gap-3">
                        {quickActions.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-3 lg:p-4 shadow-sm border border-gray-100 transition-all hover:border-beige-200 hover:-translate-y-0.5 active:scale-95"
                                >
                                    <div className="relative flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl bg-beige-50 text-beige-700 group-hover:bg-beige-600 group-hover:text-white transition-colors duration-300">
                                        <Icon className="h-5 w-5" />
                                        <span className="absolute -top-1.5 -right-1.5 rounded-lg bg-emerald-500 px-1.5 py-0.5 text-[9px] font-black text-white shadow-sm ring-2 ring-white">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-800 leading-tight text-center">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Support Card Desktop only, hides on mobile because we want compactness */}
                    <div className="hidden lg:block rounded-2xl bg-slate-900 p-6 text-white border border-slate-800 shadow-xl mt-4">
                         <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">Support & Reach Us</h3>
                         <div className="space-y-4">
                              <ContactRow icon={PhoneIcon} label="Helpline" value={contact_phone || '96088 40667'} />
                              <ContactRow icon={LocationIcon} label="Location" value={address || 'Purnea, Bihar'} />
                         </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Menus */}
                <div className="flex flex-col gap-4 lg:w-2/3 lg:flex-1 lg:mt-2">
                    
                    {/* Authentication Group */}
                    <SettingsGroup title={user ? "Account Settings" : "Login & Security"} items={authLinks} />

                    {/* Main Tools */}
                    <SettingsGroup title="Hospital Services" items={mainLinks} />
                    
                    {/* Mobile Only Support Card */}
                    <div className="block lg:hidden rounded-2xl bg-white p-5 border border-gray-100 shadow-sm mt-2">
                         <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Support & Help</h3>
                         <div className="space-y-3">
                              <ContactRowLight icon={PhoneIcon} label="Helpline" value={contact_phone || '96088 40667'} />
                              <ContactRowLight icon={LocationIcon} label="Location" value={address || 'Linebazar, Purnea'} />
                         </div>
                    </div>

                    {/* Logout Button (if logged in) */}
                    {user && (
                        <div className="mt-2">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white p-4 lg:p-5 text-sm font-black text-red-600 shadow-sm border border-red-100 transition-all hover:bg-red-50 hover:border-red-200 active:scale-95"
                            >
                                <span className="flex h-5 w-5 lg:h-6 lg:w-6 items-center justify-center rounded-lg bg-red-100 text-red-600">⎋</span>
                                Log Out Securely
                            </Link>
                        </div>
                    )}
                </div>

            </main>

            <div className="hidden lg:block mt-8">
                <PublicFooter />
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
            <h2 className="px-4 text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{title}</h2>
            <div className="overflow-hidden rounded-3xl bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100">
                <div className="flex flex-col divide-y divide-gray-50">
                    {items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="group flex items-center justify-between px-5 py-3.5 lg:py-4 transition-colors hover:bg-beige-50/50 active:bg-beige-50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition-all group-hover:bg-beige-100 group-hover:text-beige-700 border border-gray-100 group-hover:border-beige-200 group-hover:scale-105">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-[13px] lg:text-[14px] font-black text-gray-700 transition-colors group-hover:text-black">{item.label}</span>
                                </div>
                                <div className="flex h-8 w-8 items-center justify-center rounded-md text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-beige-400">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/5 text-white">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
                <p className="text-xs lg:text-sm font-semibold text-white">{value}</p>
            </div>
        </div>
    );
}

function ContactRowLight({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-100 text-gray-500">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                <p className="text-xs font-black text-gray-800">{value}</p>
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// Icons
// ---------------------------------------------------------

function HomeIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5L12 3l9 7.5" /><path d="M5.25 9.75V21h13.5V9.75" /></svg>
    );
}
function StethoscopeIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3v6a4 4 0 0 0 8 0V3" /><path d="M15 13a4 4 0 0 1-8 0" /><path d="M17 10v2a4 4 0 0 0 4 4h1" /><path d="M22 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" /></svg>
    );
}
function GridIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1.5" /><rect width="7" height="7" x="14" y="3" rx="1.5" /><rect width="7" height="7" x="14" y="14" rx="1.5" /><rect width="7" height="7" x="3" y="14" rx="1.5" /></svg>
    );
}
function CalendarIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
    );
}
function ClipboardIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" /><path d="M9 2v4h6V2" /><path d="M9 12h6M9 16h6" /></svg>
    );
}
function PhoneIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
    );
}
function ImageIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="8" cy="8" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
    );
}
function BriefcaseIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
    );
}
function DocumentIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M3 15h6M3 19h6M8 11h8" /></svg>
    );
}
function ShieldIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
    );
}
function UserIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
    );
}
function DashboardIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    );
}
function LoginIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
    );
}
function UserPlusIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
    );
}
function LockIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
    );
}
function BadgeIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" /></svg>
    );
}
function LocationIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    );
}
function PlusIcon(props) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
    );
}
