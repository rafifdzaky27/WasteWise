export default function BioBinPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-stone-light rounded-full flex items-center justify-center text-4xl mb-6">
        🌡️
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
        BioBin IoT Dashboard
      </h1>
      <p className="text-muted max-w-md">
        This feature will be available in Phase 3. You will be able to monitor real-time compost temperature and methane gas levels.
      </p>
    </div>
  );
}
