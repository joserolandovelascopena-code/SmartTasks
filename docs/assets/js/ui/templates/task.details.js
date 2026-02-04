// task.details.js
export function getTaskDetailsHtml(task, helpers) {
  const { formatFechaPlano, formatHoraPlano, getIconCategoria } = helpers;

  return `
    <header class="panel-header">
      <div class="panel-emoji">
        <i class="fa-solid ${getIconCategoria(task.categoria)}"></i>
      </div>
      <div class="panel-titulo">
        <h4>${task.text}</h4>
        <p class="panel-sub">${task.categoria || "Sin categorÃ­a"} Â· ${
    task.prioridad || "Sin prioridad"
  }</p>
      </div>
    </header>

    <section class="panel-info">
      <div class="panel-item">
        <i class="fa-regular fa-calendar"></i>
        <span>${formatFechaPlano(task.due_date)}</span>
      </div>

      <div class="panel-item">
        <i class="fa-regular fa-clock"></i>
        <span>${formatHoraPlano(task.due_time)}</span>
      </div>

      <div class="panel-item">
        <i class="fa-solid fa-flag"></i>
        <span>Prioridad: ${task.prioridad || "â€”"}</span>
      </div>

      <div class="panel-item">
        <i class="fa-solid fa-check"></i>
        <span>Estado: ${task.done ? "Completada" : "Pendiente"}</span>
      </div>
    </section>

    <section class="panel-notas">
      <h5>Notas</h5>
      <p>${task.descripcion || "Sin descripciÃ³n."}</p>
    </section>

    <footer class="panel-acciones">
      <button class="btn-accion completar" data-id="${task.id}">
        <i class="fa-solid fa-check"></i> Completar
      </button>
      <button class="btn-accion removerCompletar" data-id="${task.id}">
        <span class="material-symbols-outlined"> radio_button_unchecked </span> Remover
      </button>
       <button class="btn-accion editar" data-id="${task.id}">
        <i class="fa-solid fa-pen"></i> Editar
      </button>
    </footer>
  `;
}
