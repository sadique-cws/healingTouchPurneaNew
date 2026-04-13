<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\PatientBookingController;

Route::get('/', [PatientBookingController::class, 'index'])->name('userlandingpage');
Route::get('/services', [PatientBookingController::class, 'services'])->name('services.page');
Route::get('/our-doctors', [PatientBookingController::class, 'doctors'])->name('our.doctors');
Route::get('/about-us', [PatientBookingController::class, 'about'])->name('about.page');
Route::get('/contact-us', [PatientBookingController::class, 'contact'])->name('contact.page');
Route::get('/careers', [PatientBookingController::class, 'careers'])->name('careers.page');
Route::get('/career/{id}', [PatientBookingController::class, 'careerDetail'])->name('career.detail');
Route::get('/gallery', [PatientBookingController::class, 'gallery'])->name('gallery.page');
Route::get('/terms-conditions', [PatientBookingController::class, 'terms'])->name('terms.conditions');
Route::get('/privacy-policy', [PatientBookingController::class, 'privacy'])->name('privacy.policy');
Route::get('/account', [PatientBookingController::class, 'account'])->name('account.page');
Route::get('/book-appointment/{slug?}', [PatientBookingController::class, 'book_appointment'])->name('book.appointment');
Route::post('/api/appointment/slots', [PatientBookingController::class, 'get_slots'])->name('api.appointment.slots');
Route::post('/api/appointment/book', [PatientBookingController::class, 'store_appointment'])->name('api.appointment.book');
Route::get('/manage-appointments', [PatientBookingController::class, 'manageAppointments'])->name('manage.appointments');
Route::post('/manage-appointments/{appointment}/send-otp', [PatientBookingController::class, 'sendCancelOtp'])->name('manage.appointments.send-otp');
Route::post('/manage-appointments/{appointment}/verify-otp', [PatientBookingController::class, 'verifyCancelOtp'])->name('manage.appointments.verify-otp');
Route::get('/appointment-receipt/{appointment}', [PatientBookingController::class, 'appointmentReceipt'])->name('appointment.receipt');
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin Routes
use App\Http\Controllers\AdminController;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminController::class, 'login'])->name('login');
    Route::post('/login', [AdminController::class, 'authenticate']);
    Route::post('/logout', [AdminController::class, 'logout'])->name('logout');

    Route::middleware(['admin'])->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        
        // Doctors
        Route::get('/doctors', [\App\Http\Controllers\Admin\DoctorController::class, 'index'])->name('doctors.index');
        Route::post('/doctors', [\App\Http\Controllers\Admin\DoctorController::class, 'store'])->name('doctors.store');
        Route::post('/doctors/{doctor}', [\App\Http\Controllers\Admin\DoctorController::class, 'update'])->name('doctors.update');
        Route::delete('/doctors/{doctor}', [\App\Http\Controllers\Admin\DoctorController::class, 'destroy'])->name('doctors.destroy');
        Route::patch('/doctors/{doctor}/status', [\App\Http\Controllers\Admin\DoctorController::class, 'updateStatus'])->name('doctors.update-status');

        // Departments
        Route::get('/departments', [\App\Http\Controllers\Admin\DepartmentController::class, 'index'])->name('departments.index');
        Route::post('/departments', [\App\Http\Controllers\Admin\DepartmentController::class, 'store'])->name('departments.store');
        Route::put('/departments/{department}', [\App\Http\Controllers\Admin\DepartmentController::class, 'update'])->name('departments.update');
        Route::delete('/departments/{department}', [\App\Http\Controllers\Admin\DepartmentController::class, 'destroy'])->name('departments.destroy');

        // Appointments
        Route::get('/appointments', [\App\Http\Controllers\Admin\AppointmentController::class, 'index'])->name('appointments.index');
        Route::patch('/appointments/{appointment}/status', [\App\Http\Controllers\Admin\AppointmentController::class, 'updateStatus'])->name('appointments.status');
        Route::get('/appointments/{appointment}/receipt', [\App\Http\Controllers\Admin\AppointmentController::class, 'downloadReceipt'])->name('appointments.receipt');
        Route::delete('/appointments/{appointment}', [\App\Http\Controllers\Admin\AppointmentController::class, 'destroy'])->name('appointments.destroy');

        // Settings
        Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
        Route::post('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');

        // Users
        Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
        Route::post('/users', [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');

        // Gallery
        Route::get('/gallery', [\App\Http\Controllers\Admin\GalleryController::class, 'index'])->name('gallery.index');
        Route::post('/gallery', [\App\Http\Controllers\Admin\GalleryController::class, 'store'])->name('gallery.store');
        Route::delete('/gallery/{gallery}', [\App\Http\Controllers\Admin\GalleryController::class, 'destroy'])->name('gallery.destroy');

        // Careers
        Route::get('/careers', [\App\Http\Controllers\Admin\CareerController::class, 'index'])->name('careers.index');
        Route::post('/careers', [\App\Http\Controllers\Admin\CareerController::class, 'store'])->name('careers.store');
        Route::put('/careers/{career}', [\App\Http\Controllers\Admin\CareerController::class, 'update'])->name('careers.update');
        Route::delete('/careers/{career}', [\App\Http\Controllers\Admin\CareerController::class, 'destroy'])->name('careers.destroy');
        Route::patch('/careers/{career}/toggle-status', [\App\Http\Controllers\Admin\CareerController::class, 'toggleStatus'])->name('careers.toggle-status');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::prefix('doctor')->name('doctor.')->group(function () {
    Route::get('/login', [\App\Http\Controllers\Doctor\DoctorController::class, 'showLogin'])->name('login');
    Route::post('/login', [\App\Http\Controllers\Doctor\DoctorController::class, 'login']);
    Route::post('/logout', [\App\Http\Controllers\Doctor\DoctorController::class, 'logout'])->name('logout');

    Route::middleware(['doctor'])->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Doctor\DoctorController::class, 'dashboard'])->name('dashboard');
        Route::get('/appointment/{appointment}', [\App\Http\Controllers\Doctor\DoctorController::class, 'show'])->name('appointment.show');
        Route::post('/availability', [\App\Http\Controllers\Doctor\DoctorController::class, 'updateAvailability'])->name('availability.update');
    });
});

