<?php

use App\Http\Middleware\AdminMiddleware;
use App\Livewire\Admin\Appointment\Add as AddAppoinment;
use App\Livewire\Admin\Appointment\All as AllAppointment;
use App\Livewire\Admin\Appointment\Update as UpdateAppointment;
use App\Livewire\Admin\Career\AddCareer;
use App\Livewire\Admin\Dashboard as AdminDashboard;
use App\Livewire\Admin\Department\All as DeparmentAll;
use App\Livewire\Admin\Doctor\All as AllDoctor;
use App\Livewire\Admin\Gallery\All as AllGallery;
use App\Livewire\Admin\Index;
use App\Livewire\Admin\Login;
use App\Livewire\Admin\Logout;
use App\Livewire\Admin\Qualification\All as AllQualification;
use App\Livewire\Admin\Settings\ManageSetting;
use App\Livewire\Admin\User\All as AllUser;
use App\Livewire\PatientBooking\MenuItems\CareerDetail;
use App\Livewire\PatientBooking\MenuItems\PrivacyPolicy;
use App\Livewire\PatientBooking\MenuItems\TermsCondition;
use App\Livewire\Reception\ViewAppointment;
use App\Livewire\Viewappoinment;
use App\Models\GalleryImage;
use Illuminate\Support\Facades\Route;
use App\Livewire\Appointment\AppoinmentForm;
use App\Livewire\Appointment\ConfirmAppointment;
use App\Livewire\Doctor\Dashboard;
use App\Livewire\Doctor\DoctorLogin;
use App\Livewire\PatientBooking\LandingPage;
use App\Livewire\PatientBooking\ManageAppointments;
use App\Livewire\PatientBooking\MenuItems\AboutUs;
use App\Livewire\PatientBooking\MenuItems\Careers;
use App\Livewire\PatientBooking\MenuItems\ContactPage;
use App\Livewire\PatientBooking\MenuItems\DoctorDetails;
use App\Livewire\PatientBooking\MenuItems\GalleryPage;
use App\Livewire\PatientBooking\MenuItems\OurDoctors;
use App\Livewire\PatientBooking\MenuItems\Services;
use App\Livewire\Reception\Dashboard as ReceptionDashboard;
use App\Livewire\Reception\Login as ReceptionLogin;
use Illuminate\Console\View\Components\Confirm;
use App\Livewire\Doctor\ViewPatientdetail;
use Illuminate\Support\Facades\Auth;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

// SEO Routes
Route::get('/generate-sitemap', function () {
    $sitemap = Spatie\Sitemap\Sitemap::create();

    // Static Pages
    $sitemap->add(Spatie\Sitemap\Tags\Url::create('/')->setPriority(1.0)->setChangeFrequency(Spatie\Sitemap\Tags\Url::CHANGE_FREQUENCY_DAILY))
        ->add(Spatie\Sitemap\Tags\Url::create('/services')->setPriority(0.8))
        ->add(Spatie\Sitemap\Tags\Url::create('/our-doctors')->setPriority(0.8))
        ->add(Spatie\Sitemap\Tags\Url::create('/book-appointment')->setPriority(0.9))
        ->add(Spatie\Sitemap\Tags\Url::create('/about-us')->setPriority(0.7))
        ->add(Spatie\Sitemap\Tags\Url::create('/contact-us')->setPriority(0.7))
        ->add(Spatie\Sitemap\Tags\Url::create('/gallery')->setPriority(0.6))
        ->add(Spatie\Sitemap\Tags\Url::create('/careers')->setPriority(0.5))
        ->add(Spatie\Sitemap\Tags\Url::create('/terms-conditions')->setPriority(0.3))
        ->add(Spatie\Sitemap\Tags\Url::create('/privacy-policy')->setPriority(0.3));

    // Dynamic Doctor Pages
    App\Models\Doctor::whereIn('status', [1, 2])->each(function (App\Models\Doctor $doctor) use ($sitemap) {
        if ($doctor->slug) {
            $sitemap->add(Spatie\Sitemap\Tags\Url::create(route('doctors.detail', $doctor->slug))
                ->setPriority(0.9)
                ->setLastModificationDate($doctor->updated_at));
        }
    });

    // Dynamic Career Pages
    App\Models\Career::where('status', true)->each(function (App\Models\Career $career) use ($sitemap) {
        $sitemap->add(Spatie\Sitemap\Tags\Url::create(route('career.detail', $career->id))
            ->setPriority(0.6)
            ->setLastModificationDate($career->updated_at));
    });

    $sitemap->writeToFile(public_path('sitemap.xml'));

    return 'Sitemap generated successfully with ' . count($sitemap->getTags()) . ' URLs!';
});

