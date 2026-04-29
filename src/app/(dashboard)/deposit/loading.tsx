export default function DepositLoading() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse pb-20 md:pb-0">
      <div className="mb-6">
        <div className="h-8 bg-stone-light rounded-xl w-40 mb-2" />
        <div className="h-4 bg-stone-light rounded w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-stone-light rounded-2xl h-24" />
          <div className="bg-white border border-stone-light rounded-2xl p-5 h-80" />
        </div>
        <div className="lg:col-span-3 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-stone-light rounded-2xl p-4 h-20" />
          ))}
        </div>
      </div>
    </div>
  );
}
