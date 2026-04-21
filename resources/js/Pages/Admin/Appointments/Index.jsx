import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ appointments, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.appointments.index'), { ...filters, search }, { preserveState: true });
    };

    const filterByDate = (dateType) => {
        router.get(route('admin.appointments.index'), { ...filters, date: dateType }, { preserveState: true });
    };

    const updateStatus = (id, status) => {
        if (window.confirm('Change appointment status?')) {
            router.patch(route('admin.appointments.status', id), { status });
        }
    };

    const downloadReceipt = (id) => {
        window.open(route('admin.appointments.receipt', id), '_blank');
    };

    return (
        <AdminLayout>
            <Head title="Appointments" />

            <div className="space-y-5 md:space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Appointments Ledger</h2>
                        <p className="text-slate-500 font-medium">Monitor and manage patient bookings across all departments</p>
                    </div>
                </div>

                {/* Stats & Filters Row */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 xl:gap-5">
                    {/* Quick Stats */}
                    <div className="lg:col-span-3 md:hidden -mx-1 overflow-x-auto no-scrollbar pb-1">
                        <div className="flex gap-3 px-1 w-max min-w-full">
                            <div className="min-w-[165px] bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today</p>
                                    <p className="text-lg font-black text-slate-800">{stats.today}</p>
                                </div>
                            </div>
                            <div className="min-w-[165px] bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                                    <p className="text-lg font-black text-slate-800">{stats.pending}</p>
                                </div>
                            </div>
                            <div className="min-w-[165px] bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmed</p>
                                    <p className="text-lg font-black text-slate-800">{stats.confirmed}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:grid lg:col-span-3 grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Today</p>
                                <p className="text-xl font-black text-slate-800">{stats.today}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                                <p className="text-xl font-black text-slate-800">{stats.pending}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmed</p>
                                <p className="text-xl font-black text-slate-800">{stats.confirmed}</p>
                            </div>
                        </div>
                    </div>

                    {/* Date Filters */}
                    <div className="hidden lg:flex bg-white p-2 rounded-xl border border-slate-100 shadow-sm gap-1 overflow-x-auto no-scrollbar">
                        <button 
                            onClick={() => filterByDate('today')}
                            className={`flex-1 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.date === 'today' ? 'bg-teal-600 text-white shadow-lg' : 'text-teal-700 hover:bg-teal-50'}`}
                        >
                            Today
                        </button>
                        <button 
                            onClick={() => filterByDate('tomorrow')}
                            className={`flex-1 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.date === 'tomorrow' ? 'bg-teal-600 text-white shadow-lg' : 'text-teal-700 hover:bg-teal-50'}`}
                        >
                            Tomorrow
                        </button>
                        <button 
                            onClick={() => filterByDate('')}
                            className={`flex-1 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!filters.date ? 'bg-teal-600 text-white shadow-lg' : 'text-teal-700 hover:bg-teal-50'}`}
                        >
                            All
                        </button>
                    </div>

                    <div className="lg:hidden">
                        <button
                            type="button"
                            onClick={() => setIsFilterModalOpen(true)}
                            className="w-full py-3 bg-teal-50 border border-teal-100 shadow-sm rounded-xl text-xs font-black uppercase tracking-widest text-teal-700"
                        >
                            Open Filters
                        </button>
                    </div>
                </div>

                {/* Main Table Section */}
                <div className="space-y-4">
                    <form onSubmit={handleSearch} className="flex items-center gap-2 sm:gap-4">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </span>
                            <input 
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-11 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white border-none rounded-xl shadow-sm ring-1 ring-slate-100 focus:ring-2 focus:ring-teal-500 transition-all font-bold text-slate-700 text-sm sm:text-base"
                                placeholder="Search by patient, doctor, or appointment no..."
                            />
                        </div>
                        <button type="submit" className="shrink-0 px-4 sm:px-8 py-3 sm:py-4 bg-teal-600 text-white rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                            <span className="sm:hidden">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </span>
                            <span className="hidden sm:inline">Search</span>
                        </button>
                    </form>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="md:hidden divide-y divide-slate-100">
                            {appointments.data.length > 0 ? appointments.data.map((apt) => (
                                <div key={apt.id} className="p-3 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-black text-slate-800 uppercase leading-none">{apt.appointment_no}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5">{new Date(apt.appointment_date).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                            apt.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-700'
                                        }`}>
                                            {apt.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 text-sm">
                                        <div className="rounded-xl bg-slate-50 p-3">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
                                            <p className="mt-1 font-black text-slate-800">{apt.patient?.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{apt.patient?.phone}</p>
                                        </div>
                                        <div className="rounded-xl bg-slate-50 p-3">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</p>
                                            <p className="mt-1 font-black text-slate-800">Dr. {apt.doctor?.user?.name}</p>
                                            <p className="text-[10px] text-teal-600 font-bold uppercase mt-1">{apt.doctor?.department?.name}</p>
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-3 space-y-3">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update status</p>
                                            <select 
                                                value={apt.status}
                                                onChange={(e) => updateStatus(apt.id, e.target.value)}
                                                className="mt-2 w-full text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-teal-500 transition-all bg-white text-teal-700"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="checked_in">Checked In</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => downloadReceipt(apt.id)}
                                                className="flex-1 py-2.5 bg-teal-50 text-teal-700 rounded-xl font-black text-[11px] uppercase tracking-widest"
                                            >
                                                PDF
                                            </button>
                                            <button 
                                                onClick={() => router.delete(route('admin.appointments.destroy', apt.id))}
                                                className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-black text-xs uppercase tracking-widest"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="px-4 py-16 text-center">
                                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">No appointments found matching your criteria</p>
                                </div>
                            )}
                        </div>

                        <div className="hidden md:block w-full max-w-full overflow-x-auto no-scrollbar">
                        <table className="w-full min-w-[920px] text-left">
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
                                        <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                                            <p className="text-sm font-black text-slate-800 uppercase leading-none">{apt.appointment_no}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5">{new Date(apt.appointment_date).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
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
                                        <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                                            <p className="text-sm font-black text-slate-700 leading-none">Dr. {apt.doctor?.user?.name}</p>
                                            <p className="text-[10px] text-teal-600 font-bold uppercase mt-1.5 leading-none">{apt.doctor?.department?.name}</p>
                                        </td>
                                        <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                                            <select 
                                                value={apt.status}
                                                onChange={(e) => updateStatus(apt.id, e.target.value)}
                                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-teal-500 transition-all ${
                                                    apt.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-700'
                                                }`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="checked_in">Checked In</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 text-right">
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
            </div>

            {isFilterModalOpen && (
                <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setIsFilterModalOpen(false)}>
                    <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl p-4 space-y-4 max-h-[75vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200" />
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Filter Appointments</p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => { filterByDate('today'); setIsFilterModalOpen(false); }}
                                className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${filters.date === 'today' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'}`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => { filterByDate('tomorrow'); setIsFilterModalOpen(false); }}
                                className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${filters.date === 'tomorrow' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'}`}
                            >
                                Tomorrow
                            </button>
                            <button
                                onClick={() => { filterByDate(''); setIsFilterModalOpen(false); }}
                                className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${!filters.date ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700'}`}
                            >
                                All
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsFilterModalOpen(false)}
                            className="w-full py-3 rounded-xl bg-teal-50 text-teal-700 text-xs font-black uppercase tracking-widest"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
