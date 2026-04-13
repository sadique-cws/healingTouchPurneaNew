import DoctorLayout from '@/Layouts/DoctorLayout';
import { Head, router, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ doctor, appointments, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

    const { data: availData, setData: setAvailData, post: postAvail, processing: availProcessing } = useForm({
        available_days: doctor.available_days || [],
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('doctor.dashboard'), { ...filters, search }, { preserveState: true });
    };

    const handleDateChange = (date) => {
        router.get(route('doctor.dashboard'), { ...filters, date }, { preserveState: true });
    };

    const toggleDay = (day) => {
        const days = availData.available_days.includes(day)
            ? availData.available_days.filter(d => d !== day)
            : [...availData.available_days, day];
        setAvailData('available_days', days);
    };

    const saveAvailability = (e) => {
        e.preventDefault();
        postAvail(route('doctor.availability.update'), {
            onSuccess: () => setIsAvailabilityOpen(false)
        });
    };

    const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <DoctorLayout>
            <Head title="Clinical Dashboard" />

            <div className="space-y-6 md:space-y-8">
                {/* Hero / Greeting */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 md:gap-6 card-ethereal p-5 md:p-7 bg-white relative overflow-hidden group rounded-xl">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                        <svg className="w-64 h-64 transform translate-x-12 -translate-y-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-2xl md:text-4xl font-black text-[#0d1c2e] tracking-tight font-manrope leading-tight md:leading-none">
                            Salutations, Dr. {doctor.name}
                        </h1>
                        <p className="text-[#0d1c2e]/40 font-bold uppercase tracking-[0.2em] text-[10px] mt-3 md:mt-4">
                            Clinic Intelligence &bull; {new Date(filters.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsAvailabilityOpen(true)}
                        className="relative z-10 w-full md:w-auto px-6 py-3.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-lg font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-[#00685f]/20 active:scale-95 flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Operational Status
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                    {[
                        { label: 'Total Rounds', value: stats.total, unit: 'Patients', color: 'text-[#0d1c2e]' },
                        { label: 'Clinically Confirmed', value: stats.completed, unit: 'Booked', color: 'text-[#00685f]' },
                        { label: 'Patient Waitlist', value: stats.pending, unit: 'Pending', color: 'text-[#825100]' },
                        { label: 'Critical Alerts', value: stats.cancelled, unit: 'Alerts', color: 'text-red-600' }
                    ].map((stat) => (
                        <div key={stat.label} className="card-ethereal p-5 md:p-6 flex flex-col justify-between h-full bg-white rounded-lg transition-transform hover:translate-y-[-2px]">
                            <p className="text-[10px] font-black text-[#0d1c2e]/30 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                            <div className="flex items-baseline gap-3">
                                <span className={`text-3xl md:text-4xl font-black ${stat.color} tracking-tighter leading-none`}>{stat.value}</span>
                                <span className="text-[10px] font-black text-[#0d1c2e]/20 uppercase tracking-widest">{stat.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="lg:col-span-2 space-y-5 md:space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <h2 className="text-2xl font-black text-[#0d1c2e] tracking-tight font-manrope">Clinical Itinerary</h2>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <form onSubmit={handleSearch} className="relative group">
                                    <input 
                                        type="text" 
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Identify patient..."
                                        className="pl-12 pr-6 py-3.5 bg-white border-none rounded-lg focus:ring-4 focus:ring-[#00685f]/10 text-xs font-black text-[#0d1c2e] shadow-sm group-hover:shadow-md transition-all w-full md:w-72 placeholder:text-[#0d1c2e]/20"
                                    />
                                    <svg className="w-5 h-5 absolute left-4 top-4 text-[#00685f]/30 group-hover:text-[#00685f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </form>
                            </div>
                        </div>

                        <div className="card-ethereal overflow-hidden rounded-lg bg-white">
                            <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[760px]">
                                <thead className="bg-[#eff4ff]">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-[#0d1c2e]/40 uppercase tracking-[0.2em]">Temporal Slot</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-[#0d1c2e]/40 uppercase tracking-[0.2em]">Patient Credentials</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-[#0d1c2e]/40 uppercase tracking-[0.2em]">Clinical Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-[#0d1c2e]/40 uppercase tracking-[0.2em] text-right">Observation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f8f9ff]">
                                    {appointments.length > 0 ? appointments.map((apt) => (
                                        <tr key={apt.id} className="group hover:bg-[#eff4ff]/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-black text-[#0d1c2e] leading-none">{apt.appointment_time || '09:00 AM'}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-11 h-11 bg-[#eff4ff] rounded-lg flex items-center justify-center font-black text-[#00685f] text-xs uppercase shadow-sm">
                                                        {apt.patient?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-[#0d1c2e] leading-none uppercase tracking-tight">{apt.patient?.name}</p>
                                                        <p className="text-[10px] font-black text-[#0d1c2e]/30 uppercase tracking-[0.2em] mt-2 italic">{apt.appointment_no}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`status-pill ${
                                                    apt.status === 'confirmed' ? 'status-accepted' : 'status-pending'
                                                }`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link 
                                                    href={route('doctor.appointment.show', apt.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#eff4ff] hover:bg-white text-[#00685f] font-black text-[10px] uppercase tracking-[0.2em] rounded-lg transition-all active:scale-95 shadow-sm hover:shadow-md border-none"
                                                >
                                                    Access File
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center opacity-20">
                                                    <svg className="w-16 h-16 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                    <p className="text-[#0d1c2e] font-black text-[11px] uppercase tracking-[0.3em]">No medical records found for this date</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 md:space-y-8">
                        {/* Calendar Widget */}
                        <div className="card-ethereal p-5 md:p-6 bg-white rounded-lg">
                            <h4 className="text-[10px] font-black text-[#0d1c2e]/40 uppercase tracking-[0.3em] mb-8 px-2">Temporal Navigation</h4>
                            <input 
                                type="date" 
                                value={filters.date}
                                onChange={e => handleDateChange(e.target.value)}
                                className="w-full px-4 py-3.5 bg-[#f8f9ff] border-none rounded-lg focus:ring-4 focus:ring-[#00685f]/10 font-black text-[#0d1c2e] text-center tracking-widest uppercase cursor-pointer transition-all"
                            />
                        </div>

                        {/* Recent Notes / Alert */}
                        <div className="card-ethereal bg-[#0d1c2e] text-white p-6 md:p-8 relative overflow-hidden group rounded-lg">
                            <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-48 h-48 translate-x-12 -translate-y-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                            </div>
                            <h4 className="text-[10px] font-black text-[#00685f] uppercase tracking-[0.4em] mb-8 relative z-10">Institutional Notice</h4>
                            <p className="font-bold relative z-10 text-base md:text-xl leading-relaxed tracking-tight font-manrope">Please ensure clinical documentation is finalized within 60 minutes of session termination.</p>
                            <button className="relative z-10 mt-6 px-6 py-3 bg-white/5 hover:bg-[#00685f] rounded-lg text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/10 hover:border-transparent">Review Protocol</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Availability Modal */}
            {isAvailabilityOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-[#0d1c2e]/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[92vh] overflow-y-auto">
                        <div className="p-6 md:p-8 border-b border-[#f8f9ff] flex justify-between items-center bg-[#eff4ff]/30">
                            <div>
                                <h3 className="text-3xl font-black text-[#0d1c2e] tracking-tighter font-manrope leading-none">Operational Status</h3>
                                <p className="text-[10px] font-black text-[#00685f] uppercase tracking-[0.4em] mt-3">Duty Schedule Management</p>
                            </div>
                            <button onClick={() => setIsAvailabilityOpen(false)} className="p-3 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md">
                                <svg className="w-6 h-6 text-[#0d1c2e]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                            <p className="text-[12px] font-bold text-[#0d1c2e]/50 text-center leading-relaxed tracking-wide px-4">Maintain institutional accuracy by validating your clinical availability for the upcoming session cycle.</p>
                            
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                {daysList.map(day => (
                                    <button 
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`py-3.5 rounded-lg font-black text-[11px] uppercase tracking-[0.2em] outline-none transition-all duration-300 ${
                                            availData.available_days.includes(day)
                                            ? 'bg-[#00685f] text-white shadow-2xl shadow-[#00685f]/20 scale-[1.05]'
                                            : 'bg-[#f8f9ff] text-[#0d1c2e]/30 hover:bg-[#eff4ff] hover:text-[#0d1c2e]'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={saveAvailability}
                                disabled={availProcessing}
                                className="w-full mt-4 py-4 bg-[#0d1c2e] hover:bg-black text-white rounded-lg font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-500 active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-black/20"
                            >
                                {availProcessing ? 'Processing Changes...' : 'Authorize Schedule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DoctorLayout>
    );
}

