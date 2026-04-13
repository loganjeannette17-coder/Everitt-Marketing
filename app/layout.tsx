import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { StickyCtA } from '@/components/layout/StickyCtA'
import { AnalyticsProvider } from '@/components/layout/AnalyticsProvider'

// ─── Fonts ───────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '600'],
})

// ─── Metadata ────────────────────────────────────────────────────────────────
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://everittmarketing.com'
const siteTitle = 'Everitt Marketing & Co. — Premium Growth Partners'
const siteDescription =
  'Paid advertising, ROAS optimization, website development, and brand scaling for ambitious companies. We manage media budgets with institutional precision and creative velocity.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s — Everitt Marketing & Co.',
  },
  description: siteDescription,
  keywords: [
    'growth marketing agency',
    'ROAS optimization',
    'paid advertising agency',
    'Meta ads agency',
    'Google ads management',
    'DTC marketing agency',
    'e-commerce growth',
    'B2B demand generation',
    'attribution consulting',
    'creative testing',
  ],
  authors: [{ name: 'Everitt Marketing & Co.' }],
  creator: 'Everitt Marketing & Co.',
  publisher: 'Everitt Marketing & Co.',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Everitt Marketing & Co.',
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Everitt Marketing & Co. — Premium Growth Partners',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
}

export const viewport: Viewport = {
  themeColor: '#070A0E',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

// ─── JSON-LD structured data ─────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Everitt Marketing & Co.',
  description: siteDescription,
  url: siteUrl,
  serviceType: [
    'Digital Marketing',
    'Paid Advertising',
    'Growth Strategy',
    'Web Development',
    'Marketing Analytics',
  ],
  areaServed: 'Worldwide',
  priceRange: '$$$$',
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* PostHog — only if key provided */}
        {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
                posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {api_host:'${process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'}'})
              `,
            }}
          />
        )}
        {/* Plausible — only if domain provided */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className="grain-overlay bg-bg text-text-primary antialiased">
        <CustomCursor />
        <AnalyticsProvider />
        {children}
        <StickyCtA />
      </body>
    </html>
  )
}
