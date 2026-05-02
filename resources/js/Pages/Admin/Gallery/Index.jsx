import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Index({ galleries }) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [editingGallery, setEditingGallery] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        image: null,
        title: '',
    });

    useEffect(() => {
        if (!data.image) {
            return;
        }

        const objectUrl = URL.createObjectURL(data.image);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [data.image]);

    const openCreateModal = () => {
        reset();
        setEditingGallery(null);
        setPreviewUrl('');
        setIsUploadModalOpen(true);
    };

    const openEditModal = (gallery) => {
        reset();
        setEditingGallery(gallery);
        setData({
            image: null,
            title: gallery.title || '',
        });
        setPreviewUrl(gallery.url);
        setIsUploadModalOpen(true);
    };

    const closeModal = () => {
        setIsUploadModalOpen(false);
        setEditingGallery(null);
        setPreviewUrl('');
        reset();
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const submit = (e) => {
        e.preventDefault();

        if (!window.confirm(editingGallery ? 'Update this image?' : 'Upload this image to the gallery?')) {
            return;
        }

        const options = {
            forceFormData: true,
            onSuccess: () => {
                closeModal();
            },
        };

        if (editingGallery) {
            put(route('admin.gallery.update', editingGallery.id), options);
        } else {
            post(route('admin.gallery.store'), options);
        }
    };

    const deleteImage = (id) => {
        if (window.confirm('Delete this image?')) {
            router.delete(route('admin.gallery.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Media Gallery" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">Media Gallery</h1>
                        <p className="text-sm text-slate-500 font-medium">Manage hospital photos and facility images</p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="sm:flex inline-flex justify-center bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors shadow-lg items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Upload Image
                    </button>
                </div>

                {galleries.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {galleries.map((img) => (
                            <div key={img.id} className="group relative bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200 aspect-video hover:shadow-md transition-all">
                                <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                                    <div></div>
                                    <div>
                                        <p className="text-white font-semibold text-sm truncate">{img.title || 'Untitled'}</p>
                                        <p className="text-white/60 text-xs mt-1">{new Date(img.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => openEditModal(img)}
                                    className="absolute top-3 left-3 p-2 bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L9.172 19H7v-2.172L15.586 6.414z" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={() => deleteImage(img.id)}
                                    className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-6 py-16 text-center">
                        <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-slate-500 font-medium">No images added yet</p>
                        <button 
                            onClick={openCreateModal}
                            className="mt-4 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors"
                        >
                            Upload First Image
                        </button>
                    </div>
                )}

                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-0 sm:px-4 py-0 sm:py-6 bg-slate-900/50 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-lg rounded-t-xl sm:rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                    {editingGallery ? 'Edit Image' : 'Upload Image'}
                                </h3>
                                <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={submit} className="p-4 sm:p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-2">Image Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-2">Image</label>
                                    <div
                                        onClick={openFilePicker}
                                        className="relative cursor-pointer overflow-hidden rounded-lg border border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={e => setData('image', e.target.files[0])}
                                            className="hidden"
                                        />

                                        <div className="aspect-video w-full">
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                                                    <svg className="mb-3 h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-sm font-semibold text-slate-600">Tap anywhere to select image</p>
                                                    <p className="mt-1 text-xs text-slate-500">Max 5MB • JPG, PNG</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 bg-slate-900/70 px-4 py-2">
                                            <p className="text-xs font-semibold text-white">
                                                {data.image ? data.image.name : editingGallery ? 'Current image preview' : 'Choose an image'}
                                            </p>
                                        </div>
                                    </div>
                                    {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : editingGallery ? 'Update' : 'Upload'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
