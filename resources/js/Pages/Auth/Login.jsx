import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#f5f7fb] text-gray-900 antialiased overflow-x-hidden flex flex-col px-4 py-6">
            <Head title="Patient Login" />

            <main className="mx-auto flex w-full max-w-6xl flex-1 items-center">
                <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <section className="hidden lg:flex flex-col justify-between rounded-[2rem] bg-gradient-to-br from-beige-700 to-beige-800 p-8 text-white shadow-2xl">
                        <div>
                            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">← Back to public site</Link>
                            <h1 className="mt-10 text-4xl font-black tracking-tight leading-tight">Healing Touch Hospital</h1>
                            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85">Sign in to see your bookings, manage appointments, and access your patient dashboard.</p>
                        </div>

                        <div className="space-y-3 text-sm text-white/85">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/70">Login Panels</p>
                            <div className="grid grid-cols-2 gap-2 max-w-md">
                                <Link href={route('admin.login')} className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center font-semibold">Admin</Link>
                                <Link href={route('doctor.login')} className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center font-semibold">Doctor</Link>
                                <Link href={route('reception.login')} className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center font-semibold">Reception</Link>
                                <Link href={route('register')} className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center font-semibold">Register</Link>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[2rem] border border-gray-200 bg-white p-5 md:p-7 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-beige-700">Patient Portal</p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900">Login</h2>
                            </div>
                            <Link href="/" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-gray-700">Home</Link>
                        </div>

                        {status && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{status}</div>}

                        <form onSubmit={submit} className="mt-6 space-y-5">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium outline-none focus:border-beige-700 focus:ring-2 focus:ring-beige-700/10"
                                    autoComplete="username"
                                    autoFocus
                                    placeholder="you@example.com"
                                />
                                {errors.email && <p className="mt-2 text-xs font-semibold text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium outline-none focus:border-beige-700 focus:ring-2 focus:ring-beige-700/10"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="mt-2 text-xs font-semibold text-red-600">{errors.password}</p>}
                            </div>

                            <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-beige-700 focus:ring-beige-700"
                                />
                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Remember me</span>
                            </label>

                            <div className="flex items-center justify-between gap-3 text-sm">
                                {canResetPassword ? <Link href={route('password.request')} className="font-semibold text-beige-700">Forgot password?</Link> : <span />}
                                <Link href={route('register')} className="font-semibold text-gray-500">Create account</Link>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-beige-700 px-4 py-3.5 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all active:scale-[0.99] disabled:opacity-60"
                            >
                                {processing ? 'Signing in...' : 'Log in'}
                            </button>

                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 lg:hidden">
                                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">Login Panels</p>
                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold">
                                    <Link href={route('admin.login')} className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-gray-700">Admin</Link>
                                    <Link href={route('doctor.login')} className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-gray-700">Doctor</Link>
                                    <Link href={route('reception.login')} className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-gray-700">Reception</Link>
                                    <Link href={route('userlandingpage')} className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-gray-700">Home</Link>
                                </div>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}
