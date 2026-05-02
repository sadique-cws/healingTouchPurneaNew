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

    const confirmAction = (message) => window.confirm(message);

    const submit = (e) => {
        e.preventDefault();
        if (!confirmAction(editingCareer ? 'Update this job post?' : 'Create this job post?')) {
            return;
        }

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
        if (confirmAction('Change job status?')) {
            router.patch(route('admin.careers.toggle-status', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Career Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">Career Opportunities</h1>
                        <p className="text-sm text-slate-500 font-medium">Manage hospital job postings and openings</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="sm:flex inline-flex justify-center bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors shadow-lg items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Post Job
                    </button>
                </div>

                {/* Jobs Grid */}
                {careers.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {careers.data.map((job) => (
                            <div key={job.id} className="bg-white rounded-lg p-4 sm:p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col group">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${job.status ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {job.status ? 'Active' : 'Closed'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(job)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L9.172 19H7v-2.172L15.586 6.414z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => toggleStatus(job.id)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-sm font-bold text-slate-900 mb-2">{job.title}</h3>
                                <p className="text-xs text-slate-600 mb-3 line-clamp-2">{job.description}</p>
                                
                                <div className="mt-auto pt-3 border-t border-slate-200 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <span className="text-xs text-slate-600">{job.location}</span>
                                    </div>
                                    {job.salary && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-xs text-slate-600 font-medium">{job.salary}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-6 py-16 text-center">
                        <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4m0 2v4m0-11v2m0 0h2m-2 0H9m17 0a9 9 0 10-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-slate-500 font-medium">No job postings yet</p>
                        <button 
                            onClick={openAddModal}
                            className="mt-4 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors"
                        >
                            Post First Job
                        </button>
                    </div>
                )}

            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-0 sm:px-4 py-0 sm:py-6 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white w-full max-w-lg rounded-t-xl sm:rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
                        {/* Modal Header */}
                        <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                {editingCareer ? 'Edit Job Post' : 'Create Job Post'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={submit} className="p-4 sm:p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Job Title</label>
                                <input 
                                    type="text" 
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-2">Salary</label>
                                    <input 
                                        type="text" 
                                        value={data.salary}
                                        onChange={e => setData('salary', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-2">Location</label>
                                    <input 
                                        type="text" 
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Description</label>
                                <textarea 
                                    rows="5"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm resize-none"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <input 
                                    type="checkbox" 
                                    id="status-check"
                                    checked={data.status}
                                    onChange={e => setData('status', e.target.checked)}
                                    className="rounded"
                                />
                                <label htmlFor="status-check" className="text-xs font-semibold text-slate-700">Make this job post active</label>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : editingCareer ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
