import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('doctor.login'));
    };

    return (
        <div className="relative min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 md:p-6 font-['Inter']">
            <Head title="Doctor Login" />
            <div className="absolute inset-0">
                <img src="/images/hospital1.jpg" alt="Hospital" className="h-full w-full object-cover" />
                <div className="absolute inset-0 " />
            </div>
            
            <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-teal-500/10 p-5 md:p-7 space-y-7 border border-slate-100">
                <div className="text-center">
                    <div className="inline-flex items-center gap-3 rounded-2xl">
                        <ApplicationLogo className="h-11 w-11 shrink-0 text-teal-600" />
                        <div className="text-left leading-tight">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-teal-600">Doctor Portal</p>
                            <h1 className="text-lg font-black text-slate-800 tracking-tight">Healing Touch</h1>
                        </div>
                    </div>
                    <p className="text-slate-500 font-medium mt-2 text-sm">Welcome back! Sign in to manage your appointments</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Professional Email</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full pl-5 pr-5 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-800"
                                placeholder="doctor@healingtouch.com"
                                required 
                            />
                        </div>
                        {errors.email && <p className="mt-2 text-xs text-red-500 font-bold px-1">{errors.email}</p>}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-3 px-1">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Secure Password</label>
                            <Link href={route('password.request')} className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Forgot?</Link>
                        </div>
                        <input 
                            type="password" 
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-800"
                            placeholder="••••••••"
                            required 
                        />
                        {errors.password && <p className="mt-2 text-xs text-red-500 font-bold px-1">{errors.password}</p>}
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group px-1">
                        <input 
                            type="checkbox" 
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                            className="w-5 h-5 rounded-lg border-slate-200 text-teal-600 focus:ring-teal-500 transition-all cursor-pointer" 
                        />
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Remember my session</span>
                    </label>

                    <button 
                        type="submit" 
                        disabled={processing}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-lg font-black text-sm uppercase tracking-[0.2em] transition-all shadow-lg shadow-teal-500/30 active:scale-[0.98] disabled:opacity-50"
                    >
                        {processing ? 'Verifying...' : 'Access My Dashboard'}
                    </button>
                    
                    <div className="text-center pt-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Need help? <Link href={route('contact.page')} className="text-teal-600">Contact Administration</Link>
                        </p>
                    </div>
                </form>
            </div>
            
            <p className="relative z-10 mt-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Healing Touch Healthcare System</p>
        </div>
    );
}
