<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $departments = Department::withCount('doctors')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Departments/Index', [
            'departments' => $departments,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
            'description' => 'nullable|string|max:1000',
            'status' => 'required|in:0,1',
        ]);

        Department::create([
            'name' => $data['name'],
            'description' => $data['description'],
            'status' => $data['status'],
        ]);

        return redirect()->route('admin.departments.index')->with('success', 'Department created successfully');
    }

    public function update(Request $request, Department $department)
    {
        $data = $request->validate([
            'name' => "required|string|max:255|unique:departments,name,{$department->id}",
            'description' => 'nullable|string|max:1000',
            'status' => 'required|in:0,1',
        ]);

        $department->update($data);

        return redirect()->route('admin.departments.index')->with('success', 'Department updated successfully');
    }

    public function destroy(Department $department)
    {
        if ($department->doctors()->count() > 0) {
            return back()->with('error', 'Cannot delete department with active doctors.');
        }

        $department->delete();

        return redirect()->route('admin.departments.index')->with('success', 'Department deleted successfully');
    }
}
