import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ galleries }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        image: null,
        title: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (!window.confirm('Upload this image to the gallery?')) {
            return;
        }

        post(route('admin.gallery.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const deleteImage = (id) => {
        if (window.confirm('Delete this image?')) {
            router.delete(route('admin.gallery.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Media Gallery" />

            <div className="space-y-5 md:space-y-6">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Clinical Visuals</h2>
                    <p className="text-sm md:text-base text-slate-500 font-medium">Manage hospital gallery, facility photos, and events</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
                    {/* Upload Section */}
                    <div className="lg:col-span-1">
                        <form onSubmit={submit} className="bg-white p-5 sm:p-6 md:p-7 rounded-xl shadow-sm border border-slate-100 space-y-5 lg:sticky lg:top-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.24em]">Add New Visual</h3>
                            
                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Image Title</label>
                                <input 
                                    type="text" 
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                    placeholder="e.g., Main Operation Theater"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Select Image</label>
                                <div className="p-5 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                                    <div className="w-11 h-11 bg-white rounded-lg shadow-sm flex items-center justify-center text-slate-300 mb-4">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <input 
                                        type="file" 
                                        onChange={e => setData('image', e.target.files[0])}
                                        className="text-xs font-bold text-slate-500 file:bg-slate-800 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg file:mr-4 file:cursor-pointer"
                                    />
                                    <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max 5MB • JPG, PNG</p>
                                </div>
                                {errors.image && <p className="mt-1 text-xs text-red-500 font-bold">{errors.image}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-teal-500/20 active:scale-95 disabled:opacity-50"
                            >
                                {processing ? 'Uploading...' : 'Upload to Gallery'}
                            </button>
                        </form>
                    </div>

                    {/* Gallery Grid */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {galleries.map((img) => (
                                <div key={img.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 aspect-video">
                                    <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 md:p-6">
                                        <p className="text-white font-black text-sm md:text-base leading-tight uppercase tracking-tight">{img.title || 'Untitled Image'}</p>
                                        <div className="flex justify-between items-center mt-3 gap-3">
                                            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">{new Date(img.created_at).toLocaleDateString()}</span>
                                            <button 
                                                onClick={() => deleteImage(img.id)}
                                                className="p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
