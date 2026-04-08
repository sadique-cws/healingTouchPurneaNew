<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'hospital_name' => Setting::get('hospital_name', 'Healing Touch Hospital'),
                'contact_email' => Setting::get('contact_email', 'info@healingtouchpurnea.com'),
                'contact_phone' => Setting::get('contact_phone', '7079025467'),
                'whatsapp_number' => Setting::get('whatsapp_number', '7079025467'),
                'address' => Setting::get('address', 'Hope Chauraha, Rambagh Road, Linebazar, Purnea 854301'),
                'instagram_link' => Setting::get('instagram_link', ''),
                'facebook_link' => Setting::get('facebook_link', ''),
                'twitter_link' => Setting::get('twitter_link', ''),
                'sms_status' => (bool) Setting::get('sms_status', false),
                'logo' => Setting::get('logo'),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'hospital_name' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'whatsapp_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'instagram_link' => 'nullable|url|max:255',
            'facebook_link' => 'nullable|url|max:255',
            'twitter_link' => 'nullable|url|max:255',
            'sms_status' => 'required|boolean',
        ]);

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
