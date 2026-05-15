<?php

namespace App\Livewire\PatientBooking\MenuItems;

use Livewire\Component;
use App\Models\Career;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
#[Title('Job Details')]
#[Layout('layouts.guest')]
class CareerDetail extends Component
{
    public $career;
    public $showModal = false;

    #[Layout('layouts.guest')]
    public function mount($id)
    {
        $this->career = Career::where('status', true)->findOrFail($id);
    }

    public function openModal()
    {
        $this->showModal = true;
    }

    public function closeModal()
    {
        $this->showModal = false;
    }
    public function render()
    {
        return view('livewire.patient-booking.menu-items.career-detail')
            ->layoutData(['career' => $this->career->id]);
    }
}
