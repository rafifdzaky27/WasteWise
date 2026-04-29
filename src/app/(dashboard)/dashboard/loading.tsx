export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-stone-light rounded-xl w-64 mb-2" />
        <div className="h-4 bg-stone-light rounded w-80" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-stone-light rounded-2xl p-5 h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-stone-light rounded-2xl h-32" />
        ))}
      </div>
    </div>
  );
}
