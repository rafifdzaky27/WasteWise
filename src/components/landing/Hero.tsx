import Image from "next/image";
import Link from "next/link";
import heroBg from "../../assets/images/hero-bg.png";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden rounded-b-[48px] mx-auto max-w-[1120px]"
      style={{ minHeight: "660px" }}
    >
      {/* Background Image */}
      <Image
        src={heroBg}
        alt="Green seedling growing from soil"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-background/90" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-40 pb-24 min-h-[660px]">
        {/* Tag */}
        <p className="text-xs font-semibold tracking-[2.4px] uppercase text-primary mb-6 animate-fade-in">
          Eco-Tech Intelligence
        </p>

        {/* Heading */}
        <h1 className="animate-fade-in-up">
          <span className="block text-5xl sm:text-7xl md:text-8xl font-medium text-primary-darker tracking-tight leading-tight">
            Turning Trash into
          </span>
          <span className="block text-5xl sm:text-7xl md:text-8xl font-serif italic text-primary tracking-tight leading-tight">
            Treasures.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-lg sm:text-xl text-stone-dark max-w-xl leading-relaxed animate-fade-in-up animate-delay-200">
          A circular economy platform empowering local communities through
          intelligent waste management and community rewards.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10 animate-fade-in-up animate-delay-300">
          <Link
            href="#"
            className="flex items-center gap-2 bg-white/60 border border-stone-border text-foreground text-base font-medium px-8 py-4 rounded-full shadow-md hover:bg-white/80 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore Impact
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-primary-darker text-base font-medium px-8 py-4 rounded-full hover:bg-white/30 transition-all duration-300"
          >
            Get Started
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="ml-1"
            >
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
