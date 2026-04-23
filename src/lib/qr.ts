import QRCode from "qrcode";

/**
 * Generate a QR code data URI from a deposit ID.
 * The QR encodes: `wastewise:deposit:{id}`
 */
export async function generateQRDataURL(depositId: string): Promise<string> {
  const payload = `wastewise:deposit:${depositId}`;
  return QRCode.toDataURL(payload, {
    width: 300,
    margin: 2,
    color: {
      dark: "#032e15",
      light: "#ffffff",
    },
  });
}

/**
 * Parse a scanned QR string and extract the deposit ID.
 * Returns null if the format is invalid.
 */
export function parseQRPayload(raw: string): string | null {
  const prefix = "wastewise:deposit:";
  if (raw.startsWith(prefix)) {
    return raw.slice(prefix.length);
  }
  return null;
}
