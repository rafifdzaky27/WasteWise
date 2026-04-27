interface DepositCardProps {
  wasteType: string;
  weightKg: number;
  pointsEarned: number;
  verified: boolean;
  createdAt: string;
  onShowQR?: () => void;
}

export default function DepositCard({
  wasteType,
  weightKg,
  pointsEarned,
  verified,
  createdAt,
  onShowQR,
}: DepositCardProps) {
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white border border-stone-border rounded-2xl p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        {/* Left: Icon + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg ${
              wasteType === "organic"
                ? "bg-accent-green"
                : "bg-blue-bg"
            }`}
          >
            {wasteType === "organic" ? "🌿" : "♻️"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground capitalize">
              {wasteType} Waste
            </p>
            <p className="text-xs text-muted mt-0.5">
              {formattedDate} · {formattedTime}
            </p>
          </div>
        </div>

        {/* Right: Points + Status */}
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-primary">+{pointsEarned} ⭐</p>
          <span
            className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              verified
                ? "bg-accent-green text-green-status-text"
                : "bg-yellow-bg text-amber-700"
            }`}
          >
            {verified ? "Terverifikasi" : "Menunggu"}
          </span>
        </div>
      </div>

      {/* Weight bar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-stone-light rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.min((weightKg / 10) * 100, 100)}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted whitespace-nowrap">
          {weightKg} kg
        </span>
      </div>

      {/* Show QR button (if unverified) */}
      {!verified && onShowQR && (
        <button
          onClick={onShowQR}
          className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-primary bg-accent-green rounded-xl py-2 hover:bg-accent-green-border transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5Z"
            />
          </svg>
          Show QR Code
        </button>
      )}
    </div>
  );
}
