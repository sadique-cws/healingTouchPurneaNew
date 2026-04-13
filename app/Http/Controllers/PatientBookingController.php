<?php

namespace App\Http\Controllers;

use App\Events\AppointmentBooked;
use App\Jobs\SendOtpJob;
use App\Models\Appointment;
use App\Models\Career;
use App\Models\Doctor;
use App\Models\GalleryImage;
use App\Models\Patient;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Milon\Barcode\Facades\DNS1DFacade as DNS1D;
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

    public function careers(): \Inertia\Response
    {
        $careers = Career::query()
            ->where('status', true)
            ->latest()
            ->get();

        return Inertia::render('PatientBooking/Careers', array_merge($this->getGlobalSettings(), [
            'careers' => $careers,
        ]));
    }

    public function careerDetail(int $id): \Inertia\Response
    {
        $career = Career::query()->findOrFail($id);

        return Inertia::render('PatientBooking/CareerDetail', array_merge($this->getGlobalSettings(), [
            'career' => $career,
        ]));
    }

    public function gallery(): \Inertia\Response
    {
        $images = GalleryImage::query()->latest()->get();

        return Inertia::render('PatientBooking/Gallery', array_merge($this->getGlobalSettings(), [
            'images' => $images,
        ]));
    }

    public function doctorDetails(string $slug): \Inertia\Response
    {
        $doctor = Doctor::query()
            ->with(['user', 'department'])
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('PatientBooking/DoctorDetails', array_merge($this->getGlobalSettings(), [
            'doctor' => $doctor,
        ]));
    }

    public function terms(): \Inertia\Response
    {
        return Inertia::render('PatientBooking/TermsCondition', $this->getGlobalSettings());
    }

    public function privacy(): \Inertia\Response
    {
        return Inertia::render('PatientBooking/PrivacyPolicy', $this->getGlobalSettings());
    }

    public function account(): \Inertia\Response
    {
        return Inertia::render('PatientBooking/Account', $this->getGlobalSettings());
    }

    public function manageAppointments(Request $request): \Inertia\Response
    {
        $searchMethod = $request->input('method', 'phone');
        $phone = trim((string) $request->input('phone', ''));
        $email = trim((string) $request->input('email', ''));

        $results = [];

        if (($searchMethod === 'phone' && $phone !== '') || ($searchMethod === 'email' && $email !== '')) {
            $patients = collect();

            if ($searchMethod === 'phone') {
                $patients = Patient::query()->where('phone', 'like', "%{$phone}%")->get();
            }

            if ($searchMethod === 'email') {
                $patients = Patient::query()->where('email', $email)->get();
            }

            foreach ($patients as $patient) {
                $appointments = Appointment::query()
                    ->where('patient_id', $patient->id)
                    ->with(['doctor.user', 'doctor.department', 'payment'])
                    ->latest('appointment_date')
                    ->get();

                foreach ($appointments as $appointment) {
                    $results[] = [
                        'id' => $appointment->id,
                        'reference_id' => 'HTH-' . str_pad((string) $appointment->id, 5, '0', STR_PAD_LEFT),
                        'appointment_no' => $appointment->appointment_no,
                        'queue_number' => $appointment->queue_number,
                        'appointment_date' => $appointment->appointment_date,
                        'appointment_time' => $appointment->appointment_time,
                        'status' => $appointment->status,
                        'doctor_name' => $appointment->doctor?->user?->name,
                        'department' => $appointment->doctor?->department?->name,
                        'patient_name' => $patient->name,
                        'patient_phone' => $patient->phone,
                        'patient_email' => $patient->email,
                        'payment_status' => $appointment->payment?->status,
                    ];
                }
            }
        }

        return Inertia::render('PatientBooking/ManageAppointments', array_merge($this->getGlobalSettings(), [
            'filters' => [
                'method' => $searchMethod,
                'phone' => $phone,
                'email' => $email,
            ],
            'appointments' => $results,
        ]));
    }

    public function sendCancelOtp(Request $request, Appointment $appointment)
    {
        $otp = (string) random_int(1000, 9999);

        Appointment::query()->where('id', $appointment->id)->update([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
            'otp_verified' => false,
        ]);

        SendOtpJob::dispatch($appointment->id, $otp);

        return back()->with('success', 'OTP sent to registered email.');
    }

    public function verifyCancelOtp(Request $request, Appointment $appointment)
    {
        $request->validate([
            'otp' => 'required|string|min:4|max:6',
        ]);

        $fresh = Appointment::query()->findOrFail($appointment->id);

        if (
            (string) $fresh->otp !== (string) $request->string('otp')
            || !$fresh->otp_expires_at
            || now()->greaterThan($fresh->otp_expires_at)
        ) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP.']);
        }

        Appointment::query()->where('id', $fresh->id)->update([
            'status' => 'cancelled',
            'otp_verified' => true,
        ]);

        return back()->with('success', 'Appointment cancelled successfully.');
    }

    public function appointmentReceipt(Appointment $appointment)
    {
        $appointment->load(['patient', 'doctor.user', 'doctor.department', 'payment']);

        $pdf = Pdf::loadView('pdf.appointment', [
            'appointment' => $appointment,
            'reference' => 'HTH-' . str_pad((string) $appointment->id, 5, '0', STR_PAD_LEFT),
        ])->setPaper('a4');

        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->output();
        }, 'appointment-receipt.pdf');
    }

    /**
     * Render the multi-step appointment booking interface.
     */
    public function book_appointment(Request $request): \Inertia\Response
    {
        $hasActiveDepartments = \App\Models\Department::query()->where('status', 1)->exists();

        $departments = \App\Models\Department::query()
            ->when($hasActiveDepartments, fn($query) => $query->where('status', 1))
            ->orderBy('name', 'desc')
            ->get();

        $doctors = \App\Models\Doctor::with(['user', 'department'])
            ->whereIn('status', [1, 2, '1', '2'])
            ->whereHas('department', function ($query) use ($hasActiveDepartments) {
                if ($hasActiveDepartments) {
                    $query->where('status', 1);
                }
            })
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
    public function get_slots(Request $request): JsonResponse
    {
        $hasActiveDepartments = \App\Models\Department::query()->where('status', 1)->exists();

        $doctor = Doctor::query()
            ->with('department')
            ->where('slug', $request->doctor_slug)
            ->first();

        if (!$doctor) {
            return response()->json(['slots' => []]);
        }

        if (!$doctor->department) {
            return response()->json(['error' => 'Doctor not available', 'slots' => []]);
        }

        if ($hasActiveDepartments && ((int) $doctor->status !== 1 || (int) $doctor->department->status !== 1)) {
            return response()->json(['error' => 'Doctor not available', 'slots' => []]);
        }

        $date = $request->date ?: Carbon::now()->addDay()->toDateString();
        $selectedDate = Carbon::parse($date);
        $dayOfWeek = $selectedDate->format('l');
        $availableDays = (array)$doctor->available_days;

        if (!$selectedDate->isSameDay(Carbon::now()->addDay())) {
            return response()->json([
                'error' => 'Appointments are only available for tomorrow.',
                'slots' => [],
            ]);
        }

        if (!in_array($dayOfWeek, $availableDays)) {
            return response()->json([
                'error' => "Doctor not available on $dayOfWeek", 
                'slots' => []
            ]);
        }

        $timeSlots = [];
        for ($hour = 10; $hour < 20; $hour++) {
            $formattedHour = $hour <= 12 ? $hour : $hour - 12;
            $ampm = $hour < 12 ? 'AM' : 'PM';
            $timeSlots[] = "$formattedHour:00 $ampm";
            $timeSlots[] = "$formattedHour:30 $ampm";
        }

        $bookedCounts = Appointment::query()
            ->where('doctor_id', $doctor->id)
            ->where('appointment_date', $date)
            ->get()
            ->groupBy(fn($apt) => Carbon::parse($apt->appointment_time)->format('g:i A'))
            ->map->count();

        $availableSlots = array_map(function ($slot) use ($bookedCounts) {
            $booked = (int) ($bookedCounts[$slot] ?? 0);
            $remaining = max(0, 4 - $booked);

            if ($remaining >= 3) {
                $status = 'available';
            } elseif ($remaining === 2) {
                $status = 'filling_up';
            } elseif ($remaining === 1) {
                $status = 'almost_full';
            } else {
                $status = 'full';
            }

            return [
                'slot' => $slot,
                'booked' => $booked,
                'remaining' => $remaining,
                'status' => $status,
                'bookable' => $remaining > 0,
            ];
        }, $timeSlots);

        return response()->json([
            'slots' => $availableSlots,
            'date' => $date,
            'available' => true,
        ]);
    }

    /**
     * Process and store a new patient appointment.
     */
    public function store_appointment(Request $request): JsonResponse
    {
        $hasActiveDepartments = \App\Models\Department::query()->where('status', 1)->exists();

        $validated = $request->validate([
            'doctor_slug' => 'required|exists:doctors,slug',
            'date' => 'required|date',
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

        $doctor = Doctor::query()
            ->with('department')
            ->where('slug', $validated['doctor_slug'])
            ->firstOrFail();

        if (!$doctor->department) {
            return response()->json([
                'success' => false,
                'message' => 'Selected doctor is currently unavailable.',
            ], 422);
        }

        if ($hasActiveDepartments && ((int) $doctor->status !== 1 || (int) $doctor->department->status !== 1)) {
            return response()->json([
                'success' => false,
                'message' => 'Selected doctor is currently unavailable.',
            ], 422);
        }

        $appointmentDate = Carbon::parse($validated['date']);
        if (!$appointmentDate->isSameDay(Carbon::now()->addDay())) {
            return response()->json([
                'success' => false,
                'message' => 'Appointments are only available for tomorrow.',
            ], 422);
        }

        $formattedTime = Carbon::createFromFormat('h:i A', $validated['time'])->format('H:i:00');

        $slotCount = Appointment::query()
            ->where('doctor_id', $doctor->id)
            ->where('appointment_date', $validated['date'])
            ->whereTime('appointment_time', $formattedTime)
            ->count();

        if ($slotCount >= 4) {
            return response()->json([
                'success' => false,
                'message' => 'This time slot is fully booked. Please choose another slot.',
            ], 422);
        }

        $duplicateAppointment = Appointment::query()
            ->whereHas('patient', fn($query) => $query->where('phone', $validated['phone']))
            ->where('doctor_id', $doctor->id)
            ->where('appointment_date', $validated['date'])
            ->first();

        if ($duplicateAppointment) {
            return response()->json([
                'success' => false,
                'message' => 'You already have an appointment with this doctor on the selected date.',
            ], 422);
        }
        
        $patient = Patient::query()->firstOrCreate(
            ['phone' => $validated['phone']],
            [
                'name' => $validated['name'],
                'email' => $validated['email'] ?? null,
                'gender' => $validated['gender'],
                'age' => $validated['age'] ?? null,
                'address' => $validated['address'],
                'pincode' => $validated['pincode'] ?? null,
                'city' => $validated['city'],
                'state' => $validated['state'] ?? null,
                'country' => 'India',
            ]
        );

        $lastQueue = Appointment::query()
            ->where('doctor_id', $doctor->id)
            ->where('appointment_date', $validated['date'])
            ->max('queue_number') ?? 0;

        $appointment = Appointment::query()->create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
            'appointment_date' => $validated['date'],
            'appointment_time' => $formattedTime,
            'queue_number' => $lastQueue + 1,
            'status' => 'pending',
            'payment_method' => 'pay_at_hospital',
            'notes' => $validated['notes'] ?? null,
        ]);

        $appointment->payment()->create([
            'appointment_id' => $appointment->id,
            'paid_amount' => 0,
            'mode' => 'pay_at_hospital',
            'settlement' => false,
            'status' => 'due',
        ]);

        $datePrefix = Carbon::parse($validated['date'])->format('Ymd');
        $appointment->update([
            'appointment_no' => (int)($datePrefix . str_pad($appointment->id, 4, '0', STR_PAD_LEFT))
        ]);

        try {
            $barcodeFileName = 'barcode-appointment-' . $appointment->id . '.png';
            $barcodePath = 'appointments/barcodes/' . $barcodeFileName;
            $barcodeString = (string) $appointment->appointment_no;
            $barcodeImage = DNS1D::getBarcodePNG($barcodeString, 'C128', 2, 60);

            if ($barcodeImage && is_string($barcodeImage)) {
                Storage::disk('public')->put($barcodePath, base64_decode($barcodeImage));
                $appointment->update(['barcode_path' => $barcodePath]);
            }
        } catch (\Throwable $exception) {
            Log::warning('Barcode generation failed: ' . $exception->getMessage());
        }

        $appointment->load(['patient', 'doctor.user', 'doctor.department']);
        event(new AppointmentBooked($appointment));

        if ((string) Setting::get('sms_status', '0') === '1') {
            $this->sendAppointmentSms($patient->phone, $patient->name, $appointment);
        }

        return response()->json([
            'success' => true,
            'appointment' => [
                'appointment_no' => $appointment->appointment_no,
                'queue_number' => $appointment->queue_number,
                'id' => $appointment->id,
            ],
            'receipt_url' => route('appointment.receipt', $appointment),
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

        $values = array_map(fn($key) => Setting::get($key, $this->getDefault($key)), $settings);

        return array_merge($values, [
            'hotelName' => $values['hospital_name'] ?? 'Healing Touch Hospital',
        ]);
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

    private function sendAppointmentSms(string $mobile, string $name, Appointment $appointment): void
    {
        try {
            Http::withHeaders([
                'authkey' => env('MSG91_AUTH_KEY'),
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post('https://control.msg91.com/api/v5/flow', [
                'template_id' => '6809e4e7d6fc055acb51b0f2',
                'short_url' => 0,
                'recipients' => [[
                    'mobiles' => '91' . $mobile,
                    'name' => $name,
                    'datetime' => Carbon::parse($appointment->appointment_date)->format('d-m-Y') . ' ' . Carbon::parse($appointment->appointment_time)->format('h:i A'),
                ]],
            ]);
        } catch (\Throwable $exception) {
            Log::warning('SMS sending failed: ' . $exception->getMessage());
        }
    }
}
