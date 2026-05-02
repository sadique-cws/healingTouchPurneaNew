import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ doctors, departments, filters }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        department_id: '',
        available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        status: '1',
        fee: '',
        qualification: '',
        description: '',
        password: '',
        image: null,
    });

    const openAddModal = () => {
        clearErrors();
        reset();
        setEditingDoctor(null);
        setIsAddModalOpen(true);
    };

    const openEditModal = (doctor) => {
        clearErrors();
        setEditingDoctor(doctor);
        setData({
            name: doctor.user.name,
            email: doctor.user.email,
            phone: doctor.user.phone,
            department_id: doctor.department_id,
            available_days: Array.isArray(doctor.available_days) ? doctor.available_days : JSON.parse(doctor.available_days || '[]'),
            status: doctor.status.toString(),
            fee: doctor.fee,
            qualification: doctor.qualification,
            description: doctor.user.description || '',
            password: '',
            image: null,
        });
        setIsAddModalOpen(true);
    };

    const confirmAction = (message) => window.confirm(message);

    const submit = (e) => {
        e.preventDefault();
        if (!confirmAction(editingDoctor ? 'Update this doctor profile?' : 'Register this doctor?')) {
            return;
        }

        if (editingDoctor) {
            post(route('admin.doctors.update', editingDoctor.id), {
                forceFormData: true,
                onSuccess: () => {
                    setIsAddModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.doctors.store'), {
                onSuccess: () => {
                    setIsAddModalOpen(false);
                    reset();
                },
            });
        }
    };

    const deleteDoctor = (id) => {
        if (confirmAction('Delete this doctor?')) {
            router.delete(route('admin.doctors.destroy', id));
        }
    };

    const updateStatus = (id, status) => {
        if (confirmAction('Change doctor status?')) {
            router.patch(route('admin.doctors.update-status', id), { status });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Doctors" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">Doctors Directory</h1>
                        <p className="text-sm text-slate-500 font-medium">Manage medical staff and their availability</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="sm:flex inline-flex justify-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors shadow-lg items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Doctor
                    </button>
                </div>

                {/* Doctors List / Table */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    {doctors.data.length > 0 ? (
                        <>
                            {/* Mobile View */}
                            <div className="sm:hidden divide-y divide-slate-200">
                                {doctors.data.map((doc) => (
                                    <div key={doc.id} className="p-4 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={doc.image || `https://ui-avatars.com/api/?name=${doc.user.name}&background=14b8a6&color=fff&bold=true`}
                                                alt=""
                                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-slate-900 truncate">Dr. {doc.user.name}</p>
                                                <p className="text-xs text-slate-500 mt-1">{doc.qualification}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">₹{doc.fee}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold">
                                                    {doc.department.name}
                                                </span>
                                                <select
                                                    value={doc.status}
                                                    onChange={(e) => updateStatus(doc.id, e.target.value)}
                                                    className={`px-3 py-1 text-xs border-none rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                                        doc.status == 1 ? 'bg-green-100 text-green-700' 
                                                        : doc.status == 0 ? 'bg-red-100 text-red-700' 
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >
                                                    <option value="1">Active</option>
                                                    <option value="0">Inactive</option>
                                                    <option value="2">On Leave</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(doc)}
                                                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteDoctor(doc.id)}
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
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Doctor</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Department</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Fee</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {doctors.data.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={doc.image || `https://ui-avatars.com/api/?name=${doc.user.name}&background=14b8a6&color=fff&bold=true`}
                                                            alt=""
                                                            className="w-10 h-10 rounded-lg object-cover"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-slate-900 truncate">Dr. {doc.user.name}</p>
                                                            <p className="text-xs text-slate-500 mt-1 truncate">{doc.qualification}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold">
                                                        {doc.department.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-slate-900">₹{doc.fee}</td>
                                                <td className="px-6 py-4">
                                                    <select 
                                                        value={doc.status}
                                                        onChange={(e) => updateStatus(doc.id, e.target.value)}
                                                        className={`px-3 py-1 text-xs border-none rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                                            doc.status == 1 ? 'bg-green-100 text-green-700' 
                                                            : doc.status == 0 ? 'bg-red-100 text-red-700' 
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                    >
                                                        <option value="1">Active</option>
                                                        <option value="0">Inactive</option>
                                                        <option value="2">On Leave</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => openEditModal(doc)}
                                                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteDoctor(doc.id)}
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="text-slate-500 font-medium">No doctors added yet</p>
                            <button 
                                onClick={openAddModal}
                                className="mt-4 px-6 py-2 bg-teal-100 text-teal-700 rounded-lg font-semibold text-sm hover:bg-teal-200 transition-colors"
                            >
                                Add Your First Doctor
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-0 sm:px-4 py-0 sm:py-6 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-t-xl sm:rounded-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                {editingDoctor ? 'Edit Doctor Profile' : 'Register New Doctor'}
                            </h3>
                            <button 
                                onClick={() => setIsAddModalOpen(false)} 
                                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Basic Information</h4>
                                    
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                            placeholder="Dr. John Doe"
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">Email</label>
                                        <input 
                                            type="email" 
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                            placeholder="doctor@hospital.com"
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">Phone</label>
                                            <input 
                                                type="text" 
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                                placeholder="9876543210"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">Fee (₹)</label>
                                            <input 
                                                type="number" 
                                                value={data.fee}
                                                onChange={e => setData('fee', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                                placeholder="500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">Department</label>
                                        <select 
                                            value={data.department_id}
                                            onChange={e => setData('department_id', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Professional Information */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Profile</h4>
                                    
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">Qualification</label>
                                        <input 
                                            type="text" 
                                            value={data.qualification}
                                            onChange={e => setData('qualification', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                            placeholder="MBBS, MD (Cardiology)"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">About / Description</label>
                                        <textarea 
                                            rows="3"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                                            placeholder="Brief profile..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-2">Profile Image</label>
                                        <input 
                                            type="file" 
                                            onChange={e => setData('image', e.target.files[0])}
                                            className="w-full text-xs"
                                        />
                                    </div>

                                    {!editingDoctor && (
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-2">Login Password</label>
                                            <input 
                                                type="password" 
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                                placeholder="Min 6 characters"
                                            />
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6 py-4 flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-6 py-2 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="button"
                                onClick={submit}
                                disabled={processing}
                                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-lg disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : editingDoctor ? 'Update' : 'Register'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
