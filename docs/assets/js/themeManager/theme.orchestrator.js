// theme.orchestrator.js
import { VALID_THEMES } from "./theme.helpers.js";
import { applyTheme } from "./theme.core.js";

export function initTheme() {
  let savedTheme = localStorage.getItem("theme");

  if (!VALID_THEMES.includes(savedTheme)) {
    savedTheme = "system";
  }

  applyTheme(savedTheme);

  document
    .getElementById("Default_light")
    ?.addEventListener("click", () => applyTheme("light"));

  document
    .getElementById("Default_dark")
    ?.addEventListener("click", () => applyTheme("dark"));

  document
    .getElementById("System_theme")
    ?.addEventListener("click", () => applyTheme("system"));

  // Detectar cambio del sistema
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (localStorage.getItem("theme") === "system") {
        applyTheme("system");
      }
    });
}
