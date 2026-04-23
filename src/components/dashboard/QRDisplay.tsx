"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface QRDisplayProps {
  qrCode: string;
  wasteType: string;
  weightKg: number;
  pointsEarned: number;
  depositId: string;
}

export default function QRDisplay({
  qrCode,
  wasteType,
  weightKg,
  pointsEarned,
  depositId,
}: QRDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    async function generate() {
      const { generateQRDataURL } = await import("../../lib/qr");
      const dataUrl = await generateQRDataURL(qrCode);
      setQrDataUrl(dataUrl);
    }
    generate();
  }, [depositId, qrCode]);

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      {/* QR Image */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-border mb-4">
        {qrDataUrl ? (
          <Image
            src={qrDataUrl}
            alt="Deposit QR Code"
            width={250}
            height={250}
            className="mx-auto"
            unoptimized
          />
        ) : (
          <div className="w-[250px] h-[250px] mx-auto bg-stone-light rounded-xl animate-pulse" />
        )}
      </div>

      {/* Deposit Info */}
      <div className="bg-accent-green border border-accent-green-border rounded-2xl p-5 space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Deposit Receipt
        </h3>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted">Waste Type</span>
          <span className="font-medium text-foreground capitalize flex items-center gap-1.5">
            {wasteType === "organic" ? "🌿" : "♻️"} {wasteType}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted">Weight</span>
          <span className="font-medium text-foreground">{weightKg} kg</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-muted">Points Earned</span>
          <span className="font-bold text-primary text-base">
            +{pointsEarned} ⭐
          </span>
        </div>
      </div>

      {/* Instruction */}
      <p className="text-xs text-muted mt-4">
        Show this QR code to the admin at the collection point for verification.
      </p>
    </div>
  );
}
