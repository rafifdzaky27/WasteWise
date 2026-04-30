import About from "../../../components/landing/About";

import Image from "next/image";
import pradiptaImg from "../../../assets/images/pradipta.jpg";
import rafifImg from "../../../assets/images/rafif.jpg";
import sahalImg from "../../../assets/images/sahal.jpg";

export default function AboutPage() {
  return (
    <div className="animate-fade-in pt-16">
      <About />

      {/* Profil Tim Section */}
      <section className="w-full max-w-[1152px] mx-auto px-6 py-16 mb-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground">
            Tim{" "}
            <span className="font-serif italic text-primary">ImpactCrafters</span>
          </h2>
          <p className="mt-4 text-base text-muted max-w-2xl mx-auto leading-relaxed">
            Inovator di balik WasteWise — I/O Festival 2026
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Rafif Dzaky Daniswara */}
          <div className="bg-white border border-stone-border rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-28 h-28 rounded-full mx-auto mb-4 overflow-hidden relative border-4 border-stone-light shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Image src={rafifImg} alt="Rafif Dzaky Daniswara" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Rafif Dzaky Daniswara</h3>
            <p className="text-sm text-primary font-medium mt-1">Frontend Developer</p>
            <p className="text-xs text-muted mt-0.5">1202223211</p>
          </div>

          {/* Pradipta Muhtadin (Tengah) */}
          <div className="bg-white border border-stone-border rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-28 h-28 rounded-full mx-auto mb-4 overflow-hidden relative border-4 border-stone-light shadow-sm group-hover:scale-105 transition-transform duration-300">
              {/* pradipta and sahal images were swapped */}
              <Image src={sahalImg} alt="Pradipta Muhtadin" fill className="object-cover object-top" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Pradipta Muhtadin</h3>
            <p className="text-sm text-primary font-medium mt-1">Project Manager</p>
            <p className="text-xs text-muted mt-0.5">1202220327</p>
          </div>

          {/* Sahal Fajri */}
          <div className="bg-white border border-stone-border rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-28 h-28 rounded-full mx-auto mb-4 overflow-hidden relative border-4 border-stone-light shadow-sm group-hover:scale-105 transition-transform duration-300">
              {/* pradipta and sahal images were swapped */}
              <Image src={pradiptaImg} alt="Sahal Fajri" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Sahal Fajri</h3>
            <p className="text-sm text-primary font-medium mt-1">Backend Developer</p>
            <p className="text-xs text-muted mt-0.5">1202223364</p>
          </div>
        </div>
      </section>
    </div>
  );
}
