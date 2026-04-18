<?php

namespace App\Http\Controllers\Reception;

use App\Events\AppointmentBooked;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ReceptionController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Reception/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:4',
        ]);

        if (Auth::attempt($credentials, $request->remember)) {
            $user = Auth::user();

            if ($user->role !== 'reception') {
                Auth::logout();
                return back()->withErrors(['email' => 'Unauthorized access. Only reception can log in here.']);
            }

            if (isset($user->isActive) && !$user->isActive) {
                Auth::logout();
                return back()->withErrors(['email' => 'Your account is currently inactive.']);
            }

            $user->forceFill([
                'expo_push_token' => $request->input('expo_push_token'),
            ])->save();

            $request->session()->regenerate();
            return redirect()->intended(route('reception.dashboard'));
        }

        return back()->withErrors(['email' => 'Invalid email or password.']);
    }

    public function dashboard(Request $request)
    {
        $selectedDate = $request->input('date', 'today');
        $search = $request->input('search');

        if ($selectedDate === 'tomorrow') {
            $dateString = now()->addDay()->toDateString();
        } elseif ($selectedDate === 'today' || !$selectedDate) {
            $dateString = now()->toDateString();
        } else {
            $dateString = $selectedDate;
        }

        $appointments = Appointment::with(['patient', 'doctor.user', 'payment'])
            ->whereDate('appointment_date', $dateString)
            ->when($search, function ($query, $search) {
                $query->whereHas('patient', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get();

        return Inertia::render('Reception/Dashboard', [
            'appointments' => $appointments,
            'filters' => [
                'date' => $selectedDate,
                'search' => $search,
            ],
            'doctors' => Doctor::with(['user', 'department'])->get(),
            'stats' => [
                'total' => $appointments->count(),
                'checked_in' => $appointments->where('status', 'checked_in')->count(),
                'cancelled' => $appointments->where('status', 'cancelled')->count(),
            ]
        ]);
    }

    public function storeAppointment(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|digits:10',
            'age' => 'required|numeric|between:0,150',
            'gender' => 'required|in:male,female,other,Male,Female,Other',
            'address' => 'required|string',
            'city' => 'required|string',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'amount' => 'required|numeric|min:0',
            'settlement' => 'boolean',
        ]);

        $gender = strtolower((string) $request->gender);
        $appointmentTimeInput = trim((string) $request->appointment_time);

        try {
            if (preg_match('/\b(am|pm)\b/i', $appointmentTimeInput)) {
                $appointmentTime = Carbon::createFromFormat('h:i A', strtoupper($appointmentTimeInput))->format('H:i:00');
            } elseif (preg_match('/^\d{1,2}:\d{2}$/', $appointmentTimeInput)) {
                $appointmentTime = Carbon::createFromFormat('H:i', $appointmentTimeInput)->format('H:i:00');
            } elseif (preg_match('/^\d{1,2}:\d{2}:\d{2}$/', $appointmentTimeInput)) {
                $appointmentTime = Carbon::createFromFormat('H:i:s', $appointmentTimeInput)->format('H:i:00');
            } else {
                $appointmentTime = Carbon::parse($appointmentTimeInput)->format('H:i:00');
            }
        } catch (\Throwable $e) {
            $appointmentTime = $appointmentTimeInput;
        }

        $appointmentDate = Carbon::parse($request->appointment_date);

        if ($appointmentDate->copy()->startOfDay()->lt(Carbon::today())) {
            return back()->withErrors([
                'appointment_date' => 'Past dates are not allowed for reception booking.',
            ]);
        }

        if ($appointmentDate->isSameDay(Carbon::now())) {
            $slotStart = Carbon::parse($request->appointment_date . ' ' . $appointmentTime);
            $slotEnd = (clone $slotStart)->addMinutes(30);

            if (Carbon::now()->gte($slotEnd)) {
                return back()->withErrors([
                    'appointment_time' => 'Past time slots are not allowed. Please choose a current or upcoming slot.',
                ]);
            }
        }

        $patient = Patient::where('name', $request->name)
            ->where('phone', $request->phone)
            ->first();

        if (!$patient) {
            $patient = Patient::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'age' => $request->age,
                'gender' => $gender,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state ?? 'Bihar',
                'country' => $request->country ?? 'India',
            ]);
        }

        $slotCount = Appointment::query()
            ->where('doctor_id', $request->doctor_id)
            ->whereDate('appointment_date', $request->appointment_date)
            ->where('appointment_time', $appointmentTime)
            ->count();

        if ($slotCount >= 4) {
            return back()->withErrors([
                'appointment_time' => 'This time slot is fully booked. Please choose another slot.',
            ]);
        }

        $lastQueueNumber = Appointment::where('doctor_id', $request->doctor_id)
            ->whereDate('appointment_date', $request->appointment_date)
            ->max('queue_number');

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $request->doctor_id,
            'appointment_date' => $request->appointment_date,
            'appointment_time' => $appointmentTime,
            'queue_number' => ($lastQueueNumber ?? 0) + 1,
            'status' => 'confirmed',
            'notes' => $request->notes,
            'created_by' => auth()->id(),
        ]);

        $datePrefix = Carbon::parse($appointment->appointment_date)->format('Ymd');
        $appointment->update([
            'appointment_no' => intval($datePrefix . str_pad($appointment->id, 4, '0', STR_PAD_LEFT))
        ]);

        $appointment->payment()->create([
            'appointment_id' => $appointment->id,
            'paid_amount' => $request->amount,
            'mode' => 'Cash',
            'settlement' => $request->settlement,
            'status' => $request->settlement ? 'paid' : 'due',
        ]);

        $appointment->load(['patient', 'doctor.user', 'doctor.department', 'payment']);
        event(new AppointmentBooked($appointment));

        return back()->with('success', 'Appointment booked successfully.');
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $statusInput = (string) $request->input('status');
        $status = $statusInput;

        if (in_array($statusInput, ['completed', 'success'], true)) {
            $status = 'confirmed';
        }

        if (!in_array($status, ['pending', 'confirmed', 'checked_in', 'cancelled'], true)) {
            return back()->withErrors([
                'status' => 'Invalid status selected.'
            ]);
        }

        $appointment->update(['status' => $status]);
        return back()->with('success', 'Status updated successfully.');
    }

    public function edit(Appointment $appointment)
    {
        $appointment->load(['patient', 'doctor.user', 'doctor.department', 'payment']);
        return Inertia::render('Reception/EditAppointment', [
            'appointment' => $appointment,
            'doctors' => Doctor::with(['user', 'department'])->get(),
        ]);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|digits:10',
            'age' => 'required|numeric|between:0,150',
            'gender' => 'required|in:Male,Female,Other',
            'address' => 'required|string',
            'city' => 'required|string',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'notes' => 'nullable|string|max:255',
        ]);

        $appointment->patient->update([
            'name' => $data['name'],
            'phone' => $data['phone'],
            'age' => $data['age'],
            'gender' => $data['gender'],
            'address' => $data['address'],
            'city' => $data['city'],
        ]);

        $appointment->update([
            'doctor_id' => $data['doctor_id'],
            'appointment_date' => $data['appointment_date'],
            'appointment_time' => $data['appointment_time'],
            'notes' => $data['notes'],
        ]);

        return redirect()->route('reception.dashboard')->with('success', 'Appointment updated successfully.');
    }

    public function collectPayment(Appointment $appointment)
    {
        $appointment->payment->update([
            'paid_amount' => $appointment->doctor->fee,
            'status' => 'paid',
            'settlement' => true,
        ]);
        return back()->with('success', 'Payment collected successfully.');
    }

    public function downloadTomorrowPDF(Request $request)
    {
        $doctorId = $request->input('doctor_id');
        $tomorrow = Carbon::tomorrow()->toDateString();

        $query = Appointment::with(['patient', 'doctor.user'])
            ->whereDate('appointment_date', $tomorrow);

        if ($doctorId) {
            $query->where('doctor_id', $doctorId);
        }

        $appointments = $query->get();

        if ($appointments->isEmpty()) {
            return back()->with('error', 'No appointments found for tomorrow');
        }

        $pdf = Pdf::loadView('pdf.tomorrow-appointments', compact('appointments'));

        return $pdf->download("appointments_{$tomorrow}.pdf");
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('reception.login');
    }
}
