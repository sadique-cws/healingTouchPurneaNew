<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Doctor/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if (Auth::attempt($credentials, $request->remember)) {
            if (auth()->user()->role === 'doctor') {
                auth()->user()->forceFill([
                    'expo_push_token' => $request->input('expo_push_token'),
                ])->save();
                $request->session()->regenerate();
                return redirect()->intended(route('doctor.dashboard'));
            }

            Auth::logout();
            return back()->withErrors(['email' => 'Access denied. Only doctors can log in here.']);
        }

        return back()->withErrors(['email' => 'Invalid email or password.']);
    }

    public function dashboard(Request $request)
    {
        $user = auth()->user();
        $doctor = $user->doctor;
        
        $dateFilter = $request->input('date', now()->toDateString());
        $search = $request->input('search');

        $appointmentsQuery = Appointment::with('patient')
            ->where('doctor_id', $doctor->id)
            ->whereDate('appointment_date', $dateFilter)
            ->when($search, function ($query, $search) {
                $query->whereHas('patient', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            });

        $appointments = $appointmentsQuery->get();

        return Inertia::render('Doctor/Dashboard', [
            'doctor' => [
                'name' => $user->name,
                'image' => $doctor->image,
                'available_days' => $doctor->available_days,
            ],
            'appointments' => $appointments,
            'filters' => [
                'date' => $dateFilter,
                'search' => $search,
            ],
            'stats' => [
                'total' => $appointments->count(),
                'completed' => $appointments->where('status', 'confirmed')->count(),
                'pending' => $appointments->where('status', 'pending')->count(),
                'cancelled' => $appointments->where('status', 'cancelled')->count(),
            ]
        ]);
    }

    public function show(Appointment $appointment)
    {
        $doctor = auth()->user()->doctor;
        
        if ($appointment->doctor_id !== $doctor->id) {
            abort(403);
        }

        $appointment->load(['patient', 'payment', 'doctor.department', 'doctor.user']);

        return Inertia::render('Doctor/PatientDetails', [
            'appointment' => $appointment,
            'doctor' => [
                'name' => auth()->user()->name,
                'image' => $doctor->image,
            ]
        ]);
    }

    public function updateAvailability(Request $request)
    {
        $request->validate([
            'available_days' => 'required|array',
        ]);

        $doctor = auth()->user()->doctor;
        $doctor->update(['available_days' => $request->available_days]);

        return back()->with('success', 'Availability updated successfully');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('doctor.login');
    }
}
