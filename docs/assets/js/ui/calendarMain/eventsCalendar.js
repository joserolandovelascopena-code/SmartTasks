//eventsCalendar.js
import { OverlayManager } from "../../overlayManager/overlayManager.js";

document.querySelector(".GoHome").addEventListener("click", () => {
  window.location.href = "../../index.html";
});

const btnOpenBuscador = document.querySelector(".OpenbusadorTareasCalendario");
const buscadorOverlay = document.querySelector(".buscador___conenedor");
const buscadorDialog = document.querySelector(".contenido___buscador");
const buscadorInput = buscadorOverlay?.querySelector("input[type='search']");

function closeBuscador() {
  if (!buscadorOverlay) return;
  buscadorOverlay.classList.remove("show");
  buscadorOverlay.setAttribute("aria-hidden", "true");
}

function openBuscador() {
  if (!buscadorOverlay) return;

  buscadorOverlay.classList.add("show");
  buscadorOverlay.setAttribute("aria-hidden", "false");

  history.pushState({ calendar_search: true }, "", "#calendar-search");
  OverlayManager.push("close-calendar-search", closeBuscador);

  buscadorInput?.focus();
}

btnOpenBuscador?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (buscadorOverlay?.classList.contains("show")) return;
  openBuscador();
});

buscadorOverlay?.addEventListener("click", (e) => {
  if (buscadorDialog?.contains(e.target)) return;
  if (buscadorOverlay.classList.contains("show")) history.back();
});

buscadorDialog?.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("click", (e) => {
  const daysContainer = document.querySelector(".days");
  const day_Detalles = document.querySelector(".day-tasks-detalles-dia");
  const container_dayDetalles = document.querySelector(
    ".lista-tareas-interfaz-calendar",
  );

  if (!day_Detalles || !container_dayDetalles || !daysContainer) return;

  if (
    !daysContainer.contains(e.target) &&
    !container_dayDetalles.contains(e.target)
  ) {
    day_Detalles.textContent = "";
  }
});
