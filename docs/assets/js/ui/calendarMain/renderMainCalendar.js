import { initCalendarMain } from "../TaskCalendar.js";
import { createTaskCalendar } from "../templates/task.card.js";

export function renderCalendar() {
  const CONTENEDOR_CALEDARIO_PRINCIPAL = document.querySelector(
    ".calendario-interfaz",
  );

  if (!CONTENEDOR_CALEDARIO_PRINCIPAL) return;
  initCalendarMain(CONTENEDOR_CALEDARIO_PRINCIPAL);
}

renderCalendar();

/*
export function renderTasksMainCalendar(task) {
  const CONTENEDOR_LISTA_TAREAS = document.querySelector(".lista-tareas");
  const daySelected = document.

  if (!CONTENEDOR_LISTA_TAREAS) return;

  CONTENEDOR_LISTA_TAREAS.appendChild(createTaskCalendar(task));
}

renderTasksMainCalendar();
*/
