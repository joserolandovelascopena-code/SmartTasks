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
} from "./ui/render.tasks.js";

import { renderCalendar } from "./ui/calendarMain/renderMainCalendar.js";
//import { renderTasksMainCalendar } from "./ui/calendarMain/renderMainCalendar.js";

export const UI = {
  hasClickedTask: false,

  setPrioridad,
  renderTasks,
  renderCalendar,
  //renderTasksMainCalendar,
  renderTarjetas,
  renderPerfile,
  fillEditModal,
  renderCategoria,
  renderPrioridad,
  openEditarDesdeTarjeta,
  resetFechaHoraUI,
};

export function initUIEvents(App) {
  registerUIEvents({ App, UI });
}
