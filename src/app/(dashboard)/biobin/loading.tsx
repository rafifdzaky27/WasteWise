export default function BioBinLoading() {
  return (
    <div className="max-w-6xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-stone-light rounded-xl w-72 mb-2" />
        <div className="h-4 bg-stone-light rounded w-96" />
      </div>
      <div className="flex gap-3 mb-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-12 bg-stone-light rounded-xl w-36" />
        ))}
      </div>
      <div className="h-48 bg-stone-light rounded-2xl mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-72 bg-stone-light rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
