import About from "../../../components/landing/About";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="animate-fade-in pt-16">
      <About />

      {/* Profil Tim Section */}
      <section className="w-full max-w-[1152px] mx-auto px-6 py-16 mb-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            Profil Tim{" "}
            <span className="font-serif italic text-primary">Pengembang</span>
          </h2>
          <p className="mt-4 text-base text-muted max-w-2xl mx-auto leading-relaxed">
            Kenali lebih dekat inovator di balik WasteWise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Anggota 1 */}
          <div className="bg-white border border-stone-border rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-24 h-24 rounded-full bg-stone-light mx-auto mb-4 overflow-hidden relative">
              {/* Tempat gambar profil 1 */}
              <div className="absolute inset-0 flex items-center justify-center text-stone-dark/50">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Nama Anggota 1</h3>
            <p className="text-sm text-primary font-medium mt-1">Peran / Posisi</p>
            <p className="text-xs text-muted mt-3">Deskripsi singkat anggota tim atau motivasinya bergabung dalam pengembangan aplikasi ini.</p>
          </div>

          {/* Anggota 2 */}
          <div className="bg-white border border-stone-border rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-24 h-24 rounded-full bg-stone-light mx-auto mb-4 overflow-hidden relative">
              {/* Tempat gambar profil 2 */}
              <div className="absolute inset-0 flex items-center justify-center text-stone-dark/50">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Nama Anggota 2</h3>
            <p className="text-sm text-primary font-medium mt-1">Peran / Posisi</p>
            <p className="text-xs text-muted mt-3">Deskripsi singkat anggota tim atau motivasinya bergabung dalam pengembangan aplikasi ini.</p>
          </div>

          {/* Anggota 3 */}
          <div className="bg-white border border-stone-border rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="w-24 h-24 rounded-full bg-stone-light mx-auto mb-4 overflow-hidden relative">
              {/* Tempat gambar profil 3 */}
              <div className="absolute inset-0 flex items-center justify-center text-stone-dark/50">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Nama Anggota 3</h3>
            <p className="text-sm text-primary font-medium mt-1">Peran / Posisi</p>
            <p className="text-xs text-muted mt-3">Deskripsi singkat anggota tim atau motivasinya bergabung dalam pengembangan aplikasi ini.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
