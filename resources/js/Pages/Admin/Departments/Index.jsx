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

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">Medical Departments</h1>
                        <p className="text-sm text-slate-500 font-medium">Manage hospital departments and specializations</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="sm:flex inline-flex justify-center bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors shadow-lg items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Department
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    {departments.data.length > 0 ? (
                        <>
                            {/* Mobile View */}
                            <div className="sm:hidden divide-y divide-slate-200">
                                {departments.data.map((dept) => (
                                    <div key={dept.id} className="p-4 space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-slate-900">{dept.name}</p>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dept.description || 'No description'}</p>
                                            </div>
                                            <span className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold ${dept.status == 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {dept.status == 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-semibold">{dept.doctors_count} Doctors</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => openEditModal(dept)}
                                                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => deleteDepartment(dept.id)}
                                                className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Department</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Doctors</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {departments.data.map((dept) => (
                                            <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-slate-900">{dept.name}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{dept.description || 'No description'}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-semibold">{dept.doctors_count}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold inline-block ${
                                                        dept.status == 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {dept.status == 1 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => openEditModal(dept)}
                                                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L9.172 19H7v-2.172L15.586 6.414z" />
                                                            </svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteDepartment(dept.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="px-6 py-16 text-center">
                            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9.11m5.409 0H9.11m0 0H2m16.081 0h2" />
                            </svg>
                            <p className="text-slate-500 font-medium">No departments added yet</p>
                            <button 
                                onClick={openAddModal}
                                className="mt-4 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors"
                            >
                                Add First Department
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-0 sm:px-4 py-0 sm:py-6 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-t-xl sm:rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                {editingDepartment ? 'Edit Department' : 'Create Department'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <form onSubmit={submit} className="p-4 sm:p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Department Name</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Description</label>
                                <textarea 
                                    rows="4"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">Status</label>
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setData('status', '1')}
                                        className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${data.status == '1' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        Active
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setData('status', '0')}
                                        className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${data.status == '0' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        Inactive
                                    </button>
                                </div>
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
                                    {processing ? 'Saving...' : editingDepartment ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
