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
            <Head title="Doctor Dashboard" />

            <div className="space-y-10">
                {/* Hero / Greeting */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                    <div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Good day, Dr. {doctor.name}</h2>
                        <p className="text-slate-500 font-medium mt-1">Here is the clinical overview for {new Date(filters.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <button 
                        onClick={() => setIsAvailabilityOpen(true)}
                        className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-teal-500/20 active:scale-95 flex items-center gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Update Availability
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Total Rounds</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-800 tracking-tighter">{stats.total}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Patients</span>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">Confirmed</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-emerald-600 tracking-tighter">{stats.completed}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Booked</span>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-3">Waitlist</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-amber-500 tracking-tighter">{stats.pending}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Pending</span>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-3">Cancelled</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-red-600 tracking-tighter">{stats.cancelled}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Alerts</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Today's Schedule</h3>
                            <div className="flex items-center gap-4">
                                <form onSubmit={handleSearch} className="relative">
                                    <input 
                                        type="text" 
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Find patient..."
                                        className="pl-10 pr-4 py-2.5 bg-white border-slate-100 rounded-xl focus:ring-2 focus:ring-teal-500 text-sm font-bold shadow-sm"
                                    />
                                    <svg className="w-4 h-4 absolute left-3.5 top-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </form>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Name</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {appointments.length > 0 ? appointments.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-slate-800">{apt.appointment_time || '09:00 AM'}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs uppercase">
                                                        {apt.patient?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800">{apt.patient?.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{apt.appointment_no}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                    apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Link 
                                                    href={route('doctor.appointment.show', apt.id)}
                                                    className="text-teal-600 hover:text-teal-800 font-black text-[10px] uppercase tracking-widest bg-teal-50 px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm inline-block"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-20 text-center">
                                                <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.3em]">No medical records found for this date</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Calendar Widget */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-2">Calendar Navigation</h4>
                            <input 
                                type="date" 
                                value={filters.date}
                                onChange={e => handleDateChange(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 font-black text-slate-700"
                            />
                        </div>

                        {/* Recent Notes / Alert */}
                        <div className="bg-teal-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-teal-900/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-10">
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                            </div>
                            <h4 className="text-[10px] font-black text-teal-300 uppercase tracking-[0.3em] mb-6">Clinician Notice</h4>
                            <p className="font-bold relative z-10 text-lg leading-relaxed">Please ensure patient records are updated within 1 hour of consultation.</p>
                            <button className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Review Protocol</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Availability Modal */}
            {isAvailabilityOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Clinical Availability</h3>
                            <button onClick={() => setIsAvailabilityOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-12 space-y-8">
                            <p className="text-sm font-medium text-slate-500 text-center mb-4">Select the days you are available for patient consultations.</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {daysList.map(day => (
                                    <button 
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest outline-none transition-all ${
                                            availData.available_days.includes(day)
                                            ? 'bg-teal-600 text-white shadow-xl shadow-teal-500/30 ring-4 ring-teal-500/10'
                                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={saveAvailability}
                                disabled={availProcessing}
                                className="w-full mt-6 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl"
                            >
                                {availProcessing ? 'Saving Adjustments...' : 'Confirm Availability'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DoctorLayout>
    );
}
