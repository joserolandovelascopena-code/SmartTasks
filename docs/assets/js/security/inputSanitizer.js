// Normaliza espacios y formato
export function normalizeText(text = "") {
  return text.trim().replace(/\s+/g, " ");
}

// Sanitiza contra XSS
export function sanitizeText(text = "") {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Validación genérica de texto
export function validateTextLength(text, { min = 3, max = 120 } = {}) {
  if (text.length < min) return `El texto es muy corto (mín ${min})`;
  if (text.length > max) return `El texto es muy largo (máx ${max})`;
  return null;
}

// Pipeline completo (opcional, MUY útil)
export function sanitizeAndValidate(text, options) {
  const normalized = normalizeText(text);
  const sanitized = sanitizeText(normalized);
  const error = validateTextLength(sanitized, options);

  return {
    value: sanitized,
    error,
  };
}
