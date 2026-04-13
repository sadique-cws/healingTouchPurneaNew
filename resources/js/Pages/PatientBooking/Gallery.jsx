import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';

export default function Gallery({ images = [] }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Gallery" />
            <Header />

            <div className="max-w-6xl mx-auto px-4 pt-32 pb-12">
                <h1 className="text-3xl font-bold text-gray-900">Hospital Gallery</h1>
                <p className="text-gray-600 mt-2">Facilities and moments from our care center.</p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.length ? images.map((image) => (
                        <div key={image.id} className="bg-white rounded-xl border border-gray-100 p-2 shadow-sm">
                            <img src={image.url || image.filename} alt={image.alt || image.title || 'Gallery image'} className="w-full h-56 object-cover rounded-lg" />
                            {(image.title || image.alt) && (
                                <p className="text-sm text-gray-700 mt-2 px-1">{image.title || image.alt}</p>
                            )}
                        </div>
                    )) : (
                        <div className="col-span-full bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">No gallery images found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
