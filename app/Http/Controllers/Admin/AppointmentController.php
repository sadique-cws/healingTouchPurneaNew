<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $date = $request->input('date'); // today, tomorrow, range
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $status = $request->input('status');

        $query = Appointment::with(['doctor.user', 'doctor.department', 'patient']);

        if ($date === 'today') {
            $query->whereDate('appointment_date', Carbon::today());
        } elseif ($date === 'tomorrow') {
            $query->whereDate('appointment_date', Carbon::tomorrow());
        } elseif ($startDate && $endDate) {
            $query->whereBetween('appointment_date', [$startDate, $endDate]);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('doctor.user', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                })->orWhereHas('patient', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                })->orWhere('appointment_no', 'like', "%{$search}%");
            });
        }

        $appointments = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Appointments/Index', [
            'appointments' => $appointments,
            'filters' => $request->only(['search', 'date', 'start_date', 'end_date', 'status']),
            'stats' => [
                'today' => Appointment::whereDate('appointment_date', Carbon::today())->count(),
                'pending' => Appointment::where('status', 'Pending')->count(),
                'confirmed' => Appointment::where('status', 'Confirmed')->count(),
            ]
        ]);
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $request->validate(['status' => 'required']);
        $appointment->update(['status' => $request->status]);
        return back()->with('success', 'Appointment status updated.');
    }

    public function downloadReceipt(Appointment $appointment)
    {
        $appointment->load(['doctor.user', 'doctor.department', 'patient']);
        $pdf = Pdf::loadView('pdf.appointment', compact('appointment'))->setPaper('a4');
        return $pdf->download("appointment-{$appointment->appointment_no}.pdf");
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return back()->with('success', 'Appointment deleted.');
    }
}