Route::prefix('reception')->name('reception.')->group(function () {
    Route::get('/login', [\App\Http\Controllers\Reception\ReceptionController::class, 'showLogin'])->name('login');
    Route::post('/login', [\App\Http\Controllers\Reception\ReceptionController::class, 'login']);
    Route::post('/logout', [\App\Http\Controllers\Reception\ReceptionController::class, 'logout'])->name('logout');

    Route::middleware(['reception'])->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Reception\ReceptionController::class, 'dashboard'])->name('dashboard');
        Route::post('/appointment', [\App\Http\Controllers\Reception\ReceptionController::class, 'storeAppointment'])->name('appointment.store');
        Route::get('/appointment/{appointment}/edit', [\App\Http\Controllers\Reception\ReceptionController::class, 'edit'])->name('appointment.edit');
        Route::put('/appointment/{appointment}', [\App\Http\Controllers\Reception\ReceptionController::class, 'update'])->name('appointment.update');
        Route::patch('/appointment/{appointment}/status', [\App\Http\Controllers\Reception\ReceptionController::class, 'updateStatus'])->name('appointment.status');
        Route::post('/appointment/{appointment}/collect', [\App\Http\Controllers\Reception\ReceptionController::class, 'collectPayment'])->name('appointment.collect');
        Route::get('/download-tomorrow', [\App\Http\Controllers\Reception\ReceptionController::class, 'downloadTomorrowPDF'])->name('download.tomorrow');
    });
});

Route::get('/doctor/{slug}', [PatientBookingController::class, 'doctorDetails'])
    ->where('slug', '^(?!login$|dashboard$).+')
    ->name('doctors.detail');

require __DIR__.'/auth.php';
