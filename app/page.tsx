import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Terminal } from '@/components/sections/Terminal'
import { Services } from '@/components/sections/Services'
import { CaseStudies } from '@/components/sections/CaseStudies'
import { Methodology } from '@/components/sections/Methodology'
import { Testimonials } from '@/components/sections/Testimonials'
import { Insights } from '@/components/sections/Insights'
import { LeadCapture } from '@/components/sections/LeadCapture'
import { AIWidget } from '@/components/sections/AIWidget'

export default function HomePage() {
  return (
    <>
      <Header />

      <main id="main-content">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-accent-cyan focus:text-text-inverse focus:rounded-sm focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>

        {/* 1. Hero + ticker strip */}
        <Hero />

        {/* 2. Bloomberg terminal — performance metrics */}
        <Terminal />

        {/* 3. Services grid */}
        <Services />

        {/* 4. Case studies (proof of work) */}
        <CaseStudies />

        {/* 5. Methodology */}
        <Methodology />

        {/* 6. Social proof carousel */}
        <Testimonials />

        {/* 7. Research desk / insights */}
        <Insights />

        {/* 8. Lead capture + contact form */}
        <LeadCapture />
      </main>

      <Footer />

      {/* AI widget — fixed position, always available */}
      <AIWidget />
    </>
  )
}
