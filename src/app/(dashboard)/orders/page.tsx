export default function OrdersPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-stone-light rounded-full flex items-center justify-center text-4xl mb-6">
        📦
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
        My Orders
      </h1>
      <p className="text-muted max-w-md">
        The circular economy marketplace will be available in Phase 5. You will be able to purchase compost and other products here.
      </p>
    </div>
  );
}
