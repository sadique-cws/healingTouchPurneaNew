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
        <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center p-6 font-['Inter']">
            <Head title="Reception Login" />
            
            <div className="w-full max-w-md bg-white rounded-[4rem] shadow-2xl p-14 space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <svg className="w-48 h-48 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" /></svg>
                </div>

                <div className="text-center relative z-10">
                    <div className="w-20 h-20 bg-amber-500 rounded-[2rem] mx-auto flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-amber-500/40 mb-10">
                         R
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Front Desk Access</h1>
                    <p className="text-slate-500 font-medium mt-3">Authorized personnel only. Please verify your identity.</p>
                </div>

                <form onSubmit={submit} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Institutional Email</label>
                        <input 
                            type="email" 
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full px-7 py-5 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-slate-800 placeholder:text-slate-300"
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
                            className="w-full px-7 py-5 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-amber-500/10 transition-all font-bold text-slate-800 placeholder:text-slate-300"
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
                        <Link className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-colors">Help?</Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-slate-900 border-b-4 border-slate-950 hover:bg-black text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] transition-all active:translate-y-1 active:border-b-0 disabled:opacity-50"
                    >
                        {processing ? 'Authenticating...' : 'Establish Connection'}
                    </button>
                </form>
            </div>
            
            <div className="mt-14 text-center space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Healing Touch Healthcare System</p>
                <div className="flex justify-center gap-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest opacity-50">
                    <span>Terminal-01</span>
                    <span>•</span>
                    <span>Purnea Hub</span>
                </div>
            </div>
        </div>
    );
}
