import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        hospital_name: settings.hospital_name || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        whatsapp_number: settings.whatsapp_number || '',
        address: settings.address || '',
        instagram_link: settings.instagram_link || '',
        facebook_link: settings.facebook_link || '',
        twitter_link: settings.twitter_link || '',
        sms_status: settings.sms_status || false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    return (
        <AdminLayout>
            <Head title="Hospital Settings" />

            <div className="max-w-4xl space-y-6 md:space-y-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Configuration Hub</h2>
                    <p className="text-slate-500 font-medium">Control global hospital identity, contacts, and notifications</p>
                </div>

                <form onSubmit={submit} className="space-y-6 md:space-y-7">
                    {/* General Section */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">General Identity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Hospital Name</label>
                                <input 
                                    type="text" 
                                    value={data.hospital_name}
                                    onChange={e => setData('hospital_name', e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                />
                                {errors.hospital_name && <p className="mt-1 text-xs text-red-500 font-bold">{errors.hospital_name}</p>}
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Hospital Logo</label>
                                <div className="flex items-center gap-4 p-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm">
                                        <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <button type="button" className="text-xs font-black text-teal-600 uppercase tracking-widest px-4">Change Logo</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Contact & Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Contact Email</label>
                                <input 
                                    type="email" 
                                    value={data.contact_email}
                                    onChange={e => setData('contact_email', e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Contact Phone</label>
                                <input 
                                    type="text" 
                                    value={data.contact_phone}
                                    onChange={e => setData('contact_phone', e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Hospital Address</label>
                                <textarea 
                                    rows="2"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Section */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Social Networks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Instagram</label>
                                <input 
                                    type="url" 
                                    value={data.instagram_link}
                                    onChange={e => setData('instagram_link', e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                    placeholder="https://"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Facebook</label>
                                <input 
                                    type="url" 
                                    value={data.facebook_link}
                                    onChange={e => setData('facebook_link', e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                    placeholder="https://"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Twitter (X)</label>
                                <input 
                                    type="url" 
                                    value={data.twitter_link}
                                    onChange={e => setData('twitter_link', e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-[14px] font-black text-slate-800 tracking-tight">SMS Notifications</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">Enable automatic booking confirmations</p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setData('sms_status', !data.sms_status)}
                                className={`w-16 h-8 rounded-full transition-all relative ${data.sms_status ? 'bg-teal-500' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${data.sms_status ? 'translate-x-8' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Securely Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