Route::get('/sitemap.xml', function () {
    if (!file_exists(public_path('sitemap.xml'))) {
        return redirect('/generate-sitemap');
    }
    return response()->file(public_path('sitemap.xml'));
});


// Route::view('/', 'comingsoon');
// Route::view('/home', 'welcome');

//user landing page
Route::get('/', LandingPage::class)->name('userlandingpage');




Route::view('profile', 'profile')
    ->middleware(['auth'])
    ->name('profile');

Route::get('/appointments/create', AppoinmentForm::class)
    ->middleware('auth')
    ->name('appointments.create');

Route::get('/appointments/book/{patient}', ConfirmAppointment::class)->middleware('auth')->name('appointments.book');

Route::get('/viewappointment/{id}',Viewappoinment::class)->name('show.appointment');
Route::get('/desk/login', ReceptionLogin::class)->name('reception.login');
Route::middleware('reception')->group(function () {
    Route::get('/desk/dashboard', ReceptionDashboard::class)->name('reception.dashboard');
    Route::get('/desk/appointments/{id}', ViewAppointment::class)->name('reception.appointments');
});

// Patient Booking Routes
Route::get('/book-appointment/{slug?}', \App\Livewire\PatientBooking\BookAppointment::class)->name('book.appointment');
Route::get('/manage-appointments', ManageAppointments::class)->name('manage.appointments');
Route::get('/our-doctors', OurDoctors::class)->name('our.doctors');
Route::get('/careers', Careers::class)->name('careers.page');
Route::get('/career/{id}', CareerDetail::class)->name('career.detail');
Route::get('/services', Services::class)->name('services.page');
Route::get('/contact-us',ContactPage::class)->name('contact.page');
Route::get('/about-us',AboutUs::class)->name('about.page');
Route::get('/doctor/{slug}', DoctorDetails::class)->name('doctors.detail');
Route::get('/gallery', GalleryPage::class)->name('gallery.page');
Route::get('/terms-conditions', TermsCondition::class)->name('terms.conditions');
Route::get('/privacy-policy', PrivacyPolicy::class)->name('privacy.policy');

//Admin routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', Login::class)->name('login');
    Route::get('/logout', Logout::class)->name('logout');
    Route::middleware(AdminMiddleware::class)->group(function () {
        Route::get('/dashboard', AdminDashboard::class)->name('dashboard');
        Route::get('/department', DeparmentAll::class)->name('department');
        Route::get('/doctor', AllDoctor::class)->name('doctor');
        Route::get('/appointment', AllAppointment::class)->name('appointment');
        Route::get('/appointment/add', AddAppoinment::class)->name('appointment.add');
        Route::get('/gallery',AllGallery::class)->name('gallery');
        Route::get('/appointment/update/{id}', UpdateAppointment::class)->name('appointment.update');
        Route::get('/user',AllUser::class)->name('user');
        Route::get('/career',AddCareer::class)->name('add.career');
        Route::get('/settings',ManageSetting::class)->name('settings');
    });

});

//Doctor Routes
Route::get('doc/login', DoctorLogin::class)->name('doctor.login');
// Route::get('doc/login');
Route::get('doc/dashboard', Dashboard::class)->name('doctor.dashboard');
Route::get('/doctor/patient/{appointment_id}', ViewPatientdetail::class)->name('doctor.view-patient');

// SEO Routes
// Route::get('/doctors', function () {
//     return view('pages.doctors');
// })->name('doctors');

// Route::get('/services', function () {
//     return view('pages.services');
// })->name('services');

// Route::get('/about-us', function () {
//     return view('pages.about');
// })->name('about');

// Route::get('/contact-us', function () {
//     return view('pages.contact');
// })->name('contact');

// Route::get('/careers', function () {
//     return view('pages.careers');
// })->name('careers');

require __DIR__.'/auth.php';
