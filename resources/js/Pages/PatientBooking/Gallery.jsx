import { Head } from '@inertiajs/react';
import Header from '@/Components/Header';
import PublicFooter from '@/Components/PublicFooter';

export default function Gallery({ images = [] }) {
    return (
        <div className="public-page min-h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-x-hidden pb-16 lg:pb-0 flex flex-col">
            <Head title="Gallery" />
            <Header />

            <main className="max-w-7xl mx-auto w-full px-4 pt-24 sm:pt-28 pb-10">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-gray-900">Hospital Gallery</h1>
                    <p className="text-gray-600 mt-2">Facilities and moments from our care center.</p>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {images.length ? images.map((image) => (
                        <div key={image.id} className="bg-white rounded-lg border border-gray-200 p-2">
                            <img src={image.url || image.filename} alt={image.alt || image.title || 'Gallery image'} className="w-full h-52 object-cover rounded-md" />
                            {(image.title || image.alt) && (
                                <p className="text-sm text-gray-700 mt-2 px-1 line-clamp-2">{image.title || image.alt}</p>
                            )}
                        </div>
                    )) : (
                        <div className="col-span-full bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">No gallery images found.</div>
                    )}
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
