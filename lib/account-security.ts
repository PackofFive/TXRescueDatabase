const RESET_TOKEN_BYTES = 32;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );

  return toHex(new Uint8Array(digest));
}

export function createPasswordResetToken(): string {
  const bytes = new Uint8Array(RESET_TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

export function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function getUserAgent(request: Request): string {
  return (request.headers.get("user-agent") ?? "unknown").slice(0, 500);
}

export function validateNewPassword(password: unknown): string | null {
  if (typeof password !== "string") return "Enter a new password.";
  if (password.length < 12) return "Use at least 12 characters.";
  if (password.length > 128) return "Use no more than 128 characters.";
  if (!/[a-z]/u.test(password)) return "Include at least one lowercase letter.";
  if (!/[A-Z]/u.test(password)) return "Include at least one uppercase letter.";
  if (!/[0-9]/u.test(password)) return "Include at least one number.";

  return null;
}
