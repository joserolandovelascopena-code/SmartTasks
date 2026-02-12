// TaskCalendar.js
import { App } from "../core/app.js";
import { OverlayManager } from "../overlayManager/overlayManager.js";
import { monthNames } from "../utils/monthNames.js";
import { Haptic } from "../toastManager/haptic.js";

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

    if (maxCount < 2) return null;

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
  const relojContenedor = li.querySelector(".contenedorRelojEditar");
  const reloj = li.querySelector(".relojEditar");
  const hourSelect = li.querySelector(".listaHoraEditar");
  const minuteSelect = li.querySelector(".listaMinutoEditar");
  const horaFormadaText = li.querySelector(".horaFormadaEditar h5");
  const duracionBtn = li.querySelector(".duracion");
  const duracionLabel = li.querySelector(".duracion p");

  if (!monthYear || !daysContainer) return;

  function parseLocalDate(dateStr) {
    if (!dateStr) return null;

    const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;

    const [y, m, d] = clean.split("-").map(Number);
    if (!y || !m || !d) return null;

    return new Date(y, m - 1, d);
  }

  function parseLocalTime(timeStr) {
    if (!timeStr) return null;

    const [h, m] = timeStr.split(":");
    const hour = Number(h);
    const minute = Number(m);

    if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }

  function formatTime12h(hour24, minute) {
    let hour = Number(hour24);
    const ampm = hour >= 12 ? "p.m." : "a.m.";
    hour = hour % 12 || 12;
    return `${hour} : ${minute} ${ampm}`;
  }

  let selectedDate = task.due_date ? parseLocalDate(task.due_date) : null;
  const originalSelectedDate = selectedDate ? new Date(selectedDate) : null;
  let selectedTime = parseLocalTime(task.due_time);
  const originalSelectedTime = selectedTime;

  let currentDate = selectedDate ? new Date(selectedDate) : new Date();
  let tempHour = selectedTime ? selectedTime.split(":")[0] : null;
  let tempMinute = selectedTime ? selectedTime.split(":")[1] : null;

  function restaurarFechaOriginal() {
    selectedDate = originalSelectedDate ? new Date(originalSelectedDate) : null;
    App.selectedDateEditar = selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : null;

    renderCalendar();
  }

  function actualizarTextoHoraEditar() {
    if (!duracionLabel) return;
    duracionLabel.textContent = selectedTime || "Duracion";
  }

  function actualizarHoraFormada() {
    if (!horaFormadaText) return;
    if (tempHour === null || tempMinute === null) {
      horaFormadaText.textContent = "00 : 00 a.m.";
      return;
    }

    horaFormadaText.textContent = formatTime12h(tempHour, tempMinute);
  }

  function activarSeleccionHora(contenedor, elemento) {
    if (!contenedor || !elemento) return;
    contenedor
      .querySelectorAll(".opcionHoraEditar")
      .forEach((o) => o.classList.remove("active"));
    elemento.classList.add("active");
  }

  function centrarElemento(contenedor, elemento) {
    if (!contenedor || !elemento) return;
    const target =
      elemento.offsetTop - contenedor.clientHeight / 2 + elemento.clientHeight / 2;
    contenedor.scrollTo({ top: target, behavior: "auto" });
  }

  function activarPorScroll(contenedor, tipo) {
    if (!contenedor || contenedor.dataset.scrollReady === "1") return;

    let ticking = false;
    contenedor.addEventListener("scroll", () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        const opciones = [...contenedor.children];
        if (!opciones.length) {
          ticking = false;
          return;
        }

        const centro = contenedor.scrollTop + contenedor.clientHeight / 2;
        let seleccionado = opciones[0];

        opciones.forEach((op) => {
          const opCentro = op.offsetTop + op.offsetHeight / 2;
          const seleccionadoCentro =
            seleccionado.offsetTop + seleccionado.offsetHeight / 2;
          if (Math.abs(opCentro - centro) < Math.abs(seleccionadoCentro - centro)) {
            seleccionado = op;
          }
        });

        activarSeleccionHora(contenedor, seleccionado);

        if (tipo === "hora") tempHour = seleccionado.textContent;
        if (tipo === "minuto") tempMinute = seleccionado.textContent;

        actualizarHoraFormada();
        ticking = false;
      });

      ticking = true;
    });

    contenedor.dataset.scrollReady = "1";
  }

  function crearOpcionesHora() {
    if (!hourSelect || !minuteSelect) return;
    if (hourSelect.dataset.ready === "1") return;

    for (let h = 0; h < 24; h++) {
      const div = document.createElement("div");
      div.className = "opcionHoraEditar";
      div.textContent = String(h).padStart(2, "0");
      div.onclick = () => {
        tempHour = div.textContent;
        activarSeleccionHora(hourSelect, div);
        actualizarHoraFormada();
        Haptic.vibrateUi("success");
      };
      hourSelect.appendChild(div);
    }

    for (let m = 0; m < 60; m++) {
      const div = document.createElement("div");
      div.className = "opcionHoraEditar";
      div.textContent = String(m).padStart(2, "0");
      div.onclick = () => {
        tempMinute = div.textContent;
        activarSeleccionHora(minuteSelect, div);
        actualizarHoraFormada();
        Haptic.vibrateUi("success");
      };
      minuteSelect.appendChild(div);
    }

    activarPorScroll(hourSelect, "hora");
    activarPorScroll(minuteSelect, "minuto");

    hourSelect.dataset.ready = "1";
    minuteSelect.dataset.ready = "1";
  }

  function syncSelectorTiempo() {
    if (!hourSelect || !minuteSelect) return;

    const hourOption = tempHour
      ? [...hourSelect.children].find((el) => el.textContent === tempHour)
      : null;
    const minuteOption = tempMinute
      ? [...minuteSelect.children].find((el) => el.textContent === tempMinute)
      : null;

    if (hourOption) {
      activarSeleccionHora(hourSelect, hourOption);
      centrarElemento(hourSelect, hourOption);
    } else {
      hourSelect
        .querySelectorAll(".opcionHoraEditar")
        .forEach((o) => o.classList.remove("active"));
      hourSelect.scrollTo({ top: 0, behavior: "auto" });
    }

    if (minuteOption) {
      activarSeleccionHora(minuteSelect, minuteOption);
      centrarElemento(minuteSelect, minuteOption);
    } else {
      minuteSelect
        .querySelectorAll(".opcionHoraEditar")
        .forEach((o) => o.classList.remove("active"));
      minuteSelect.scrollTo({ top: 0, behavior: "auto" });
    }
  }

  function restaurarHoraOriginal() {
    selectedTime = originalSelectedTime;
    App.selectedTimeEditar = selectedTime;

    if (selectedTime) {
      [tempHour, tempMinute] = selectedTime.split(":");
    } else {
      tempHour = null;
      tempMinute = null;
    }

    syncSelectorTiempo();
    actualizarHoraFormada();
    actualizarTextoHoraEditar();
  }

  li._restoreDate = restaurarFechaOriginal;
  li._restoreTime = restaurarHoraOriginal;

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

  li.querySelector(".fechaEditar")?.addEventListener("click", (e) => {
    e.stopPropagation();
    openCalendarEditar();
  });

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

  duracionBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    crearOpcionesHora();
    syncSelectorTiempo();
    actualizarHoraFormada();
    openRelojEditar();
  });

  li.querySelector(".cancelarHoraEditar")?.addEventListener("click", (e) => {
    e.stopPropagation();
    restaurarHoraOriginal();
    history.back();
  });

  li.querySelector(".aceptarHoraEditar")?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (tempHour === null || tempMinute === null) return;

    selectedTime = `${tempHour}:${tempMinute}`;
    App.selectedTimeEditar = selectedTime;
    actualizarTextoHoraEditar();
    history.back();
  });

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

  function openRelojEditar() {
    if (!relojContenedor || !reloj) return;

    relojContenedor.classList.add("show");
    reloj.classList.add("show");

    history.pushState({ reloj_editar: true }, "", "#reloj-editar");
    OverlayManager.push("close-RelojEditar", cerrarRelojEditar);
  }

  function cerrarRelojEditar() {
    if (!relojContenedor || !reloj) return;

    reloj.classList.remove("show");
    setTimeout(() => relojContenedor.classList.remove("show"), 200);
  }

  actualizarTextoHoraEditar();
  actualizarHoraFormada();
}
