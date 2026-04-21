import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ departments, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        status: '1',
    });

    const openAddModal = () => {
        clearErrors();
        reset();
        setEditingDepartment(null);
        setIsModalOpen(true);
    };

    const openEditModal = (dept) => {
        clearErrors();
        setEditingDepartment(dept);
        setData({
            name: dept.name,
            description: dept.description || '',
            status: dept.status.toString(),
        });
        setIsModalOpen(true);
    };

    const confirmAction = (message) => window.confirm(message);

    const submit = (e) => {
        e.preventDefault();
        if (!confirmAction(editingDepartment ? 'Update this department?' : 'Create this department?')) {
            return;
        }

        if (editingDepartment) {
            put(route('admin.departments.update', editingDepartment.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.departments.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const deleteDepartment = (id) => {
        if (confirmAction('Delete this department?')) {
            router.delete(route('admin.departments.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Departments" />

            <div className="space-y-5 md:space-y-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-end">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Medical Departments</h2>
                        <p className="text-slate-500 font-medium">Configure hospital specialized departments and units</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="hidden sm:inline-flex w-full sm:w-auto justify-center bg-[#007ed5] hover:bg-[#006bb5] text-white px-5 py-3 rounded-xl font-black text-sm tracking-widest uppercase transition-all shadow-lg shadow-blue-500/20 active:scale-95 items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        Create Department
                    </button>
                </div>

                <button
                    onClick={openAddModal}
                    className="sm:hidden fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full bg-[#007ed5] text-white shadow-xl shadow-blue-500/30 flex items-center justify-center"
                    aria-label="Create department"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                </button>

                {/* Table Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="md:hidden divide-y divide-slate-100">
                        {departments.data.map((dept) => (
                            <div key={dept.id} className="p-4 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-black text-slate-800 leading-tight truncate">{dept.name}</p>
                                        <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2">{dept.description || 'No description provided'}</p>
                                    </div>
                                    <span className={`shrink-0 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${dept.status == 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        {dept.status == 1 ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctors</p>
                                        <p className="mt-1 text-sm font-black text-slate-800">{dept.doctors_count} Docs</p>
                                    </div>
                                    <div className="rounded-lg bg-slate-50 p-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                        <p className="mt-1 text-sm font-black text-slate-800">{dept.status == 1 ? 'Active' : 'Inactive'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => openEditModal(dept)}
                                        className="flex-1 py-3 bg-slate-50 text-slate-700 rounded-lg font-black text-xs uppercase tracking-widest"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => deleteDepartment(dept.id)}
                                        className="flex-1 py-3 bg-red-50 text-red-600 rounded-lg font-black text-xs uppercase tracking-widest"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block w-full max-w-full overflow-x-auto no-scrollbar">
                    <table className="w-full min-w-[860px] text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Doctors</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {departments.data.map((dept) => (
                                <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                                        <p className="text-base font-black text-slate-800 leading-none">{dept.name}</p>
                                    </td>
                                    <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                                        <p className="text-sm text-slate-500 font-medium line-clamp-1 max-w-xs">{dept.description || 'No description provided'}</p>
                                    </td>
                                    <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 text-center">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black">
                                            {dept.doctors_count} Docs
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            dept.status == 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            {dept.status == 1 ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button 
                                                onClick={() => openEditModal(dept)}
                                                className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => deleteDepartment(dept.id)}
                                                className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-0 sm:px-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{editingDepartment ? 'Edit Department' : 'New Department'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-5 sm:p-6 md:p-8 space-y-5">
                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Department Name</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={`w-full px-4 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700 ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                                    placeholder="e.g., Cardiology"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500 font-bold">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Description</label>
                                <textarea 
                                    rows="4"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700 resize-none"
                                    placeholder="Brief description of the department..."
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Status</label>
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setData('status', '1')}
                                        className={`flex-1 py-3.5 rounded-lg font-black text-sm uppercase transition-all ${data.status == '1' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                                    >
                                        Active
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setData('status', '0')}
                                        className={`flex-1 py-3.5 rounded-lg font-black text-sm uppercase transition-all ${data.status == '0' ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                                    >
                                        Inactive
                                    </button>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-slate-100 mt-4 flex justify-end gap-4">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : editingDepartment ? 'Update Department' : 'Create Department'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
