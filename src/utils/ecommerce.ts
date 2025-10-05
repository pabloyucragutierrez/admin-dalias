export function detectEcommerceTypes(input: string): { isPublic: boolean; isPrivate: boolean } {
  const normalized = (input || "").toUpperCase();
  const tokens = normalized.split(",").map((t) => t.trim());

  const isPublic = tokens.some((t) => t === "PUBLIC" || t.includes("PUBLIC"));
  const isPrivate = tokens.some((t) => t === "PRIVATE" || t.includes("PRIVATE"));

  return { isPublic, isPrivate };
}

export function getEcommerceLabel(isPublic: boolean, isPrivate: boolean): string {
  if (isPublic && isPrivate) return "Ecommerce Publico y Privado";
  if (isPublic) return "Ecommerce Publico";
  if (isPrivate) return "Ecommerce Privado";
  return "Ecommerce";
}

export function getEcommerceTypeLabel(typeEcommerce: string): string {
  const { isPublic, isPrivate } = detectEcommerceTypes(typeEcommerce);
  return getEcommerceLabel(isPublic, isPrivate);
}