import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats, todayAppointments, availableDoctors, demographics, statusCounts }) {
    
    const statCards = [
        { name: 'Total Patients', value: stats.patients, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'bg-teal-500' },
        { name: 'Active Doctors', value: stats.doctors, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'bg-cyan-500' },
        { name: 'Total Appointments', value: stats.appointments, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-blue-500' },
        { name: 'Total Revenue', value: `₹${stats.revenue}`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', color: 'bg-emerald-500' },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-8">
                {/* Header Section */}
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Hospital Analytics</h2>
                    <p className="text-slate-500 font-medium">Reporting for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => (
                        <div key={stat.name} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center space-x-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.name}</p>
                                <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Today's Appointments Table */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Today's Appointments</h3>
                            <button className="text-sm font-bold text-teal-600 hover:text-teal-700 uppercase tracking-widest">View All</button>
                        </div>
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {todayAppointments.data.length > 0 ? todayAppointments.data.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                        {apt.patient?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 leading-none">{apt.patient?.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{apt.appointment_time}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-slate-700">Dr. {apt.doctor?.user?.name}</p>
                                                <p className="text-[10px] text-teal-600 font-bold uppercase leading-none mt-1">{apt.doctor?.department}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                                    apt.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                    'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-teal-600 transition-all">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No appointments scheduled for today</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sidebar widgets */}
                    <div className="space-y-8">
                        {/* Demographics */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-fit">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6 uppercase tracking-widest text-xs opacity-50">Patient Demographics</h3>
                            <div className="space-y-4">
                                {Object.entries(demographics).map(([gender, count]) => (
                                    <div key={gender}>
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-sm font-bold text-slate-600">{gender}</span>
                                            <span className="text-sm font-black text-slate-800">{count}</span>
                                        </div>
                                        <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${gender === 'Male' ? 'bg-blue-500' : gender === 'Female' ? 'bg-teal-500' : 'bg-slate-300'}`} 
                                                style={{ width: `${(count / stats.patients) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Available Doctors List */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-fit">
                            <h4 className="text-lg font-black text-slate-800 tracking-tight mb-6 inline-flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                Available Doctors
                            </h4>
                            <div className="space-y-5">
                                {availableDoctors.map((doc) => (
                                    <div key={doc.id} className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                                            <img src={`https://ui-avatars.com/api/?name=${doc.user?.name}&background=f8fafc&color=0d9488`} alt="" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 leading-none">Dr. {doc.user?.name}</p>
                                            <p className="text-[10px] text-teal-600 font-bold uppercase mt-1 tracking-wider">{doc.department}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
