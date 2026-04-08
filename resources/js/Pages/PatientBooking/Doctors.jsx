import { Link, Head } from '@inertiajs/react';
import { useState } from 'react';
import Header from '@/Components/Header';

export default function Doctors({ doctors }) {
    const [search, setSearch] = useState('');

    const filteredDoctors = doctors.filter(user => {
        const doc = user.doctor;
        if (!doc) return false;
        
        const searchLower = search.toLowerCase();
        return (
            user.name.toLowerCase().includes(searchLower) ||
            doc.department?.name?.toLowerCase().includes(searchLower) ||
            doc.qualification?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden">
            <Head title="Our Doctors | Healing Touch Hospital" />
            <Header />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 to-white pt-32">
                {/* Heading with enhanced styling */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Meet Our Expert</h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">Browse and schedule consultations with our highly qualified medical professionals</p>
                    <div className="mt-2 flex justify-center">
                        <div className="h-1 w-24 bg-beige-600 rounded-full"></div>
                    </div>
                </div>

                {/* Enhanced Search with icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-full md:w-2/3 lg:w-1/2">
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
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-beige-500 focus:border-beige-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Doctor Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((user) => (
                            <div key={user.id} className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                                <Link href="#" className="block h-full"> {/* Detail route to be matched later */}
                                    <div className="p-6 flex-grow">
                                        <div className="flex items-start gap-5">
                                            <div className="flex-shrink-0">
                                                <img
                                                    className="w-20 h-20 rounded-full object-cover border-2 border-beige-100 shadow"
                                                    src={user.doctor.image || '/images/default.jpg'}
                                                    alt={`Dr. ${user.name}`}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-gray-800 truncate">Dr. {user.name}</h3>
                                                <p className="text-sm font-medium text-beige-600 truncate">{user.doctor.department?.name}</p>
                                                <p className="text-sm font-medium text-gray-600 line-clamp-1">{user.doctor.qualification}</p>
                                                <p className="font-medium text-xs line-clamp-1">
                                                    {user.doctor.available_days && Array.isArray(user.doctor.available_days) 
                                                        ? user.doctor.available_days.join(', ') 
                                                        : '-'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-between items-center">
                                            <div className="flex items-center text-amber-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className="w-4 h-4" fill="#906A39" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 mt-auto">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Status Hook Needed
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
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
            </div>
        </div>
    );
}
