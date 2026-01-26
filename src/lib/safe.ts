export function clampString(value: string, max = 500) {
  return (value || "").slice(0, max);
}

export function sanitizeText(value: string, max = 500) {
  return clampString(value.replace(/[\r\n]+/g, " ").trim(), max);
}

export function isEmailValid(value: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test((value || "").trim());
}
