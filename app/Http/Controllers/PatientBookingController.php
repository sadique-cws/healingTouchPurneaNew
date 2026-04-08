<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;
use App\Models\User;

class PatientBookingController extends Controller
{
    /**
     * Display the hospital landing page with featured doctors.
     */
    public function index(): \Inertia\Response
    {
        $doctors = User::query()
            ->with(['doctor.department'])
            ->whereHas('doctor', fn($query) => $query->whereIn('status', [1, 2, '1', '2']))
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return Inertia::render('PatientBooking/LandingPage', array_merge($this->getGlobalSettings(), [
            'doctors' => $doctors,
            'doctorCount' => $doctors->count(),
        ]));
    }

    public function about(): \Inertia\Response
    {
        return Inertia::render('PatientBooking/About', $this->getGlobalSettings());
    }

    public function services(): \Inertia\Response
    {
        return Inertia::render('PatientBooking/Services', $this->getGlobalSettings());
    }

    /**
     * Display all active doctors with specialization details.
     */
    public function doctors(): \Inertia\Response
    {
        $doctors = User::query()
            ->with(['doctor.department'])
            ->whereHas('doctor', fn($query) => $query->whereIn('status', [1, 2, '1', '2']))
            ->get();

        return Inertia::render('PatientBooking/Doctors', array_merge($this->getGlobalSettings(), [
            'doctors' => $doctors,
        ]));
    }

    public function contact(): \Inertia\Response
    {
        return Inertia::render('PatientBooking/Contact', $this->getGlobalSettings());
    }

    /**
     * Render the multi-step appointment booking interface.
     */
    public function book_appointment(Request $request): \Inertia\Response
    {
        $departments = \App\Models\Department::where('status', 1)->orderBy('name', 'desc')->get();
        $doctors = \App\Models\Doctor::with(['user', 'department'])
            ->whereIn('status', [1, 2, '1', '2'])
            ->whereHas('department', fn($query) => $query->where('status', 1))
            ->get();

        return Inertia::render('PatientBooking/BookAppointment', array_merge($this->getGlobalSettings(), [
            'departments' => $departments,
            'doctors' => $doctors,
            'preselected_slug' => $request->slug,
        ]));
    }

    /**
     * Fetch available time slots for a specific doctor and date.
     */
    public function get_slots(Request $request): \Illuminate\Http\JsonResponse
    {
        $doctor = \App\Models\Doctor::where('slug', $request->doctor_slug)->first();
        if (!$doctor) {
            return response()->json(['slots' => []]);
        }

        $date = $request->date ?: \Carbon\Carbon::now()->addDay()->toDateString();
        $selectedDate = \Carbon\Carbon::parse($date);
        $dayOfWeek = $selectedDate->format('l');
        $availableDays = (array)$doctor->available_days;

        if (!in_array($dayOfWeek, $availableDays)) {
            return response()->json([
                'error' => "Doctor not available on $dayOfWeek", 
                'slots' => []
            ]);
        }

        $timeSlots = [];
        for ($hour = 10; $hour < 18; $hour++) {
            $formattedHour = $hour <= 12 ? $hour : $hour - 12;
            $ampm = $hour < 12 ? 'AM' : 'PM';
            $timeSlots[] = "$formattedHour:00 $ampm";
            $timeSlots[] = "$formattedHour:30 $ampm";
        }

        $bookedCounts = \App\Models\Appointment::where('doctor_id', $doctor->id)
            ->where('appointment_date', $date)
            ->get()
            ->groupBy(fn($apt) => \Carbon\Carbon::parse($apt->appointment_time)->format('g:i A'))
            ->map->count();

        $availableSlots = array_values(array_filter($timeSlots, function ($slot) use ($bookedCounts) {
            return ($bookedCounts[$slot] ?? 0) < 4; // Assuming 4 slots per 30 mins
        }));

        return response()->json(['slots' => $availableSlots]);
    }

    /**
     * Process and store a new patient appointment.
     */
    public function store_appointment(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'doctor_slug' => 'required|exists:doctors,slug',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^[0-9]{10}$/',
            'gender' => 'required|in:male,female,other',
            'address' => 'required|string',
            'city' => 'required|string',
            'age' => 'nullable|integer',
            'email' => 'nullable|email',
            'pincode' => 'nullable|string',
            'state' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $doctor = \App\Models\Doctor::where('slug', $validated['doctor_slug'])->firstOrFail();
        
        $patient = \App\Models\Patient::firstOrCreate(
            ['phone' => $validated['phone']],
            $request->only(['name', 'email', 'gender', 'age', 'address', 'pincode', 'city', 'state'])
        );

        $time = \Carbon\Carbon::createFromFormat('h:i A', $validated['time'])->format('H:i:00');

        $lastQueue = \App\Models\Appointment::where('doctor_id', $doctor->id)
            ->where('appointment_date', $validated['date'])
            ->max('queue_number') ?? 0;

        $appointment = \App\Models\Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'appointment_date' => $validated['date'],
            'appointment_time' => $time,
            'queue_number' => $lastQueue + 1,
            'status' => 'pending',
            'payment_method' => 'pay_at_hospital',
            'notes' => $validated['notes'] ?? null,
        ]);

        $datePrefix = \Carbon\Carbon::parse($validated['date'])->format('Ymd');
        $appointment->update([
            'appointment_no' => (int)($datePrefix . str_pad($appointment->id, 4, '0', STR_PAD_LEFT))
        ]);

        return response()->json([
            'success' => true,
            'appointment' => [
                'appointment_no' => $appointment->appointment_no,
                'queue_number' => $appointment->queue_number,
            ]
        ]);
    }

    /**
     * Retrieve global site settings with sensible defaults.
     */
    private function getGlobalSettings(): array
    {
        $settings = [
            'hospital_name' => 'hospital_name',
            'contact_email' => 'contact_email',
            'contact_phone' => 'contact_phone',
            'whatsapp_number' => 'whatsapp_number',
            'address' => 'address',
            'facebook_link' => 'facebook_link',
            'instagram_link' => 'instagram_link',
            'twitter_link' => 'twitter_link',
            'map_url' => 'map_url',
        ];

        return array_map(fn($key) => Setting::get($key, $this->getDefault($key)), $settings);
    }

    private function getDefault(string $key): string
    {
        return match ($key) {
            'hospital_name' => 'Healing Touch Hospital',
            'contact_email' => 'info@healingtouchpurnea.com',
            'contact_phone', 'whatsapp_number' => '7079025467',
            'address' => 'Hope Chauraha, Rambagh Road, Linebazar, Purnea 854301',
            'map_url' => 'https://maps.app.goo.gl/yQ3m3QyQ3m3QyQ3m3',
            default => '#',
        };
    }
}
