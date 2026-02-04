// render.details.js
import { getTaskDetailsHtml } from "./templates/task.details.js";
import { formatFechaPlano, formatHoraPlano } from "./render.tasks.js";

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

  empty.classList.add("hidden");
  panel.classList.remove("hidden");

  panel.innerHTML = getTaskDetailsHtml(task, {
    formatFechaPlano,
    formatHoraPlano,
    getIconCategoria,
  });
}
