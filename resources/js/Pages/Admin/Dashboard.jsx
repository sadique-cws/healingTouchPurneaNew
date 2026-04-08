import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats, todayAppointments, availableDoctors, demographics, statusCounts }) {
    
    const statCards = [
        { name: 'Total Patients', value: stats.patients, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'bg-teal-600' },
        { name: 'Active Doctors', value: stats.doctors, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'bg-[#006a63]' },
        { name: 'Today Appointments', value: stats.appointments, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-[#008378]' },
        { name: 'Net Revenue', value: `₹${stats.revenue}`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', color: 'bg-[#00685f]' },
    ];

    return (
        <AdminLayout>
            <Head title="Clinical Dashboard" />
            
            <div className="space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-5xl font-black text-[#0d1c2e] tracking-tight font-manrope leading-none">
                            Hospital Analytics
                        </h1>
                        <p className="text-[#0d1c2e]/40 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">
                            Operational Intelligence &bull; {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {statCards.map((stat) => (
                        <div key={stat.name} className="card-ethereal p-8 flex items-center space-x-6 hover:translate-y-[-4px]">
                            <div className={`w-16 h-16 ${stat.color} rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-teal-900/10 rotate-3`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#0d1c2e]/30 uppercase tracking-[0.2em]">{stat.name}</p>
                                <p className="text-3xl font-black text-[#0d1c2e] tracking-tighter leading-none mt-1">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Today's Appointments Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-end">
                            <h2 className="text-2xl font-black text-[#0d1c2e] tracking-tight font-manrope">Today's Patient Queue</h2>
                            <button className="text-[10px] font-black text-[#00685f] hover:text-[#008378] uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-[#00685f] transition-all pb-1">Historical Logs</button>
                        </div>
                        <div className="card-ethereal overflow-hidden rounded-[2.5rem]">
                            <table className="w-full text-left">
                                <thead className="bg-[#eff4ff]">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-[#0d1c2e]/40 uppercase tracking-[0.2em]">Patient Profile</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-[#0d1c2e]/40 uppercase tracking-[0.2em]">Medical Officer</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-[#0d1c2e]/40 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-[#0d1c2e]/40 uppercase tracking-[0.2em] text-right">Activity</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {todayAppointments.data.length > 0 ? todayAppointments.data.map((apt) => (
                                        <tr key={apt.id} className="group hover:bg-[#eff4ff]/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-[#eff4ff] flex items-center justify-center text-xs font-black text-[#00685f]">
                                                        {apt.patient?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-[#0d1c2e] leading-none">{apt.patient?.name}</p>
                                                        <p className="text-[10px] text-[#0d1c2e]/40 font-bold uppercase mt-1.5 tracking-wider">{apt.appointment_time}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-[#0d1c2e]/80">Dr. {apt.doctor?.user?.name}</p>
                                                <p className="text-[10px] text-[#00685f] font-black uppercase leading-none mt-1.5 tracking-widest">{apt.doctor?.department}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`status-pill ${
                                                    apt.status === 'Completed' ? 'status-accepted' :
                                                    apt.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                    'status-pending'
                                                }`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-3 bg-[#eff4ff] rounded-xl text-[#00685f]/40 group-hover:text-[#00685f] group-hover:bg-white transition-all shadow-sm group-hover:shadow-md">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center opacity-20">
                                                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    <p className="text-[#0d1c2e] font-black uppercase tracking-[0.3em] text-[10px]">No Active Patients</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sidebar widgets */}
                    <div className="space-y-12">
                        {/* Demographics */}
                        <div className="card-ethereal p-10 bg-[#0d1c2e] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-32 h-32 rotate-12 translate-x-8 -translate-y-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-8 relative z-10">Patient Population</h3>
                            <div className="space-y-6 relative z-10">
                                {Object.entries(demographics).map(([gender, count]) => (
                                    <div key={gender}>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-bold text-white/60 tracking-wider">{gender}</span>
                                            <span className="text-sm font-black text-white">{count}</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${gender === 'Male' ? 'bg-teal-500' : gender === 'Female' ? 'bg-teal-300' : 'bg-white/40'}`} 
                                                style={{ width: `${(count / (stats.patients || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Available Doctors List */}
                        <div className="card-ethereal p-10">
                            <h4 className="text-sm font-black text-[#0d1c2e] font-manrope mb-8 inline-flex items-center gap-3">
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></span>
                                Clinical Staff Online
                            </h4>
                            <div className="space-y-6">
                                {availableDoctors.map((doc) => (
                                    <div key={doc.id} className="flex items-center space-x-5 group cursor-pointer">
                                        <div className="w-12 h-12 rounded-2xl bg-[#eff4ff] flex items-center justify-center border-none overflow-hidden group-hover:scale-105 transition-transform shadow-sm">
                                            <img src={`https://ui-avatars.com/api/?name=${doc.user?.name}&background=eff4ff&color=00685f&bold=true`} alt="" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-[#0d1c2e] leading-none group-hover:text-[#00685f] transition-colors">Dr. {doc.user?.name}</p>
                                            <p className="text-[10px] text-[#00685f]/60 font-black uppercase mt-1.5 tracking-widest">{doc.department}</p>
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

