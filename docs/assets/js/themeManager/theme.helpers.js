// theme.helpers.js

export const VALID_THEMES = ["light", "dark", "system"];

export const systemPrefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/* ===== Helpers DOM ===== */
export const safeEl = (id) => document.getElementById(id);

export const qs = (selector) => document.querySelector(selector);
export const qsa = (selector) => document.querySelectorAll(selector);

/* ===== Helpers visuales ===== */
export function resetButtonStyles(...buttons) {
  buttons.forEach((btn) => {
    if (!btn) return;
    btn.style.background = "";
    btn.style.color = "";
  });
}

export function setActiveButton(button) {
  if (!button) return;
  button.style.background = "#000138";
  button.style.color = "#ffffffff";
}
