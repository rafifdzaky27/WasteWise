import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full max-w-[1152px] mx-auto px-6 pt-16 border-t border-stone-border">
      {/* Top */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-0 justify-between mb-16">
        {/* Brand */}
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#016630"/>
            </svg>
            <span className="text-2xl font-bold text-primary-darker tracking-tight">
              WasteWise
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            A circular economy waste management for local communities. Powered
            by the collective wisdom of BUMDes.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-16 md:gap-24">
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-tight mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              {["How it Works", "Marketplace", "Impact Map"].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-muted hover:text-primary transition-colors duration-200"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-tight mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {["About BUMDes", "Contact Us", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-muted hover:text-primary transition-colors duration-200"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-5 border-t border-stone-light">
        <p className="text-xs text-muted-light">
          © 2026 WasteWise. All rights reserved.
        </p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link href="#" className="text-xs text-muted-light hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs text-muted-light hover:text-primary transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
