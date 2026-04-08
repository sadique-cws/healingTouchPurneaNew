<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\User;
use App\Helpers\ImageKitHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $doctors = Doctor::with('user', 'department')
            ->when($search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Doctors/Index', [
            'doctors' => $doctors,
            'filters' => $request->only(['search']),
            'departments' => Department::all(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:10',
            'department_id' => 'required|exists:departments,id',
            'available_days' => 'required|array|min:1',
            'status' => 'required|in:0,1,2',
            'image' => 'nullable|image|max:2048',
            'fee' => 'required|numeric|min:0',
            'qualification' => 'required|string|min:1',
            'description' => 'nullable|string|max:1000',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => ucwords(strtolower($data['name'])),
            'email' => $data['email'],
            'phone' => $data['phone'],
            'role' => 'doctor',
            'description' => $data['description'] ?? null,
            'password' => Hash::make($data['password']),
        ]);

        $imageUrl = null;
        $imageFileId = null;

        if ($request->hasFile('image')) {
            $upload = ImageKitHelper::uploadImage($request->file('image'), '/healingtouch/doctors');
            $imageUrl = $upload['url'] ?? null;
            $imageFileId = $upload['fileId'] ?? null;
        }

        Doctor::create([
            'user_id' => $user->id,
            'department_id' => $data['department_id'],
            'status' => $data['status'],
            'fee' => $data['fee'],
            'available_days' => $data['available_days'],
            'qualification' => $data['qualification'],
            'image' => $imageUrl,
            'image_file_id' => $imageFileId,
            'slug' => Str::slug($data['name']),
        ]);

        return redirect()->route('admin.doctors.index')->with('success', 'Doctor added successfully');
    }

    public function update(Request $request, Doctor $doctor)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$doctor->user_id}",
            'phone' => 'required|string|max:10',
            'department_id' => 'required|exists:departments,id',
            'available_days' => 'required|array|min:1',
            'status' => 'required|in:0,1,2',
            'image' => 'nullable|image|max:2048',
            'fee' => 'required|numeric|min:0',
            'qualification' => 'required|string|min:1',
            'description' => 'nullable|string|max:1000',
        ]);

        $doctor->user->update([
            'name' => ucwords(strtolower($data['name'])),
            'email' => $data['email'],
            'phone' => $data['phone'],
            'description' => $data['description'] ?? null,
        ]);

        if ($request->password) {
            $doctor->user->update(['password' => Hash::make($request->password)]);
        }

        if ($request->hasFile('image')) {
            // Optional: Delete old image from ImageKit
            $upload = ImageKitHelper::uploadImage($request->file('image'), '/healingtouch/doctors');
            $doctor->image = $upload['url'] ?? $doctor->image;
            $doctor->image_file_id = $upload['fileId'] ?? $doctor->image_file_id;
        }

        $doctor->update([
            'department_id' => $data['department_id'],
            'status' => $data['status'],
            'fee' => $data['fee'],
            'available_days' => $data['available_days'],
            'qualification' => $data['qualification'],
            'slug' => Str::slug($data['name']),
        ]);

        return redirect()->route('admin.doctors.index')->with('success', 'Doctor updated successfully');
    }

    public function destroy(Doctor $doctor)
    {
        if ($doctor->appointments()->count() > 0) {
            return back()->with('error', 'Cannot delete doctor with existing appointments.');
        }

        $doctor->user->delete();
        $doctor->delete();

        return redirect()->route('admin.doctors.index')->with('success', 'Doctor deleted successfully');
    }

    public function updateStatus(Request $request, Doctor $doctor)
    {
        $request->validate(['status' => 'required|in:0,1,2']);
        $doctor->update(['status' => $request->status]);
        return back()->with('success', 'Status updated successfully');
    }
}
