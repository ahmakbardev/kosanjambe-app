/**
 * Indonesian mobile numbers get typed every which way — 0812…, +62812…,
 * 62812…, with spaces or dashes. The input accepts all of that; this turns
 * whatever was typed into one canonical form before it leaves the app.
 */

/**
 * Nomor HP Indonesia maksimal 13 digit dalam bentuk 08xx… — jadi 12 digit
 * setelah angka 0 di depan dibuang, karena +62 sudah dipajang terpisah di
 * sebelah input.
 */
export const MAX_LOCAL_DIGITS = 12;

/** Strips everything that isn't a digit, then drops the country/trunk prefix. */
export function toLocalDigits(input: string): string {
  const digits = input.replace(/\D/g, "");

  if (digits.startsWith("62")) return digits.slice(2, 2 + MAX_LOCAL_DIGITS);
  if (digits.startsWith("0")) return digits.slice(1, 1 + MAX_LOCAL_DIGITS);

  return digits.slice(0, MAX_LOCAL_DIGITS);
}

/** E.164, e.g. "+6281234567890" — the shape an SMS/OTP provider expects. */
export function toE164(input: string): string {
  return `+62${toLocalDigits(input)}`;
}

/**
 * Selalu diawali 8, panjangnya 9–12 digit di sini (10–13 kalau dihitung sama
 * angka 0 di depan). Lebih pendek berarti masih diketik, lebih panjang nggak
 * mungkin ada.
 */
export function isValidPhone(input: string): boolean {
  const local = toLocalDigits(input);
  return new RegExp(`^8\\d{8,${MAX_LOCAL_DIGITS - 1}}$`).test(local);
}

/**
 * Groups digits as 812-3456-78901 so a long number stays readable while
 * typing. Grup terakhir sengaja muat 5 digit — kalau cuma 4, digit ke-13
 * kepotong dan nomornya nggak akan pernah kebaca valid.
 */
export function formatPhone(input: string): string {
  const local = toLocalDigits(input);
  const groups = [
    local.slice(0, 3),
    local.slice(3, 7),
    local.slice(7, MAX_LOCAL_DIGITS),
  ];

  return groups.filter(Boolean).join("-");
}

/** Panjang maksimal string yang sudah diformat: 12 digit + 2 strip. */
export const MAX_FORMATTED_LENGTH = MAX_LOCAL_DIGITS + 2;
