// TaskCalendar.js
import { App } from "../core/app.js";
import { OverlayManager } from "../overlayManager/overlayManager.js";
import { monthNames } from "../utils/monthNames.js";
import { Haptic } from "../toastManager/haptic.js";
import { UIState } from "./ui.state.js";

export function initCalendarMain(itemCalendar, options = {}) {
  const month_calendar_Year = itemCalendar.querySelector("#month-year");
  const daysContainer = itemCalendar.querySelector(".Container_days");
  const prevBtn = itemCalendar.querySelector(".prev-month");
  const nextBtn = itemCalendar.querySelector(".next-month");
  const headerCells = itemCalendar.querySelectorAll("thead th");
  const headerCalendar = itemCalendar.querySelector(".header-calendar");
  const { hasTasksOnDate, getTasksForDate, onDaySelect, onMonthChange } =
    options;

  if (!month_calendar_Year || !daysContainer) return;

  let currentDate = new Date();
  const baseWeekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const CATEGORIAS = {
    Trabajo: "fa-briefcase",
    Estudio: "fa-book",
    Dieta: "fa-apple-whole",
    Marketing: "fa-chart-line",
    "Rutina diaria": "fa-person-running",
    Fitness: "fa-dumbbell",
    Festividades: "fa-church",
    Vacaciones: "fa-umbrella-beach",
  };

  function setHeaderLoading(isLoading) {
    if (!headerCalendar) return;
    headerCalendar.classList.toggle("loading", isLoading);
  }

  function getCategoryFrequently(tasksForDay) {
    if (!Array.isArray(tasksForDay) || tasksForDay.length === 0) return null;

    const counts = {};
    tasksForDay.forEach((task) => {
      const categoria = task?.categoria || "Ninguna";
      counts[categoria] = (counts[categoria] || 0) + 1;
    });

    let maxCategoria = null;
    let maxCount = 0;

    Object.entries(counts).forEach(([categoria, count]) => {
      if (count > maxCount) {
        maxCategoria = categoria;
        maxCount = count;
      }
    });

    if (maxCount < 3) return null;

    return { categoria: maxCategoria, count: maxCount };
  }

  function renderMainCalendar() {
    daysContainer.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    month_calendar_Year.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const startDay = (firstDay + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    if (headerCells.length === 7) {
      const rotated = baseWeekdays
        .slice(startDay)
        .concat(baseWeekdays.slice(0, startDay));
      headerCells.forEach((th, i) => {
        th.textContent = rotated[i];
      });
    }

    let day = 1;
    let dayIndex = 0;

    while (day <= daysInMonth) {
      const row = document.createElement("tr");

      for (let i = 0; i < 7; i++) {
        const cell = document.createElement("td");

        const div = document.createElement("div");
        div.classList.add("contenido-cell");

        const emoji = document.createElement("i");

        const dayNumber = document.createElement("p");

        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          day,
        ).padStart(2, "0")}`;

        cell.classList.add("day-cell");
        cell.style.animationDelay = `${dayIndex * 18}ms`;

        if (day <= daysInMonth) {
          dayNumber.textContent = day;
          cell.dataset.date = dateStr;

          if (hasTasksOnDate?.(dateStr)) {
            cell.classList.add("day-active");
          }

          cell.onclick = () => {
            if (onDaySelect) onDaySelect(dateStr);
          };

          const today = new Date();

          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          if (isToday) {
            cell.classList.add("TodayDate");
            cell.title = "Hoy";
          }

          const tasksForDay = getTasksForDate?.(dateStr) || [];
          const frequent = getCategoryFrequently(tasksForDay);

          if (frequent && CATEGORIAS[frequent.categoria]) {
            emoji.className = `emoji-calendar fa-solid ${CATEGORIAS[frequent.categoria]}`;
            emoji.title = `${frequent.categoria} (${frequent.count})`;
          } else {
            emoji.className = "";
            emoji.style.display = "none";
            emoji.removeAttribute("title");
          }

          day++;
        } else {
          cell.textContent = "";
        }

        dayIndex++;

        row.appendChild(cell);

        cell.appendChild(div);
        div.appendChild(emoji);
        div.appendChild(dayNumber);
      }

      daysContainer.appendChild(row);
    }

    if (onMonthChange) onMonthChange({ year, month });
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      setHeaderLoading(true);
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderMainCalendar();
      Haptic.vibrateUi("success");
      window.setTimeout(() => setHeaderLoading(false), 320);
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      setHeaderLoading(true);
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderMainCalendar();
      Haptic.vibrateUi("success");
      window.setTimeout(() => setHeaderLoading(false), 320);
    };
  }

  renderMainCalendar();
}

export function initCalendarEditar(li, task) {
  const monthYear = li.querySelector(".monthYearEditar");
  const daysContainer = li.querySelector(".calendar-daysEditar");
  const calendar = li.querySelector(".calendarEditar");
  const contenedor = li.querySelector(".contenedorCalendarioEditar");

  if (!monthYear || !daysContainer) return;

  function parseLocalDate(dateStr) {
    if (!dateStr) return null;

    const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;

    const [y, m, d] = clean.split("-").map(Number);
    if (!y || !m || !d) return null;

    return new Date(y, m - 1, d);
  }

  let selectedDate = task.due_date ? parseLocalDate(task.due_date) : null;
  UIState.originalSelectedDate = selectedDate ? new Date(selectedDate) : null;

  let currentDate = selectedDate ? new Date(selectedDate) : new Date();

  function restaurarFechaOriginal() {
    selectedDate = UIState.originalSelectedDate
      ? new Date(UIState.originalSelectedDate)
      : null;

    renderCalendar();
  }

  li._restoreDate = restaurarFechaOriginal;

  function renderCalendar() {
    daysContainer.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startDay; i++) {
      daysContainer.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement("div");
      dayEl.textContent = day;

      if (selectedDate) {
        const sameDay =
          selectedDate.getFullYear() === year &&
          selectedDate.getMonth() === month &&
          selectedDate.getDate() === day;

        if (sameDay) {
          dayEl.classList.add("selected");
        }
      }

      const today = new Date();

      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day;

      if (isToday) {
        dayEl.classList.add("today");
        dayEl.title = "Hoy";
      }

      dayEl.onclick = (e) => {
        e.stopPropagation();
        daysContainer
          .querySelectorAll(".selected")
          .forEach((d) => d.classList.remove("selected"));

        dayEl.classList.add("selected");
        selectedDate = new Date(year, month, day);
        Haptic.vibrateUi("success");
      };

      daysContainer.appendChild(dayEl);
    }
  }

  li.querySelector(".fechaEditar").addEventListener(
    "click",
    openCalendarEditar,
    (e) => {
      e.stopPropagation();
    },
  );

  function openCalendarEditar() {
    contenedor.classList.add("show");
    calendar.classList.add("show");

    if (selectedDate) {
      currentDate = new Date(selectedDate);
    }

    renderCalendar();

    history.pushState({ calendar_editar: true }, "", "#calendar-system");
    OverlayManager.push("close-CalendarEditar", cerrarCalendarEditar);
  }

  li.querySelector(".cancelarDateEditar").onclick = (e) => {
    e.stopPropagation();
    restaurarFechaOriginal();
    history.back();
  };

  li.querySelector(".aceptarDateEditar").onclick = (e) => {
    e.stopPropagation();
    if (!selectedDate) return;

    App.selectedDateEditar = selectedDate.toISOString().split("T")[0];
    history.back();
  };

  li.querySelector(".prevMonthEditar").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    Haptic.vibrateUi("success");
  };

  li.querySelector(".nextMonthEditar").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    Haptic.vibrateUi("success");
  };

  function cerrarCalendarEditar() {
    calendar.classList.remove("show");
    setTimeout(() => contenedor.classList.remove("show"), 200);
  }
}
