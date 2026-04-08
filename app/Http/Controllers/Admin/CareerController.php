<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Career;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CareerController extends Controller
{
    public function index()
    {
        $careers = Career::latest()->paginate(10);
        return Inertia::render('Admin/Careers/Index', [
            'careers' => $careers
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'salary' => 'nullable|string|max:100',
            'location' => 'required|string|max:255',
            'status' => 'required|boolean',
        ]);

        Career::create($data);

        return redirect()->route('admin.careers.index')->with('success', 'Career opening created successfully');
    }

    public function update(Request $request, Career $career)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'salary' => 'nullable|string|max:100',
            'location' => 'required|string|max:255',
            'status' => 'required|boolean',
        ]);

        $career->update($data);

        return redirect()->route('admin.careers.index')->with('success', 'Career opening updated successfully');
    }

    public function destroy(Career $career)
    {
        $career->delete();
        return redirect()->route('admin.careers.index')->with('success', 'Career opening deleted successfully');
    }

    public function toggleStatus(Career $career)
    {
        $career->status = !$career->status;
        $career->save();
        return back()->with('success', 'Status toggled successfully');
    }
}
