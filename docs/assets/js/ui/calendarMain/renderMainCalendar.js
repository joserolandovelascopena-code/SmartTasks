import { initCalendarMain } from "../TaskCalendar.js";
import { createTaskCalendar } from "../templates/task.card.js";
import { Storage } from "../../storage.js";

function normalizeDate(dateStr) {
  if (!dateStr) return null;
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
}

function buildTasksByDate(tasks) {
  const map = new Map();
  tasks.forEach((task) => {
    const dateKey = normalizeDate(task.due_date);
    if (!dateKey) return;
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey).push(task);
  });
  return map;
}

function renderInitialEmpty(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="empty-calendar">
      <div class="empy-content">
       Selecciona un dia para ver tus tareas.
      </div>
    </div>
  `;
}

function renderEmptyList(container, titleEl, dayLabel) {
  if (titleEl) titleEl.textContent = dayLabel;
  if (!container) return;
  container.innerHTML = `
    <div class="empty-calendar">
      <div class="empy-content">
       No hay tareas para este dia.
      </div>
    </div>
  `;
}

function renderListForDate(container, titleEl, tasks, dateStr) {
  if (!container) return;
  container.innerHTML = "";

  const dayNumber = Number(dateStr.split("-")[2]);
  const titleText = `Lista de tareas para dia ${dayNumber}`;

  if (!tasks || tasks.length === 0) {
    renderEmptyList(container, titleEl, titleText);
    return;
  }

  if (titleEl) titleEl.textContent = titleText;

  tasks.forEach((task) => {
    container.appendChild(createTaskCalendar(task));
  });
}

export async function renderCalendar() {
  const CONTENEDOR_CALEDARIO_PRINCIPAL = document.querySelector(
    ".calendario-interfaz",
  );
  const CONTENEDOR_LISTA_TAREAS = document.querySelector(".lista-tareas");
  const tituloLista = document.querySelector(
    ".lista-tareas-interfaz-calendar h4",
  );

  if (!CONTENEDOR_CALEDARIO_PRINCIPAL) return;

  if (tituloLista) tituloLista.textContent = "Lista de tareas";

  const tasks = await Storage.getTasks();
  const tasksByDate = buildTasksByDate(tasks);

  initCalendarMain(CONTENEDOR_CALEDARIO_PRINCIPAL, {
    hasTasksOnDate: (dateStr) => tasksByDate.has(dateStr),
    onDaySelect: (dateStr) => {
      const tasksForDay = tasksByDate.get(dateStr) || [];
      renderListForDate(
        CONTENEDOR_LISTA_TAREAS,
        tituloLista,
        tasksForDay,
        dateStr,
      );
    },
    onMonthChange: () => {
      if (tituloLista) tituloLista.textContent = "Lista de tareas";
      renderInitialEmpty(CONTENEDOR_LISTA_TAREAS);
    },
  });

  renderInitialEmpty(CONTENEDOR_LISTA_TAREAS);
}

renderCalendar();
