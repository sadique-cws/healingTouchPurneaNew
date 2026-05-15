<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @php
        $route = request()->route()?->getName();
        $doctorSlug = request()->route('slug') ?? ($doctor->slug ?? ($doctor ?? null));
        $careerId = request()->route('id') ?? ($career ?? null);
        $metaTags = App\Services\MetaTagsService::getTags($route, [
            'doctor' => $doctorSlug,
            'career' => $careerId
        ]);
    @endphp

    <title>{{ $metaTags['title'] ?? config('app.name') }}</title>
    
    <!-- SEO Meta Tags -->
    <meta name="keywords" content="{{ $metaTags['keywords'] ?? '' }}">
    <meta name="description" content="{{ $metaTags['description'] ?? '' }}">

    <!-- Open Graph Meta Tags for Social Media -->
    <meta property="og:title" content="{{ $metaTags['title'] ?? config('app.name') }}">
    <meta property="og:description" content="{{ $metaTags['description'] ?? '' }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:image" content="{{ asset('healingTouchLogo.jpeg') }}">

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ url()->current() }}">

    <!-- Structured Data with JSON-LD -->
    <script type="application/ld+json">
    {!! json_encode($metaTags['schema'] ?? [], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
    </script>

    <link rel="icon" href="https://healingtouchpurnea.com/healingTouchLogo.jpeg" type="image/x-icon">

    @php
        $manifest = json_decode(file_get_contents(public_path('build/manifest.json')), true);
        $js = $manifest['resources/js/app.js']['file'] ?? null;
        $css = $manifest['resources/css/app.css']['css'][0] ?? null;
    @endphp

    @if ($js && $css)
        <link rel="stylesheet" href="{{ asset("build/{$css}") }}">
        <script type="module" src="{{ asset("build/{$js}") }}"></script>
    @endif

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-SX9KFPHCCD"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'G-SX9KFPHCCD');
    </script>
</head>
<livewire:patient-booking.header />

<body class="w-full flex flex-col min-h-screen">
    <div class="min-h-screen flex flex-col sm:justify-center items-center pt-0 bg-gray-100">
        <div class="w-full  shadow-md overflow-hidden rounded-lg ">
            {{ $slot }}
        </div>
    </div>
    @livewireScripts
</body>
<livewire:patient-booking.footer />

</html>
