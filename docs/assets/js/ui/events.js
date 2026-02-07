// events.js
import { getPromandaElements, renderPromandaTarea } from "./render.details.js";

export function registerUIEvents({ App, UI }) {
  document.addEventListener("click", (e) => {
    const option = e.target.closest(".options2");
    if (!option) return;

    App.categoriaSeleccionada = option.dataset.categoria;

    option
      .closest(".contenedor_Editar")
      ?.querySelectorAll(".options2")
      .forEach((o) => o.classList.remove("selected"));

    option.classList.add("selected");
  });

  document.addEventListener("click", (e) => {
    const prioridad = e.target.closest(".btnProridadEdit");
    if (!prioridad) return;

    App.prioridadSeleccionada = prioridad.dataset.prioridad;

    prioridad
      .closest(".EditarProridad")
      ?.querySelectorAll(".btnProridadEdit")
      .forEach((pro) => pro.classList.remove("selected"));

    prioridad.classList.add("selected");
  });

  document.addEventListener("click", (e) => {
    const btnEditar = e.target.closest(".card-objeto__editar");
    if (!btnEditar) return;

    e.stopPropagation();

    const card = btnEditar.closest(".cards-grid");
    if (!card) return;

    const taskId = Number(card.dataset.id);
    const task = App.tasks.find((t) => t.id === taskId);
    if (!task) return;

    UI.openEditarDesdeTarjeta(task);
  });

  // PRIORIDAD â€“ AGREGAR
  document.addEventListener("click", (e) => {
    const element = e.target.closest(".options-prioridad");
    if (!element) return;

    UI.setPrioridad(element.dataset.prioridad);
  });

  // PRIORIDAD  EDITAR
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btnProridadEdit");
    if (!btn) return;

    const container = btn.closest(".ProridadEditar");
    UI.setPrioridad(btn.dataset.prioridad, container);
  });

  /*marcar completada*/
  document.addEventListener("change", (e) => {
    if (!e.target.classList.contains("check")) return;

    const checkbox = e.target;
    const li = checkbox.closest("li");
    const id = Number(checkbox.dataset.id);

    li.classList.toggle("done", checkbox.checked);
    li.querySelector(".task-text")?.classList.toggle("done", checkbox.checked);

    const editCheckbox = li.querySelector(".check-completada__input");
    if (editCheckbox) {
      editCheckbox.checked = checkbox.checked;
    }

    App.toggleTask(id, checkbox.checked, false);
  });

  document.addEventListener("change", (e) => {
    if (!e.target.classList.contains("check-completada__input")) return;

    const editCheckbox = e.target;
    const li = editCheckbox.closest("li");
    const listCheckbox = li.querySelector(".check");
    const id = Number(li.dataset.id);

    if (listCheckbox) {
      listCheckbox.checked = editCheckbox.checked;
    }

    li.classList.toggle("done", editCheckbox.checked);
    li.querySelector(".task-text")?.classList.toggle(
      "done",
      editCheckbox.checked,
    );

    App.toggleTask(id, editCheckbox.checked, true);
  });

  document.addEventListener("click", (e) => {
    const { container, empty, panel } = getPromandaElements();
    if (!container || !panel || !empty) return;

    if (
      empty.classList.contains("hidden") &&
      !container.contains(e.target) &&
      !empty.contains(e.target)
    ) {
      empty.classList.remove("hidden");
      panel.classList.add("hidden");
    }
  });

  document.addEventListener("click", (e) => {
    const tarjeta = e.target.closest(".cards-grid");
    if (!tarjeta) return;

    if (
      e.target.closest(".card-objeto__editar") ||
      e.target.closest("input") ||
      e.target.closest("button")
    )
      return;

    const id = Number(tarjeta.dataset.id);
    const task = App.tasks.find((t) => t.id === id);
    if (!task) return;

    renderPromandaTarea(task);
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-accion.editar");
    if (!btn) return;

    const taskId = Number(btn.dataset.id);
    const task = App.tasks.find((t) => t.id === taskId);
    if (!task) return;

    UI.openEditarDesdeTarjeta(task);
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-accion");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    if (btn.classList.contains("completar")) {
      App.toggleTask(id, true, true);
    }

    if (btn.classList.contains("removerCompletar")) {
      App.toggleTask(id, false, true);
    }

    const task = App.tasks.find((t) => t.id === id);
    if (task) renderPromandaTarea(task);
  });

  document.getElementById("Calendario").addEventListener("click", () => {
    window.location.href = "./pages/calendarTasks/calendar.html";
  });
}
