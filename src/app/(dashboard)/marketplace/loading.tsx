export default function MarketplaceLoading() {
  return (
    <div className="max-w-6xl mx-auto animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 bg-stone-light rounded-xl w-56 mb-2" />
          <div className="h-4 bg-stone-light rounded w-72" />
        </div>
        <div className="h-10 bg-stone-light rounded-xl w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white border border-stone-light rounded-2xl overflow-hidden">
            <div className="aspect-[4/3] bg-stone-light" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-stone-light rounded w-3/4" />
              <div className="h-3 bg-stone-light rounded w-1/2" />
              <div className="h-10 bg-stone-light rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
