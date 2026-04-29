export default function OrdersLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-stone-light rounded-xl w-48 mb-2" />
        <div className="h-4 bg-stone-light rounded w-64" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-stone-light rounded-2xl p-6">
            <div className="flex justify-between mb-4">
              <div className="space-y-1">
                <div className="h-3 bg-stone-light rounded w-24" />
                <div className="h-3 bg-stone-light rounded w-32" />
              </div>
              <div className="h-6 bg-stone-light rounded-full w-20" />
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-stone-light rounded w-full" />
              <div className="h-3 bg-stone-light rounded w-2/3" />
            </div>
            <div className="border-t border-stone-light pt-3 flex justify-between">
              <div className="h-4 bg-stone-light rounded w-20" />
              <div className="h-4 bg-stone-light rounded w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
