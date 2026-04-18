<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display the admin login page.
     */
    public function login()
    {
        if (Auth::check() && Auth::user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/Login');
    }

    /**
     * Handle admin authentication.
     */
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->onlyInput('email');
        }

        if ($user->role !== 'admin') {
            return back()->withErrors([
                'email' => 'Access denied. Admins only.',
            ]);
        }

        Auth::login($user);
        $user->forceFill([
            'expo_push_token' => $request->input('expo_push_token'),
        ])->save();
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    /**
     * Display the admin dashboard.
     */
    public function dashboard()
    {
        $today = Carbon::today()->format('Y-m-d');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'patients' => Patient::count(),
                'doctors' => Doctor::count(),
                'appointments' => Appointment::count(),
                'revenue' => number_format(\Illuminate\Support\Facades\DB::table('payments')->sum('paid_amount'), 2),
            ],
            'todayAppointments' => Appointment::with(['doctor.user', 'patient'])
                ->where('appointment_date', $today)
                ->latest()
                ->paginate(10),
            'availableDoctors' => Doctor::with('user')
                ->where('status', '1')
                ->get(),
            'upcomingAppointments' => Appointment::with(['doctor.user', 'patient'])
                ->where('appointment_date', '>', $today)
                ->orderBy('appointment_date')
                ->take(5)
                ->get(),
            'demographics' => [
                'Male' => Patient::where('gender', 'male')->count(),
                'Female' => Patient::where('gender', 'female')->count(),
                'Other' => Patient::whereNotIn('gender', ['male', 'female'])->count(),
            ],
            'statusCounts' => Appointment::where('appointment_date', $today)
                ->select('status')
                ->groupBy('status')
                ->get()
                ->pluck('status')
                ->countBy(),
        ]);
    }

    /**
     * Logout the admin.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
