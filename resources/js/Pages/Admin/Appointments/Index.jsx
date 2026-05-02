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

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">Appointments</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage and monitor patient appointment schedule</p>
                </div>

                {/* Stats Cards - Mobile Scroll */}
                <div className="sm:hidden -mx-4 px-4 overflow-x-auto -ml-4 -mr-4 pl-4 pr-4 pb-2">
                    <div className="flex gap-3 min-w-min">
                        <div className="flex-shrink-0 w-40 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
                            <p className="text-xs font-semibold opacity-80 mb-1">Today</p>
                            <p className="text-2xl font-bold">{stats.today}</p>
                        </div>
                        <div className="flex-shrink-0 w-40 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white shadow-lg">
                            <p className="text-xs font-semibold opacity-80 mb-1">Pending</p>
                            <p className="text-2xl font-bold">{stats.pending}</p>
                        </div>
                        <div className="flex-shrink-0 w-40 bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
                            <p className="text-xs font-semibold opacity-80 mb-1">Confirmed</p>
                            <p className="text-2xl font-bold">{stats.confirmed}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Desktop */}
                <div className="hidden sm:grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-lg">
                        <p className="text-sm font-semibold opacity-90 mb-2">Today</p>
                        <p className="text-3xl font-bold">{stats.today}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-5 text-white shadow-lg">
                        <p className="text-sm font-semibold opacity-90 mb-2">Pending</p>
                        <p className="text-3xl font-bold">{stats.pending}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white shadow-lg">
                        <p className="text-sm font-semibold opacity-90 mb-2">Confirmed</p>
                        <p className="text-3xl font-bold">{stats.confirmed}</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="space-y-3">
                    <form onSubmit={handleSearch} className="flex gap-2 sm:gap-3">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input 
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                placeholder="Search patients, doctors..."
                            />
                        </div>
                        <button type="submit" className="px-4 sm:px-6 py-2.5 sm:py-3 bg-teal-600 text-white rounded-lg font-semibold text-sm hover:bg-teal-700 transition-colors">
                            Search
                        </button>
                    </form>

                    {/* Date Filters */}
                    <div className="flex gap-2 flex-wrap sm:gap-3">
                        <button 
                            onClick={() => filterByDate('today')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filters.date === 'today' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                        >
                            Today
                        </button>
                        <button 
                            onClick={() => filterByDate('tomorrow')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filters.date === 'tomorrow' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                        >
                            Tomorrow
                        </button>
                        <button 
                            onClick={() => filterByDate('')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${!filters.date ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                        >
                            All
                        </button>
                    </div>
                </div>

                {/* Table / List */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    {appointments.data.length > 0 ? (
                        <>
                            {/* Mobile View */}
                            <div className="sm:hidden divide-y divide-slate-200">
                                {appointments.data.map((apt) => (
                                    <div key={apt.id} className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-slate-900 truncate">{apt.appointment_no}</p>
                                                <p className="text-xs text-slate-500 mt-1">{new Date(apt.appointment_date).toLocaleDateString()}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0 whitespace-nowrap ${
                                                apt.status === 'cancelled' ? 'bg-red-100 text-red-700' 
                                                : apt.status === 'confirmed' ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {apt.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="bg-slate-50 p-3 rounded-lg">
                                                <p className="text-xs text-slate-500 font-semibold">Patient</p>
                                                <p className="font-semibold text-slate-900 mt-1 truncate">{apt.patient?.name}</p>
                                                <p className="text-xs text-slate-500 mt-1">{apt.patient?.phone}</p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg">
                                                <p className="text-xs text-slate-500 font-semibold">Doctor</p>
                                                <p className="font-semibold text-slate-900 mt-1">Dr. {apt.doctor?.user?.name}</p>
                                                <p className="text-xs text-teal-600 mt-1">{apt.doctor?.department?.name}</p>
                                            </div>
                                        </div>

                                        <select 
                                            value={apt.status}
                                            onChange={(e) => updateStatus(apt.id, e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="checked_in">Checked In</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>

                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => downloadReceipt(apt.id)}
                                                className="flex-1 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg font-semibold text-sm hover:bg-teal-200 transition-colors"
                                            >
                                                PDF
                                            </button>
                                            <button 
                                                onClick={() => router.delete(route('admin.appointments.destroy', apt.id))}
                                                className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200 transition-colors"
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
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">ID / Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Patient</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Doctor</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {appointments.data.map((apt) => (
                                            <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{apt.appointment_no}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{new Date(apt.appointment_date).toLocaleDateString()}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{apt.patient?.name}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{apt.patient?.phone}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">Dr. {apt.doctor?.user?.name}</p>
                                                        <p className="text-xs text-teal-600 mt-1">{apt.doctor?.department?.name}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select 
                                                        value={apt.status}
                                                        onChange={(e) => updateStatus(apt.id, e.target.value)}
                                                        className={`px-3 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold ${
                                                            apt.status === 'cancelled' ? 'bg-red-100 text-red-700' 
                                                            : apt.status === 'confirmed' ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="checked_in">Checked In</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => downloadReceipt(apt.id)}
                                                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                            title="Download"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => router.delete(route('admin.appointments.destroy', apt.id))}
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
                        <div className="px-4 py-16 text-center sm:px-6">
                            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-slate-500 font-medium">No appointments found</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
