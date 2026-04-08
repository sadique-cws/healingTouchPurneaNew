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

    const submit = (e) => {
        e.preventDefault();
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
        if (confirm('Are you sure you want to delete this doctor?')) {
            router.delete(route('admin.doctors.destroy', id));
        }
    };

    const updateStatus = (id, status) => {
        router.patch(route('admin.doctors.update-status', id), { status });
    };

    return (
        <AdminLayout>
            <Head title="Manage Doctors" />

            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Doctors Directory</h2>
                        <p className="text-slate-500 font-medium">Manage hospital medical staff and availability</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-6 py-3 rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-lg shadow-teal-500/20 active:scale-95 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        Add New Doctor
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialization</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {doctors.data.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                                                <img 
                                                    src={doc.image || `https://ui-avatars.com/api/?name=${doc.user.name}&background=f1f5f9&color=0d9488`} 
                                                    alt="" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-slate-800 leading-none">Dr. {doc.user.name}</p>
                                                <p className="text-[11px] text-slate-400 font-bold uppercase mt-1.5">{doc.qualification}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-teal-100">
                                            {doc.department.name}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-slate-700">₹{doc.fee}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <select 
                                            value={doc.status}
                                            onChange={(e) => updateStatus(doc.id, e.target.value)}
                                            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-teal-500 transition-all ${
                                                doc.status == 1 ? 'bg-emerald-50 text-emerald-600' : 
                                                doc.status == 0 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                            <option value="2">On Leave</option>
                                        </select>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button 
                                                onClick={() => openEditModal(doc)}
                                                className="p-3 bg-slate-50 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => deleteDoctor(doc.id)}
                                                className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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

            {/* Add/Edit Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingDoctor ? 'Edit Doctor Profile' : 'Register New Doctor'}</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-10">
                            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                {/* Doctor Details */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Basic Information</h4>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                            placeholder="Dr. John Doe"
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-500 font-bold">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                            placeholder="doctor@hospital.com"
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-red-500 font-bold">{errors.email}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Phone</label>
                                            <input 
                                                type="text" 
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                                placeholder="9876543210"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Fee (₹)</label>
                                            <input 
                                                type="number" 
                                                value={data.fee}
                                                onChange={e => setData('fee', e.target.value)}
                                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                                placeholder="500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Department</label>
                                        <select 
                                            value={data.department_id}
                                            onChange={e => setData('department_id', e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700 appearance-none"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Clinical info */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Professional Profile</h4>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Qualification</label>
                                        <input 
                                            type="text" 
                                            value={data.qualification}
                                            onChange={e => setData('qualification', e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                            placeholder="MBBS, MD (Cardiology)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Description / About</label>
                                        <textarea 
                                            rows="3"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700 resize-none"
                                            placeholder="Write a brief profile..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Profile Image</label>
                                        <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-slate-300">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                            <input 
                                                type="file" 
                                                onChange={e => setData('image', e.target.files[0])}
                                                className="text-xs font-bold text-slate-500 file:bg-teal-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg file:mr-4 file:cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    {!editingDoctor && (
                                        <div>
                                            <label className="block text-[11px] font-black text-slate-600 uppercase mb-2">Login Password</label>
                                            <input 
                                                type="password" 
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                                placeholder="Minimum 6 characters"
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="md:col-span-2 pt-6 border-t border-slate-100 mt-4 flex justify-end gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-8 py-4 px-10 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-10 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-teal-500/30 active:scale-95 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : editingDoctor ? 'Update Profile' : 'Register Doctor'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
