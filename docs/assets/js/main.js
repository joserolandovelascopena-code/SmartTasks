/* main.js ======================== */

import { UIST } from "./ui/ui.selectors.js";

// Servicios / auth
import "./supabase.js";
import "./auth.js";

// Core
import { App } from "./core/app.js";
import "./storage.js";

// UI base (LEGACY, en migración)
import "./ui/ui.selectors.js";
import "./ui.js";

// UI modular NUEVO
import "./ui/events.js";
import "./ui/render.tasks.js";

// Modales y mensajes
import "./modals/modals.js";
import "./modals/warning_messages/warningMessages.js";

// Tema
import "./themeManager/theme.js";

// Bootstrap
import { protectRoute, logout } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  await protectRoute();
  UIST.init();
  await App.init();

  const btn = document.getElementById("logoutBtn");
  if (btn) btn.onclick = () => logout();

  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./sw.js");
    } catch (err) {
      // Registro fallÃ³, no bloquea la app
      console.warn("Service Worker no registrado:", err);
    }
  }
});
