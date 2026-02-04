// ui.js
import { registerUIEvents } from "./ui/events.js";
import {
  setPrioridad,
  renderTasks,
  renderTarjetas,
  renderPerfile,
  fillEditModal,
  renderCategoria,
  renderPrioridad,
  openEditarDesdeTarjeta,
  resetFechaHoraUI,
  initCarousel,
  computeCardSize,
  bindCarouselEvents,
  updateCarousel,
} from "./ui/render.tasks.js";

export const UI = {
  hasClickedTask: false,

  setPrioridad,
  renderTasks,
  renderTarjetas,
  renderPerfile,
  fillEditModal,
  renderCategoria,
  renderPrioridad,
  openEditarDesdeTarjeta,
  resetFechaHoraUI,
  initCarousel,
  computeCardSize,
  bindCarouselEvents,
  updateCarousel,
};

export function initUIEvents(App) {
  registerUIEvents({ App, UI });
}
