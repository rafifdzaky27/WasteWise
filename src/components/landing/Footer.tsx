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
            Platform pengelolaan sampah ekonomi sirkular untuk komunitas lokal.
            Digerakkan oleh kearifan kolektif BUMDes.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-16 md:gap-24">
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-tight mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              {["Cara Kerja", "Pasar", "Peta Dampak"].map((link) => (
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
              Perusahaan
            </h4>
            <ul className="space-y-3">
              {["Tentang BUMDes", "Hubungi Kami", "Kebijakan Privasi"].map((link) => (
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
          © 2026 WasteWise. Hak cipta dilindungi.
        </p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link href="#" className="text-xs text-muted-light hover:text-primary transition-colors">
            Syarat Layanan
          </Link>
          <Link href="#" className="text-xs text-muted-light hover:text-primary transition-colors">
            Kebijakan Cookie
          </Link>
        </div>
      </div>
    </footer>
  );
}
