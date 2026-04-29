export default function ImpactLoading() {
  return (
    <div className="w-full max-w-[1152px] mx-auto px-6 py-32 animate-pulse">
      <div className="text-center mb-16">
        <div className="h-4 bg-stone-light rounded w-32 mx-auto mb-6" />
        <div className="h-14 bg-stone-light rounded-xl w-2/3 mx-auto mb-6" />
        <div className="h-5 bg-stone-light rounded w-1/2 mx-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-stone-light rounded-3xl border border-stone-border" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-96 bg-stone-light rounded-3xl border border-stone-border" />
        <div className="lg:col-span-2 h-96 bg-stone-light rounded-3xl border border-stone-border" />
      </div>
    </div>
  );
}
