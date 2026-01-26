let counter = 0;

export function createId(prefix = "id") {
  counter += 1;
  const base = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return `${prefix}-${counter}-${base}`;
}
