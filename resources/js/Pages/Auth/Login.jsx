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
        <div className="relative min-h-screen bg-gray-50 text-gray-900 antialiased overflow-x-hidden flex flex-col px-4 py-6">
            <Head title="Patient Login" />

            <div className="absolute inset-0">
                <img src="/images/hospital1.jpg" alt="Hospital" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-white/85" />
            </div>

            <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 items-center">
                    <section className="w-full rounded-xl border border-gray-200 bg-white/95 backdrop-blur-sm p-5 md:p-7 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-beige-700">Patient Portal</p>
                                <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900">Login</h2>
                            </div>
                            <Link href="/" className="rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-gray-700">Home</Link>
                        </div>

                        {status && <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{status}</div>}

                        <form onSubmit={submit} className="mt-6 space-y-5">
                            <div>
                                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium outline-none focus:border-beige-700 focus:ring-2 focus:ring-beige-700/10"
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
                                    className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3.5 font-medium outline-none focus:border-beige-700 focus:ring-2 focus:ring-beige-700/10"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="mt-2 text-xs font-semibold text-red-600">{errors.password}</p>}
                            </div>

                            <label className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
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
                                className="w-full rounded-md bg-beige-700 px-4 py-3.5 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all active:scale-[0.99] disabled:opacity-60"
                            >
                                {processing ? 'Signing in...' : 'Log in'}
                            </button>
                        </form>
                    </section>
            </main>
        </div>
    );
}
