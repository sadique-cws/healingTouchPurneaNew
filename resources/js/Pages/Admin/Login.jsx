import ApplicationLogo from '@/Components/ApplicationLogo';
import { useForm, Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-6">
            <Head title="Admin Login" />

            <div className="absolute inset-0">
                <img src="/images/hospital1.jpg" alt="Hospital" className="h-full w-full object-cover" />
                <div className="absolute inset-0" />
            </div>

            <div className="w-full max-w-md relative z-10 bg-white rounded p-5">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 ">
                        <ApplicationLogo className="h-11 w-11 shrink-0 text-teal-600" />
                        <div className="text-left leading-tight">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-teal-600">Admin Portal</p>
                            <h1 className="text-lg font-black text-slate-800 tracking-tight">Healing Touch</h1>
                        </div>
                    </div>
                    <p className="text-slate-500 mt-3 font-medium text-sm">Please sign in to your dashboard</p>
                </div>

                <div className="bg-white/95 backdrop-blur-sm p-5 md:p-7 ">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
                                </span>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-teal-500 transition-all font-medium text-slate-700 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                                    placeholder="admin@healingtouch.com"
                                    required
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-600 font-bold">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-teal-500 transition-all font-medium text-slate-700 ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-teal-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.046m4.596-4.596A9.964 9.964 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-2.101-2.101L3 3" /></svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-600 font-bold">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white py-4 rounded-lg font-black text-lg tracking-widest uppercase transition-all duration-300 shadow-xl shadow-teal-500/30 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-3"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                                    Access Portal
                                </>
                            )}
                        </button>

                    </form>
                </div>

                <p className="text-center mt-8 text-slate-400 font-medium">
                    &copy; 2026 Healing Touch Hospital. All rights reserved.
                </p>
            </div>
        </div>
    );
}
