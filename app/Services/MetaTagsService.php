<?php

namespace App\Services;

use App\Models\Doctor;
use App\Models\Department;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class MetaTagsService
{
    public static function getTags($route, $params = [])
    {
        try {
            $hospitalName = Cache::remember('hospital_name', 86400, function () {
                return Setting::where('key', 'hospital_name')->value('value') ?? 'Healing Touch Hospital';
            });

            if (!$route) {
                return self::getDefaultTags($hospitalName);
            }

            // For doctor details page
            if ($route === 'doctors.detail' && isset($params['doctor'])) {
                return self::getDoctorTags($params['doctor'], $hospitalName);
            }

            // For career details page
            if ($route === 'career.detail' && isset($params['career'])) {
                return self::getCareerTags($params['career'], $hospitalName);
            }

            // Locality keywords for Purnea
            $localities = "Line Bazar, Gulabbagh, Khuskibagh, Bhatta Bazar, Madhubani, Rambagh, Sipahi Tola, Maranga, Chunapur, Ford Company, Girja Chowk, Polytechnic Chowk, Zero Mile";
            $localKeywords = "hospital in Line Bazar Purnea, best hospital in Purnea Bihar, healthcare in Purnea, medical center Line Bazar, hospital near $localities, Purnea hospital list, specialist doctors in Purnea, emergency care Purnea";

            // Define all route specific tags
            $routeTags = [
                'userlandingpage' => [
                    'title' => "Best Hospital in Purnea | $hospitalName Line Bazar",
                    'keywords' => "$hospitalName, best hospital in Purnea, emergency hospital Purnea, $localKeywords, emergency hospital near me, 24 hour hospital near me, er rooms near me, hospital near me, 24 hrs hospital near me, 24 7 hospital near me, emergency hospital, 24 hours clinic near me, emergency hospital near me 24 hours",
                    'description' => "Welcome to $hospitalName, the leading hospital in Line Bazar, Purnea. Serving patients from Gulabbagh, Bhatta Bazar, Madhubani, and all across Bihar with 24/7 emergency care and specialist surgeries."
                ],
                'book.appointment' => [
                    'title' => "Book Doctor Appointment Online in Purnea | $hospitalName",
                    'keywords' => "book doctor appointment online Purnea, online healthcare booking Purnea, $hospitalName appointment, $localKeywords",
                    'description' => "Book your medical appointment online at $hospitalName, Purnea. Easy and fast doctor booking for patients in Line Bazar and nearby areas."
                ],
                'our.doctors' => [
                    'title' => "Best Doctors in Purnea | Specialist Consultants at $hospitalName",
                    'keywords' => "best doctors Purnea, specialist doctors Bihar, top consultants $hospitalName, find doctor online, gyno doctors in Purnea, women health specialists Purnea, gynecology clinics in Purnea, General surgeons Purnea Bihar, $localKeywords",
                    'description' => "Meet our team of highly qualified specialist doctors at $hospitalName, Purnea. Expert surgeons and gynecologists serving the Purnea community."
                ],
                'careers.page' => [
                    'title' => "Healthcare Jobs in Purnea | Careers at $hospitalName",
                    'keywords' => "hospital jobs Purnea, medical careers Bihar, healthcare job openings, work at $hospitalName, $localKeywords",
                    'description' => "Explore exciting career opportunities at $hospitalName, Purnea. Join Bihar's fastest-growing healthcare team in Line Bazar."
                ],
                'services.page' => [
                    'title' => "Medical Services in Purnea | Advanced Treatments at $hospitalName",
                    'keywords' => "hospital services Purnea, medical services Bihar, healthcare treatments, best hospital facilities Purnea, laparoscopic surgery Purnea, laser surgery Purnea, $localKeywords",
                    'description' => "Discover a wide range of healthcare services at $hospitalName, Line Bazar, Purnea. From laparoscopic surgery to advanced gynecology care."
                ],
                'contact.page' => [
                    'title' => "Contact $hospitalName Purnea | Hospital Address in Line Bazar",
                    'keywords' => "$hospitalName contact, hospital address Purnea, contact $hospitalName, call hospital Purnea, hospital phone number, hospital in Line Bazar, $localKeywords",
                    'description' => "Contact $hospitalName in Line Bazar, Purnea. Get directions, phone numbers, and emergency contact details for the best hospital in Purnea."
                ],
                'about.page' => [
                    'title' => "About $hospitalName | Leading Healthcare Provider in Purnea",
                    'keywords' => "$hospitalName, about hospital Purnea, best healthcare team, hospital mission Purnea, trusted medical care, $localKeywords",
                    'description' => "Learn about $hospitalName - our journey, vision, and commitment to providing exceptional healthcare in Purnea, Bihar since inception."
                ],
                'gallery.page' => [
                    'title' => "Hospital Infrastructure Gallery | $hospitalName Purnea",
                    'keywords' => "$hospitalName gallery, hospital facilities Purnea, healthcare infrastructure, modern hospital photos, $localKeywords",
                    'description' => "View our state-of-the-art medical facilities and infrastructure at $hospitalName, Line Bazar, Purnea."
                ],
                'terms.conditions' => [
                    'title' => "Terms and Conditions | $hospitalName Purnea",
                    'keywords' => "$hospitalName terms, hospital service terms, hospital policies Purnea",
                    'description' => "Read the terms and conditions for using healthcare services at $hospitalName, Purnea."
                ],
                'privacy.policy' => [
                    'title' => "Privacy Policy | $hospitalName Purnea",
                    'keywords' => "$hospitalName privacy policy, data protection, patient confidentiality",
                    'description' => "Our commitment to protecting your privacy and medical records at $hospitalName, Purnea."
                ],
                'career.detail' => [
                    'title' => "Job Opportunity in Purnea | Work at $hospitalName",
                    'keywords' => "hospital jobs Purnea, medical careers Bihar, healthcare job openings, work at $hospitalName",
                    'description' => "Join our team at $hospitalName, Purnea. Explore this exciting healthcare career opportunity in Line Bazar."
                ],
            ];

            $tags = $routeTags[$route] ?? self::getDefaultTags($hospitalName);
            $tags['schema'] = self::getSchema($route, $params, $hospitalName);
            
            return $tags;

        } catch (\Exception $e) {
            return self::getDefaultTags('Healing Touch Hospital');
        }
    }

    private static function getDoctorTags($doctorId, $hospitalName)
    {
        try {
            $doctor = is_numeric($doctorId) 
                ? Doctor::with(['user', 'department'])->find($doctorId)
                : Doctor::with(['user', 'department'])->where('slug', $doctorId)->first();
            
            if (!$doctor || !$doctor->user) {
                return self::getDefaultTags($hospitalName);
            }

            $name = $doctor->user->name;
            $dept = $doctor->department->name ?? 'Specialist';
            $qual = $doctor->qualification;

            return [
                'title' => "Dr. $name | $dept Specialist in Purnea | $hospitalName",
                'keywords' => "Dr. $name, $dept in Purnea, $qual, best doctor in Line Bazar, doctor in Purnea, $hospitalName doctor",
                'description' => "Consult with Dr. $name, a leading $dept specialist ($qual) at $hospitalName, Line Bazar, Purnea. Book your appointment today."
            ];

        } catch (\Exception $e) {
            return self::getDefaultTags($hospitalName);
        }
    }

    private static function getCareerTags($careerId, $hospitalName)
    {
        try {
            $career = \App\Models\Career::find($careerId);
            if (!$career) return self::getDefaultTags($hospitalName);

            return [
                'title' => "{$career->title} Job in Purnea | $hospitalName Careers",
                'keywords' => "{$career->title} job, hospital careers Purnea, healthcare vacancy Bihar, $hospitalName jobs",
                'description' => "Apply for {$career->title} position at $hospitalName, Line Bazar, Purnea. Join the leading healthcare provider in Bihar."
            ];
        } catch (\Exception $e) {
            return self::getDefaultTags($hospitalName);
        }
    }

    private static function getDefaultTags($hospitalName)
    {
        return [
            'title' => "$hospitalName | Best Hospital in Purnea, Bihar",
            'keywords' => "$hospitalName Purnea, best hospital Bihar, doctor appointment Purnea, hospital in Line Bazar",
            'description' => "$hospitalName - Quality Healthcare and Advanced Medical Treatments in Line Bazar, Purnea, Bihar."
        ];
    }

    public static function getSchema($route, $params = [], $hospitalName = 'Healing Touch Hospital')
    {
        $baseSchema = [
            "@context" => "https://schema.org",
            "@type" => "Hospital",
            "name" => $hospitalName,
            "url" => url('/'),
            "logo" => asset('healingTouchLogo.jpeg'),
            "image" => asset('healingTouchLogo.jpeg'),
            "address" => [
                "@type" => "PostalAddress",
                "streetAddress" => "Hope Chauraha, Rambagh Road, Linebazar",
                "addressLocality" => "Purnea",
                "addressRegion" => "Bihar",
                "postalCode" => "854301",
                "addressCountry" => "IN"
            ],
            "geo" => [
                "@type" => "GeoCoordinates",
                "latitude" => "25.7771", // Approximate for Line Bazar, Purnea
                "longitude" => "87.4753"
            ],
            "telephone" => "+91-7079025467",
            "openingHoursSpecification" => [
                [
                    "@type" => "OpeningHoursSpecification",
                    "dayOfWeek" => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                    "opens" => "00:00",
                    "closes" => "23:59"
                ]
            ],
            "contactPoint" => [
                "@type" => "ContactPoint",
                "telephone" => "+91-7079025467",
                "contactType" => "emergency",
                "areaServed" => "IN",
                "availableLanguage" => ["Hindi", "English"]
            ]
        ];

        if ($route === 'doctors.detail' && isset($params['doctor'])) {
            $doctor = is_numeric($params['doctor']) 
                ? Doctor::with(['user', 'department'])->find($params['doctor'])
                : Doctor::with(['user', 'department'])->where('slug', $params['doctor'])->first();

            if ($doctor && $doctor->user) {
                return [
                    "@context" => "https://schema.org",
                    "@type" => "Physician",
                    "name" => "Dr. " . $doctor->user->name,
                    "image" => $doctor->user->profile_photo_url ?? asset('healingTouchLogo.jpeg'),
                    "medicalSpecialty" => $doctor->department->name ?? "General Medicine",
                    "qualifications" => $doctor->qualification,
                    "address" => $baseSchema['address'],
                    "worksFor" => [
                        "@type" => "Hospital",
                        "name" => $hospitalName
                    ]
                ];
            }
        }

        if ($route === 'career.detail' && isset($params['career'])) {
            $career = \App\Models\Career::find($params['career']);
            if ($career) {
                return [
                    "@context" => "https://schema.org",
                    "@type" => "JobPosting",
                    "title" => $career->title,
                    "description" => $career->description,
                    "datePosted" => $career->created_at->toIso8601String(),
                    "hiringOrganization" => [
                        "@type" => "Organization",
                        "name" => $hospitalName,
                        "sameAs" => url('/'),
                        "logo" => asset('healingTouchLogo.jpeg')
                    ],
                    "jobLocation" => [
                        "@type" => "Place",
                        "address" => $baseSchema['address']
                    ]
                ];
            }
        }

        return $baseSchema;
    }
}
