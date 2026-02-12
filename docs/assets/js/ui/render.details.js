// render.details.js
import { getTaskDetailsHtml } from "./templates/task.details.js";
import { formatFechaPlano, formatHoraPlano } from "./render.tasks.js";

function isMobileViewport() {
  return window.matchMedia("(max-width: 700px)").matches;
}

function ensureMobileTaskSheet() {
  let sheet = document.querySelector(".task-sheet-modal");
  if (sheet) return sheet;

  sheet = document.createElement("section");
  sheet.className = "task-sheet-modal";
  sheet.innerHTML = `
    <div class="task-sheet-modal__backdrop"></div>
    <article class="task-sheet-modal__content">
      <div class="task-sheet-modal__handle"></div>
      <div class="task-sheet-modal__body"></div>
    </article>
  `;

  document.body.appendChild(sheet);

  const closeSheet = () => {
    sheet.classList.remove("show");
    document.body.classList.remove("task-sheet-open");
  };

  sheet
    .querySelector(".task-sheet-modal__backdrop")
    ?.addEventListener("click", closeSheet);

  sheet.addEventListener("click", (e) => {
    if (e.target.closest(".panel-mobile-close")) {
      closeSheet();
    }
  });

  return sheet;
}

function renderMobileSheet(detailsHtml) {
  if (!isMobileViewport()) return;

  const sheet = ensureMobileTaskSheet();
  const body = sheet.querySelector(".task-sheet-modal__body");
  if (!body) return;

  body.innerHTML = detailsHtml;

  requestAnimationFrame(() => {
    sheet.classList.add("show");
    document.body.classList.add("task-sheet-open");
  });
}

export function getPromandaElements() {
  return {
    container: document.querySelector(".progamadaTarea"),
    empty: document.querySelector(".panel-vacio"),
    panel: document.querySelector(".panel-detalle"),
  };
}

export function getIconCategoria(categoria) {
  const icons = {
    Trabajo: "fa-briefcase",
    Estudio: "fa-book",
    Dieta: "fa-apple-whole",
    Marketing: "fa-chart-line",
    "Rutina diaria": "fa-person-running",
    Fitness: "fa-dumbbell",
    Festividades: "fa-church",
    Vacaciones: "fa-umbrella-beach",
  };

  return icons[categoria] || "fa-layer-group";
}

export function renderPromandaTarea(task) {
  const { empty, panel } = getPromandaElements();
  if (!panel || !empty || !task) return;

  const detailsHtml = getTaskDetailsHtml(task, {
    formatFechaPlano,
    formatHoraPlano,
    getIconCategoria,
  });

  empty.classList.add("hidden");
  panel.classList.remove("hidden");
  panel.innerHTML = detailsHtml;

  renderMobileSheet(detailsHtml);
}
