import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-6 sm:justify-center sm:px-6 sm:py-8">
            <div className="mb-4">
                <Link href="/" className="flex items-center gap-3">
                    <ApplicationLogo className="h-12 w-12 shrink-0 text-beige-700" />
                    <div className="leading-tight">
                        <div className="text-lg font-black tracking-tight text-gray-800">
                            Healing Touch
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">
                            Hospital (Purnea)
                        </div>
                    </div>
                </Link>
            </div>

            <div className="w-full overflow-hidden rounded-2xl bg-white px-5 py-5 shadow-md sm:max-w-md sm:rounded-3xl">
                {children}
            </div>
        </div>
    );
}
