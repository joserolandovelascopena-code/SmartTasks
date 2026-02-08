// task.card.js
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

export function createTaskCard(task, { formatHoraPlano, formatFechaPlano }) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("cards-grid");
  tarjeta.dataset.id = task.id;

  tarjeta.innerHTML = `
    <div class="card-objeto">
      <div class="card-objeto__top">
        <div class="card-objeto__emoji">
          <i class="objetoEmoji"></i>
        </div>

        <div class="estadoProridad">
          <div class="card-objeto__prioridad ${task.prioridad?.toLowerCase()}">
            ${task.prioridad || ""}
          </div>
          <div><p class="estadoTarea">${task.done ? "Completada" : "Pendiente"}</p></div>
        </div>
      </div>

      <h4 class="card-objeto__titulo">${task.text}</h4>

      <div class="card-objeto__info">
        <div class="card-objeto__item">
          <i class="fa-regular fa-clock"></i>
          <span>${formatHoraPlano(task.due_time)}</span>
        </div>

        <div class="card-objeto__item">
          <i class="fa-regular fa-calendar"></i>
          <span>${formatFechaPlano(task.due_date)}</span>
        </div>
      </div>

      <button class="card-objeto__editar">
        <i class="fa-solid fa-pen-to-square"></i>
        Editar
      </button>
    </div>
  `;

  const icon = tarjeta.querySelector(".objetoEmoji");
  if (task.categoria && CATEGORIAS[task.categoria]) {
    icon.className = `objetoEmoji fa-solid ${CATEGORIAS[task.categoria]}`;
  }

  const estado = tarjeta.querySelector(".estadoTarea");
  if (estado) {
    if (task.done) {
      estado.classList.add("estado");
    } else {
      estado.classList.remove("estado");
    }
  }

  return tarjeta;
}

export function createTaskCalendar(task) {
  const item_task_list = document.createElement("div");
  item_task_list.classList.add("item-tarea", "loading");
  item_task_list.dataset.id = task.id;

  item_task_list.innerHTML = `
    <span></span>
    <div class="contenido-item-tarea">
      <h5>${task.text}</h5>
      <div class="detalles-item">
        <div>
          <p>${task.categoria || "Sin categoría"} · ${
            task.prioridad || "Sin prioridad"
          }</p>
        </div>
        <div class="Icon-categoria">
          <i class="Emoji-task"></i>
        </div>
      </div>
    </div>
  `;

  const icon = item_task_list.querySelector(".Emoji-task");

  if (task.categoria && CATEGORIAS[task.categoria]) {
    icon.className = `Emoji-task fa-solid ${CATEGORIAS[task.categoria]}`;
  }

  //
  requestAnimationFrame(() => {
    setTimeout(() => {
      item_task_list.classList.remove("loading");
    }, 200);
  });

  return item_task_list;
}
