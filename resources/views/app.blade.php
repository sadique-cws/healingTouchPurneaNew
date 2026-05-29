@php
    $routeName = request()->route() ? request()->route()->getName() : null;
    $params = [];
    if (request()->route()) {
        $params = request()->route()->parameters();
        if (isset($params['slug'])) {
            $params['doctor'] = $params['slug'];
        }
        if (isset($params['id'])) {
            $params['career'] = $params['id'];
        }
    }
    $seo = App\Services\MetaTagsService::getTags($routeName, $params);
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">

        <title inertia>{{ $seo['title'] ?? config('app.name', 'Laravel') }}</title>
        <meta name="description" content="{{ $seo['description'] ?? '' }}">
        <meta name="keywords" content="{{ $seo['keywords'] ?? '' }}">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ $seo['title'] ?? '' }}">
        <meta property="og:description" content="{{ $seo['description'] ?? '' }}">
        <meta property="og:site_name" content="Healing Touch Hospital">

        @if(!empty($seo['schema']))
        <script type="application/ld+json">
            {!! json_encode($seo['schema']) !!}
        </script>
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
