import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ appointments, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.appointments.index'), { ...filters, search }, { preserveState: true });
    };

    const filterByDate = (dateType) => {
        router.get(route('admin.appointments.index'), { ...filters, date: dateType }, { preserveState: true });
    };

    const updateStatus = (id, status) => {
        router.patch(route('admin.appointments.status', id), { status });
    };

    const downloadReceipt = (id) => {
        window.open(route('admin.appointments.receipt', id), '_blank');
    };

    return (
        <AdminLayout>
            <Head title="Appointments" />

            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Appointments Ledger</h2>
                        <p className="text-slate-500 font-medium">Monitor and manage patient bookings across all departments</p>
                    </div>
                </div>

                {/* Stats & Filters Row */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Quick Stats */}
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today</p>
                                <p className="text-xl font-black text-slate-800">{stats.today}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                                <p className="text-xl font-black text-slate-800">{stats.pending}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmed</p>
                                <p className="text-xl font-black text-slate-800">{stats.confirmed}</p>
                            </div>
                        </div>
                    </div>

                    {/* Date Filters */}
                    <div className="flex bg-white p-2 rounded-3xl border border-slate-100 shadow-sm gap-1">
                        <button 
                            onClick={() => filterByDate('today')}
                            className={`flex-1 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.date === 'today' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            Today
                        </button>
                        <button 
                            onClick={() => filterByDate('tomorrow')}
                            className={`flex-1 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.date === 'tomorrow' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            Tomorrow
                        </button>
                        <button 
                            onClick={() => filterByDate('')}
                            className={`flex-1 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!filters.date ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            All
                        </button>
                    </div>
                </div>

                {/* Main Table Section */}
                <div className="space-y-4">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </span>
                            <input 
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700"
                                placeholder="Search by patient, doctor, or appointment no..."
                            />
                        </div>
                        <button type="submit" className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">Search</button>
                    </form>

                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {appointments.data.length > 0 ? appointments.data.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-800 uppercase leading-none">{apt.appointment_no}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5">{new Date(apt.appointment_date).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs shadow-inner">
                                                    {apt.patient?.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 leading-none">{apt.patient?.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5">{apt.patient?.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-700 leading-none">Dr. {apt.doctor?.user?.name}</p>
                                            <p className="text-[10px] text-teal-600 font-bold uppercase mt-1.5 leading-none">{apt.doctor?.department?.name}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select 
                                                value={apt.status}
                                                onChange={(e) => updateStatus(apt.id, e.target.value)}
                                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-teal-500 transition-all ${
                                                    apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                                                    apt.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                                                    apt.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                                }`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Checked In">Checked In</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button 
                                                    onClick={() => downloadReceipt(apt.id)}
                                                    className="p-3 bg-slate-50 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                                                    title="Download PDF Receipt"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                </button>
                                                <button 
                                                    onClick={() => router.delete(route('admin.appointments.destroy', apt.id))}
                                                    className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">No appointments found matching your criteria</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
