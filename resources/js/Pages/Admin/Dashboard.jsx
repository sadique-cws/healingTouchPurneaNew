import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats, todayAppointments, availableDoctors, demographics, statusCounts }) {
    
    const statCards = [
        { name: 'Total Patients', value: stats.patients, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'from-cyan-500 to-cyan-600' },
        { name: 'Active Doctors', value: stats.doctors, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'from-teal-500 to-teal-600' },
        { name: 'Today Appointments', value: stats.appointments, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'from-emerald-500 to-emerald-600' },
        { name: 'Net Revenue', value: `₹${stats.revenue}`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', color: 'from-orange-500 to-orange-600' },
    ];

    return (
        <AdminLayout>
            <Head title="Clinical Dashboard" />
            
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">Hospital Analytics</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                {/* Stats Grid - Mobile Horizontal Scroll */}
                <div className="sm:hidden -mx-4 px-4 overflow-x-auto -ml-4 -mr-4 pl-4 pr-4 pb-2">
                    <div className="flex gap-3 min-w-min">
                        {statCards.map((stat, idx) => (
                            <div 
                                key={stat.name} 
                                className={`flex-shrink-0 w-40 bg-gradient-to-br ${stat.color} rounded-lg p-4 text-white shadow-lg`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <svg className="w-6 h-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                                    </svg>
                                </div>
                                <p className="text-xs font-semibold opacity-80 mb-1">{stat.name}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Grid - Desktop Grid */}
                <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat) => (
                        <div 
                            key={stat.name} 
                            className={`bg-gradient-to-br ${stat.color} rounded-lg p-5 text-white shadow-lg hover:shadow-xl transition-shadow`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold opacity-90 mb-2">{stat.name}</p>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Appointments */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200">
                        <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900">Today's Appointments</h2>
                            <p className="text-sm text-slate-500 mt-0.5">{todayAppointments.data.length} scheduled</p>
                        </div>

                        <div className="overflow-x-auto">
                            {todayAppointments.data.length > 0 ? (
                                <>
                                    {/* Mobile View */}
                                    <div className="sm:hidden divide-y divide-slate-100">
                                        {todayAppointments.data.map((apt) => (
                                            <div key={apt.id} className="p-4 space-y-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-slate-900 truncate">{apt.patient?.name}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{apt.appointment_time}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                                                        apt.status === 'Cancelled' 
                                                            ? 'bg-red-100 text-red-700' 
                                                            : apt.status === 'Confirmed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {apt.status}
                                                    </span>
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-lg">
                                                    <p className="text-xs text-slate-500 font-semibold">Doctor</p>
                                                    <p className="text-sm font-semibold text-slate-900 mt-1">Dr. {apt.doctor?.user?.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop Table */}
                                    <table className="w-full hidden sm:table">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Patient</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Doctor</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Time</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {todayAppointments.data.map((apt) => (
                                                <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{apt.patient?.name}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">Dr. {apt.doctor?.user?.name}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{apt.appointment_time}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            apt.status === 'Cancelled' 
                                                                ? 'bg-red-100 text-red-700' 
                                                                : apt.status === 'Confirmed'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                            {apt.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <div className="px-4 sm:px-6 py-12 text-center">
                                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-slate-500 font-medium">No appointments today</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Widgets */}
                    <div className="space-y-6">
                        {/* Demographics Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 text-white shadow-lg">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-400">Patient Demographics</h3>
                            <div className="space-y-4">
                                {Object.entries(demographics).map(([gender, count]) => (
                                    <div key={gender}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-slate-300">{gender}</span>
                                            <span className="text-lg font-bold text-white">{count}</span>
                                        </div>
                                        <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${
                                                    gender === 'Male' ? 'bg-blue-400' 
                                                    : gender === 'Female' ? 'bg-pink-400' 
                                                    : 'bg-purple-400'
                                                }`} 
                                                style={{ width: `${(count / (stats.patients || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Online Staff */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
                            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Clinical Staff Online
                            </h3>
                            <div className="space-y-3">
                                {availableDoctors.length > 0 ? (
                                    availableDoctors.slice(0, 5).map((doc) => (
                                        <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-600 flex-shrink-0">
                                                {doc.user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-slate-900 truncate">Dr. {doc.user?.name}</p>
                                                <p className="text-xs text-slate-500">{doc.department}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-4">No doctors online</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

