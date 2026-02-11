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
  if (!container || !titleEl) return;

  container.innerHTML = "";

  const [year, month, day] = dateStr.split("-").map(Number);

  const titleText = `Lista de tareas para día ${day}`;

  if (!tasks || tasks.length === 0) {
    renderEmptyList(container, titleEl, titleText);
    return;
  }

  const today = new Date();

  const isToday =
    today.getFullYear() === year &&
    today.getMonth() === month - 1 &&
    today.getDate() === day;

  titleEl.textContent = isToday ? "Lista de tareas para hoy" : titleText;

  tasks.forEach((task) => {
    container.appendChild(createTaskCalendar(task));
  });
}

function buildResumenDesdeTareas(tasksForDay) {
  if (!Array.isArray(tasksForDay) || tasksForDay.length === 0) return [];

  const counts = new Map();
  tasksForDay.forEach((task) => {
    if (task?.done) return;
    const categoria = task?.categoria || "Sin categoria";
    counts.set(categoria, (counts.get(categoria) || 0) + 1);
  });

  return Array.from(counts.entries()).map(([categoria, total]) => ({
    categoria,
    total,
  }));
}

function normalizeResumenRows(resumen) {
  if (Array.isArray(resumen)) return resumen;
  if (resumen && typeof resumen === "object") return [resumen];
  return [];
}

function formatResumenDetalle(resumenRows) {
  if (!Array.isArray(resumenRows) || resumenRows.length === 0)
    return "0 tareas";

  const total = resumenRows.reduce(
    (acc, item) => acc + Number(item?.total || 0),
    0,
  );
  const detalle = resumenRows
    .map(
      (item) =>
        `${item?.categoria || "Sin categoria"} ${Number(item?.total || 0)}`,
    )
    .join(", ");

  const label = total === 1 ? "tarea" : "tareas";
  return `${total} ${label}: ${detalle}`;
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
    getTasksForDate: (dateStr) => tasksByDate.get(dateStr) || [],
    onDaySelect: async (dateStr) => {
      const tasksForDay = tasksByDate.get(dateStr) || [];
      renderListForDate(
        CONTENEDOR_LISTA_TAREAS,
        tituloLista,
        tasksForDay,
        dateStr,
      );

      const detallesLista = document.querySelector(".day-tasks-detalles-dia");
      if (detallesLista) detallesLista.textContent = "Cargando resumen...";

      const userId = await Storage.getCurrentUserId();
      if (!userId) {
        if (detallesLista)
          detallesLista.textContent = "Ocurrio un error inesperado";
        return;
      }

      const resumenDb = await Storage.obtenerResumenPorDia(userId, dateStr);
      const resumenRows = normalizeResumenRows(resumenDb);
      const resumenFinal =
        resumenRows.length > 0
          ? resumenRows
          : buildResumenDesdeTareas(tasksForDay);

      if (detallesLista) {
        detallesLista.textContent =
          "(" + formatResumenDetalle(resumenFinal) + ")";
      }
    },
    onMonthChange: () => {
      if (tituloLista) tituloLista.textContent = "Lista de tareas";
      renderInitialEmpty(CONTENEDOR_LISTA_TAREAS);
    },
  });

  renderInitialEmpty(CONTENEDOR_LISTA_TAREAS);
}

renderCalendar();
