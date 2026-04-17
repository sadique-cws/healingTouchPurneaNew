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
        <div className="relative min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-5 md:p-8 font-inter overflow-x-hidden w-full">
            <Head title="Reception Login" />
            
            {/* Background Image / Pattern */}
            <div className="absolute inset-0 z-0">
                <img src="/images/hospital1.jpg" alt="Hospital Background" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            </div>
            
            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8 space-y-6 relative z-10 border border-slate-100/50">

                <div className="text-center relative z-10">
                    <div className="inline-flex items-center justify-center gap-3 w-full mb-5">
                        <ApplicationLogo className="h-12 w-12 shrink-0 text-amber-500" />
                        <div className="text-left leading-tight">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Reception Portal</p>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight">Healing Touch</h1>
                        </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Front Desk Access</h2>
                    <p className="text-slate-500 font-bold mt-2 text-sm">System login required for staff personnel.</p>
                </div>

                <form onSubmit={submit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2.5">Institutional Email</label>
                        <input 
                            type="email" 
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:bg-white focus:border-amber-500 transition-all font-bold text-slate-800 text-base placeholder:text-slate-400"
                            placeholder="staff@healingtouch.com"
                            required 
                        />
                        {errors.email && <p className="mt-2 text-xs text-red-500 font-bold">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2.5">Access Token</label>
                        <input 
                            type="password" 
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-4 focus:ring-amber-500/20 focus:bg-white focus:border-amber-500 transition-all font-bold text-slate-800 text-base placeholder:text-slate-400"
                            placeholder="••••••••"
                            required 
                        />
                         {errors.password && <p className="mt-2 text-xs text-red-500 font-bold">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center justify-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center w-6 h-6">
                                <input 
                                    type="checkbox" 
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500 transition-all cursor-pointer peer" 
                                />
                            </div>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-800 transition-colors">Secure Session</span>
                        </label>
                        <Link href={route('contact.page')} className="text-xs font-black text-amber-500 uppercase tracking-widest hover:text-amber-600 transition-colors">Help?</Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-slate-900 border-b-4 border-slate-950 hover:bg-black text-white py-4 rounded-lg font-black text-base uppercase tracking-[0.18em] transition-all hover:-translate-y-0.5 active:translate-y-1 active:border-b-0 disabled:opacity-50 shadow-xl shadow-slate-900/20 mt-2 min-h-[56px]"
                    >
                        {processing ? 'Authenticating...' : 'Establish Connection'}
                    </button>
                    
                    <div className="text-center pt-2">
                         <Link href="/" className="inline-block text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors">← Return to Public Site</Link>
                    </div>
                </form>
            </div>
            
            <div className="relative z-10 mt-12 text-center text-white/50 backdrop-blur-sm p-2 rounded-lg">
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Healing Touch Healthcare System</p>
                <p className="text-[10px] font-medium mt-1 tracking-widest">Version 2.0.1</p>
            </div>
        </div>
    );
}
