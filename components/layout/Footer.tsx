import Link from 'next/link'

const year = new Date().getFullYear()

const services = [
  'Paid Advertising',
  'ROAS Optimization',
  'Attribution & Analytics',
  'Creative Operations',
  'Website Development',
  'Brand Scaling Strategy',
]

const disciplines = [
  'Research & Intelligence',
  'Paid Media',
  'Creative',
  'Web Engineering',
  'Client Growth',
]

export function Footer() {
  return (
    <footer
      className="border-t border-border bg-bg-surface mt-32"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-xs bg-accent-cyan/10 border border-accent-cyan/30">
                <span className="font-mono text-xs font-bold text-accent-cyan">E</span>
              </span>
              <span className="font-semibold text-sm text-text-primary">
                Everitt Marketing & Co.
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-6 max-w-xs">
              Premium growth partners for ambitious brands. Paid advertising, ROAS optimization, and brand scaling with institutional precision.
            </p>
            <p className="text-xs text-text-muted">
              Not financial advice. Illustrative performance data shown for demonstration purposes only. Results vary by account, market, and margin profile.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              Services
            </h3>
            <ul className="space-y-2.5" role="list">
              {services.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Disciplines */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              Disciplines
            </h3>
            <ul className="space-y-2.5" role="list">
              {disciplines.map((d) => (
                <li key={d}>
                  <span className="text-sm text-text-secondary">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms & Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              Platforms We Operate
            </h3>
            <ul className="space-y-2 mb-8" role="list">
              {['Meta (Facebook/Instagram)', 'Google (Search, PMax, Shopping)', 'TikTok for Business', 'LinkedIn Campaign Manager', 'Shopify', 'Next.js / Vercel'].map((p) => (
                <li key={p} className="text-sm text-text-secondary">
                  {p}
                </li>
              ))}
            </ul>
            <p className="text-2xs text-text-muted italic">
              Platform names are trademarks of their respective owners. We are not an official partner of any platform listed.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            © {year} Everitt Marketing & Co. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Terms of Service
            </a>
            <a href="#contact" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
