import About from "../../../components/landing/About";

export default function AboutPage() {
  return (
    <div className="animate-fade-in pt-16">
      <About />

      {/* Profil Tim Section */}
      <section className="w-full max-w-[1152px] mx-auto px-6 py-16 mb-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            Tim{" "}
            <span className="font-serif italic text-primary">ImpactCrafters</span>
          </h2>
          <p className="mt-4 text-base text-muted max-w-2xl mx-auto leading-relaxed">
            Inovator di balik WasteWise — I/O Festival 2026
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pradipta Muhtadin */}
          <div className="bg-white border border-stone-border rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 mx-auto mb-4 overflow-hidden relative flex items-center justify-center">
              <span className="text-3xl font-bold text-primary/60">PM</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Pradipta Muhtadin</h3>
            <p className="text-sm text-primary font-medium mt-1">1202220327</p>
          </div>

          {/* Rafif Dzaky Daniswara */}
          <div className="bg-white border border-stone-border rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 mx-auto mb-4 overflow-hidden relative flex items-center justify-center">
              <span className="text-3xl font-bold text-primary/60">RD</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Rafif Dzaky Daniswara</h3>
            <p className="text-sm text-primary font-medium mt-1">1202223211</p>
          </div>

          {/* Sahal Fajri */}
          <div className="bg-white border border-stone-border rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 mx-auto mb-4 overflow-hidden relative flex items-center justify-center">
              <span className="text-3xl font-bold text-primary/60">SF</span>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Sahal Fajri</h3>
            <p className="text-sm text-primary font-medium mt-1">1202223364</p>
          </div>
        </div>
      </section>
    </div>
  );
}
