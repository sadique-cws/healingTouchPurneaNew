import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ careers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCareer, setEditingCareer] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        description: '',
        salary: '',
        location: 'Line Bazar, Purnea',
        status: true,
    });

    const openAddModal = () => {
        reset();
        setEditingCareer(null);
        setIsModalOpen(true);
    };

    const openEditModal = (career) => {
        setEditingCareer(career);
        setData({
            title: career.title,
            description: career.description,
            salary: career.salary || '',
            location: career.location,
            status: Boolean(career.status),
        });
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingCareer) {
            put(route('admin.careers.update', editingCareer.id), {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            post(route('admin.careers.store'), {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const toggleStatus = (id) => {
        router.patch(route('admin.careers.toggle-status', id));
    };

    return (
        <AdminLayout>
            <Head title="Career Management" />

            <div className="space-y-6 md:space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Talent Acquisition</h2>
                        <p className="text-slate-500 font-medium">Post and manage hospital job openings</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-black text-sm tracking-widest uppercase transition-all shadow-lg shadow-indigo-500/20"
                    >
                        Create Job Post
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {careers.data.map((job) => (
                        <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col group hover:shadow-lg transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${job.status ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {job.status ? 'Hiring' : 'Closed'}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(job)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button onClick={() => toggleStatus(job.id)} className="p-2 text-slate-400 hover:text-amber-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">{job.title}</h3>
                            <p className="text-slate-500 text-sm font-medium mb-6 line-clamp-3">{job.description}</p>
                            
                            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Salary</p>
                                    <p className="text-lg font-black text-slate-700">{job.salary || 'Competitive'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Location</p>
                                    <p className="text-xs font-bold text-slate-600 leading-none">{job.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingCareer ? 'Edit Opportunity' : 'New Career Post'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 md:p-8 space-y-5">
                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Job Title</label>
                                <input 
                                    type="text" 
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                                    placeholder="e.g., Staff Nurse, Resident Doctor"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Salary Range</label>
                                    <input 
                                        type="text" 
                                        value={data.salary}
                                        onChange={e => setData('salary', e.target.value)}
                                        className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                                        placeholder="₹ 20,000 - 30,000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Location</label>
                                    <input 
                                        type="text" 
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Job Description</label>
                                <textarea 
                                    rows="5"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700 resize-none"
                                    placeholder="Describe roles, responsibilities, and qualifications..."
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <div 
                                        onClick={() => setData('status', !data.status)}
                                        className={`w-12 h-6 rounded-full relative transition-all ${data.status ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${data.status ? 'translate-x-6' : ''}`} />
                                    </div>
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Show as Active/Hiring</span>
                                </label>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/30 active:scale-95 disabled:opacity-50"
                                >
                                    {processing ? 'Posting...' : editingCareer ? 'Update Opportunity' : 'Post Opportunity'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
