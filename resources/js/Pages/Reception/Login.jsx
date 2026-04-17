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
        post(route('reception.login'));
    };

    return (
        <div className="relative min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 md:p-6 font-['Inter']">
            <Head title="Reception Login" />
            <div className="absolute inset-0">
                <img src="/images/hospital1.jpg" alt="Hospital" className="h-full w-full object-cover" />
                <div className="absolute inset-0 " />
            </div>
            
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 md:p-7 space-y-7 relative z-10 border border-slate-100">

                <div className="text-center relative z-10">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <ApplicationLogo className="h-11 w-11 shrink-0 text-amber-500" />
                        <div className="text-left leading-tight">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-500">Reception Portal</p>
                            <h1 className="text-lg font-black text-slate-800 tracking-tight">Healing Touch</h1>
                        </div>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Front Desk Access</h1>
                    <p className="text-slate-500 font-medium mt-2 text-sm">Authorized personnel only. Please verify your identity.</p>
                </div>

                <form onSubmit={submit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Institutional Email</label>
                        <input 
                            type="email" 
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                            placeholder="staff@healingtouch.com"
                            required 
                        />
                        {errors.email && <p className="mt-3 text-xs text-red-500 font-bold px-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Access Token / Password</label>
                        <input 
                            type="password" 
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                            placeholder="••••••••"
                            required 
                        />
                         {errors.password && <p className="mt-3 text-xs text-red-500 font-bold px-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                                className="w-5 h-5 rounded-lg border-slate-200 text-amber-600 focus:ring-amber-500 transition-all cursor-pointer" 
                            />
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600">Secure Session</span>
                        </label>
                        <Link href={route('contact.page')} className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-colors">Help?</Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-slate-900 border-b-4 border-slate-950 hover:bg-black text-white py-3.5 rounded-lg font-black text-sm uppercase tracking-[0.3em] transition-all active:translate-y-1 active:border-b-0 disabled:opacity-50"
                    >
                        {processing ? 'Authenticating...' : 'Establish Connection'}
                    </button>
                </form>
            </div>
            
            <div className="relative z-10 mt-14 text-center space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Healing Touch Healthcare System</p>
            </div>
        </div>
    );
}
