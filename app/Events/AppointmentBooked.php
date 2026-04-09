<?php

namespace App\Events;

use App\Models\Appointment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentBooked implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    public $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function broadcastOn()
    {
        return new Channel('appointments-channel');
    }

    public function broadcastAs()
    {
        return 'appointment-booked';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->appointment->id,
            'appointment_no' => $this->appointment->appointment_no,
            'appointment_date' => $this->appointment->appointment_date,
            'appointment_time' => $this->appointment->appointment_time,
            'status' => $this->appointment->status,
            'queue_number' => $this->appointment->queue_number,
            'patient_name' => $this->appointment->patient?->name,
            'patient_phone' => $this->appointment->patient?->phone,
            'doctor_name' => $this->appointment->doctor?->user?->name,
            'department_name' => $this->appointment->doctor?->department?->name,
            'booked_at' => now()->toDateTimeString(),
        ];
    }

}
