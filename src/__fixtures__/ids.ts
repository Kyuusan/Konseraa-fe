// Deterministic, schema-valid UUIDs for dummy records (version 4, RFC variant).
export function fixtureId(n: number) {
  return `00000000-0000-4000-8000-${n.toString(16).padStart(12, "0")}`;
}

export function unsplash(photo: string, width: number, height: number) {
  return `https://images.unsplash.com/${photo}?q=80&w=${width}&h=${height}&auto=format&fit=crop`;
}
