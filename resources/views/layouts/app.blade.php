<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://cdn.tailwindcss.com"></script>
    @php
        $route = request()->route()?->getName();
        $metaTags = App\Services\MetaTagsService::getTags($route);
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

</head>

<body class="font-sans antialiased">
    <div class="min-h-screen bg-gray-100">
        <livewire:layout.navigation />

        <!-- Page Heading -->
        @if (isset($header))
            <header class="bg-white shadow">
                <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {{ $header }}
                </div>
            </header>
        @endif

        <!-- Page Content -->
        <main>
            {{ $slot }}
        </main>
    </div>
    @livewireScripts

</body>

</html>
