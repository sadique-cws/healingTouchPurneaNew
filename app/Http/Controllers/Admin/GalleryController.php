<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Helpers\ImageKitHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        $galleries = GalleryImage::latest()->get();
        return Inertia::render('Admin/Gallery/Index', [
            'galleries' => $galleries
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
            'title' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            $upload = ImageKitHelper::uploadImage($request->file('image'), '/healingtouch/gallery');

            if (!$upload) {
                return back()->withErrors([
                    'image' => 'Image upload failed. Please try again.',
                ]);
            }

            $originalName = pathinfo($request->file('image')->getClientOriginalName(), PATHINFO_FILENAME);
            
            GalleryImage::create([
                'filename' => $upload['fileName'] ?? $request->file('image')->getClientOriginalName(),
                'title' => $request->title ?: Str::headline($originalName),
                'url' => $upload['url'],
                'file_id' => $upload['fileId'],
            ]);
        }

        return redirect()->route('admin.gallery.index')->with('success', 'Image uploaded successfully');
    }

    public function destroy(GalleryImage $gallery)
    {
        if ($gallery->file_id) {
            ImageKitHelper::deleteImage($gallery->file_id);
        }

        $gallery->delete();
        return redirect()->route('admin.gallery.index')->with('success', 'Image deleted successfully');
    }
}
