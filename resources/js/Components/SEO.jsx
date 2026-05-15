import { Head } from '@inertiajs/react';

export default function SEO({ seo }) {
    if (!seo) return null;

    return (
        <Head>
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} />
            <meta name="keywords" content={seo.keywords} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:site_name" content="Healing Touch Hospital" />
            
            {/* JSON-LD Schema */}
            {seo.schema && (
                <script type="application/ld+json">
                    {JSON.stringify(seo.schema)}
                </script>
            )}
        </Head>
    );
}
