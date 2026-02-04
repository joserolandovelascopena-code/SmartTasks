// TaskCalendar.js
import { App } from "../core/app.js";
import { OverlayManager } from "../overlayManager/overlayManager.js";
import { monthNames } from "../modals/modals.js";
import { Haptic } from "../toastManager/haptic.js";
import { UIState } from "./ui.state.js";

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
