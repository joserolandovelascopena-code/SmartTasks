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

export function sanitizeTask(input) {
  return {
    text: String(input.text).slice(0, 300).replace(/[<>]/g, ""),

    descripcion: String(input.descripcion ?? "")
      .slice(0, 500)
      .replace(/[<>]/g, ""),

    categoria: String(input.categoria ?? "Ninguna")
      .slice(0, 50)
      .replace(/[<>]/g, ""),

    prioridad: String(input.prioridad ?? "Ninguna")
      .slice(0, 30)
      .replace(/[<>]/g, ""),

    done: Boolean(input.done),
    user_id: input.user_id,
    created_at: input.created_at,

    // 🔥 LO QUE FALTABA
    due_date: input.due_date || null,
    due_time: input.due_time || null,

    notify: Boolean(input.notify),
    notify_before: input.notify_before ?? null,
    repeat_type: input.repeat_type ?? null,
  };
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
