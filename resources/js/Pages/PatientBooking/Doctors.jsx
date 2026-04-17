import { Link, Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function Doctors({ doctors }) {
    const [search, setSearch] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    const departments = useMemo(() => {
        const departmentSet = new Set(
            doctors
                .map((user) => user.doctor?.department?.name)
                .filter(Boolean)
        );

        return ['all', ...Array.from(departmentSet)];
    }, [doctors]);

    const filteredDoctors = doctors.filter(user => {
        const doc = user.doctor;
        if (!doc) return false;

        if (selectedDepartment !== 'all' && doc.department?.name !== selectedDepartment) {
            return false;
        }
        
        const searchLower = search.toLowerCase();
        return (
            user.name.toLowerCase().includes(searchLower) ||
            doc.department?.name?.toLowerCase().includes(searchLower) ||
            (Array.isArray(doc.qualification)
                ? doc.qualification.join(', ').toLowerCase().includes(searchLower)
                : String(doc.qualification || '').toLowerCase().includes(searchLower))
        );
    });

    return (
        <div className="public-page min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden pb-16 lg:pb-0 flex flex-col">
            <Head title="Our Doctors | Healing Touch Hospital" />
            <Header />
            
            <main className="flex-1 w-full pt-24 sm:pt-28 pb-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Meet Our Expert Doctors</h1>
                        <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">Browse specialists and quickly book consultations with trusted professionals.</p>
                        <div className="mt-3 flex justify-center">
                            <div className="h-1 w-20 bg-beige-600 rounded-full"></div>
                        </div>
                    </div>

                    <div className="sticky top-20 sm:top-24 z-20 mb-6 sm:mb-8">
                        <div className="bg-white/95 backdrop-blur rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4">
                            <div className="relative w-full mb-3">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, specialty, or expertise..."
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-beige-500 focus:border-beige-500 focus:outline-none text-sm sm:text-base"
                                />
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {departments.map((department) => (
                                    <button
                                        key={department}
                                        type="button"
                                        onClick={() => setSelectedDepartment(department)}
                                        className={`snap-start shrink-0 rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                                            selectedDepartment === department
                                                ? 'bg-beige-600 border-beige-600 text-white'
                                                : 'bg-white border-gray-200 text-gray-700 hover:bg-beige-50 hover:border-beige-200'
                                        }`}
                                    >
                                        {department === 'all' ? 'All Departments' : department}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((user) => (
                                <Link
                                    key={user.id}
                                    href={route('doctors.detail', user.doctor.slug)}
                                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
                                >
                                    <div className="p-4 sm:p-5 flex-grow">
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-beige-200"
                                                    src={user.doctor.image || '/images/default.jpg'}
                                                    alt={`Dr. ${user.name}`}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">Dr. {user.name}</h3>
                                                <p className="text-xs sm:text-sm font-semibold text-beige-600 truncate">{user.doctor.department?.name || 'General'}</p>
                                                <p className="mt-1 text-xs sm:text-sm font-medium text-gray-600 line-clamp-2">
                                                    {Array.isArray(user.doctor.qualification)
                                                        ? user.doctor.qualification.join(', ')
                                                        : user.doctor.qualification || '-'}
                                                </p>
                                                <p className="mt-2 text-xs text-gray-500 line-clamp-1">
                                                    Available: {user.doctor.available_days && Array.isArray(user.doctor.available_days)
                                                        ? user.doctor.available_days.join(', ')
                                                        : '-'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-4 h-4" fill="#906A39" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 mt-auto">
                                        <span className="inline-flex items-center text-sm font-semibold text-beige-700 group-hover:text-beige-800">
                                            View Profile
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-16 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-xl font-medium text-gray-900">No doctors found</h3>
                                <p className="mt-1 text-gray-500">Try adjusting your search criteria.</p>
                            </div>
                        )}
                    </div>

                    <div className="sm:hidden fixed bottom-20 right-4 z-40">
                        <Link href={route('contact.page')} className="inline-flex items-center gap-2 bg-beige-600 hover:bg-beige-700 text-white rounded-full border border-beige-600 py-3 px-4 shadow-lg transition-colors duration-150">
                            <span className="text-base">📞</span>
                            <span className="text-sm font-semibold">Need Help</span>
                        </Link>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
