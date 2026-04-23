import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/images/wastewise_logo.png";

export default function Footer() {
  return (
    <footer className="w-full max-w-[1152px] mx-auto px-6 pt-16 border-t border-stone-border">
      {/* Top */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-0 justify-between mb-16">
        {/* Brand */}
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-4">
            <Image src={logo} alt="WasteWise Logo" width={28} height={28} className="w-7 h-7 object-contain drop-shadow-sm" />
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
