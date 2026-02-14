import { OverlayManager } from "../../overlayManager/overlayManager.js";
import { Storage } from "../../storage.js";

document.querySelector(".GoHome")?.addEventListener("click", () => {
  window.location.href = "../../index.html";
});

const btnOpenBuscador = document.querySelector(".OpenbusadorTareasCalendario");
const buscadorOverlay = document.querySelector(".buscador___conenedor");
const buscadorDialog = document.querySelector(".contenido___buscador");
const buscadorInput = document.querySelector("#search-task-calendar");
const buscadorForm = document.querySelector(".form-buscador-calendario");
const searchResultsContainer = document.querySelector(
  ".contenedor_card_resul_busqueda",
);

const quickFilters = [
  {
    id: "alta",
    label: "Tareas con prioridad alta",
    inputValue: "prioridad alta",
    feedback: "Filtro: prioridad alta",
    predicate: (task) => (task?.prioridad || "").toLowerCase() === "alta",
  },
  {
    id: "media",
    label: "Tareas con prioridad media",
    inputValue: "prioridad media",
    feedback: "Filtro: prioridad media",
    predicate: (task) => (task?.prioridad || "").toLowerCase() === "media",
  },
  {
    id: "baja",
    label: "Tareas con prioridad baja",
    inputValue: "prioridad baja",
    feedback: "Filtro: prioridad baja",
    predicate: (task) => (task?.prioridad || "").toLowerCase() === "baja",
  },
  {
    id: "pendientes",
    label: "Tareas sin completar",
    inputValue: "sin completar",
    feedback: "Filtro: tareas sin completar",
    predicate: (task) => !task?.done,
  },
];

let allTasks = [];
let loadPromise = null;
let searchState = {
  mode: "empty",
  query: "",
  filterId: null,
};

function closeBuscador() {
  if (!buscadorOverlay) return;
  buscadorOverlay.classList.remove("show");
  buscadorOverlay.setAttribute("aria-hidden", "true");
}

function openBuscador() {
  if (!buscadorOverlay) return;

  buscadorOverlay.classList.add("show");
  buscadorOverlay.setAttribute("aria-hidden", "false");
  if (buscadorInput) buscadorInput.value = "";
  searchState = { mode: "empty", query: "", filterId: null };
  renderLoadingState();

  history.pushState({ calendar_search: true }, "", "#calendar-search");
  OverlayManager.push("close-calendar-search", closeBuscador);

  ensureTasksLoaded(true).finally(() => {
    renderSearchState();
  });

  setTimeout(() => {
    buscadorInput?.focus();
  }, 50);
}

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
}

function normalizeText(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatDateLabel(dateStr) {
  const normalized = normalizeDate(dateStr);
  if (!normalized) return "Sin fecha";

  const [year, month, day] = normalized.split("-").map(Number);
  if (!year || !month || !day) return "Sin fecha";

  const localDate = new Date(year, month - 1, day);
  if (Number.isNaN(localDate.getTime())) return "Sin fecha";

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
  }).format(localDate);
}

function formatTimeLabel(timeStr) {
  if (!timeStr) return "Sin hora";
  return String(timeStr).slice(0, 5);
}

function getTextForSearch(task) {
  const status = task?.done ? "completada" : "pendiente";
  return normalizeText(
    [
      task?.text,
      task?.descripcion,
      task?.categoria,
      task?.prioridad,
      formatDateLabel(task?.due_date),
      formatTimeLabel(task?.due_time),
      status,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function filterTasksByQuery(query) {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  return allTasks.filter((task) => {
    const haystack = getTextForSearch(task);
    return terms.every((term) => haystack.includes(term));
  });
}

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const dateA = normalizeDate(a?.due_date);
    const dateB = normalizeDate(b?.due_date);

    if (dateA && dateB && dateA !== dateB) return dateA.localeCompare(dateB);
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;

    const timeA = String(a?.due_time || "99:99");
    const timeB = String(b?.due_time || "99:99");
    return timeA.localeCompare(timeB);
  });
}

function groupTasksByDate(tasks) {
  const groups = new Map();
  const sorted = sortTasks(tasks);

  sorted.forEach((task) => {
    const key = normalizeDate(task?.due_date) || "sin-fecha";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(task);
  });

  return groups;
}

function buildTaskCard(task) {
  const estadoLabel = task?.done ? "Completada" : "Pendiente";
  const descripcion = task?.descripcion?.trim()
    ? escapeHtml(task.descripcion)
    : "Sin descripcion";

  return `
    <article class="search-card-task" data-task-id="${task.id}">
      <div class="search-card-top">
        <h6 class="search-card-title">${escapeHtml(task.text || "Sin titulo")}</h6>
        <div class="search-card-labels">
          <span class="task-pill prioridad">${escapeHtml(task.prioridad || "Sin prioridad")}</span>
          <span class="task-pill estado ${task?.done ? "done" : ""}">${estadoLabel}</span>
        </div>
      </div>

      <div class="search-card-meta">
        <span>${escapeHtml(task.categoria || "Sin categoria")}</span>
        <span>${escapeHtml(formatTimeLabel(task.due_time))}</span>
      </div>

      <div class="search-card-actions">
        <button type="button" class="btn-search-action" data-action="open">Abrir</button>
        <button type="button" class="btn-search-action primary" data-action="edit">Editar</button>
      </div>

      <div class="search-card-details" hidden>${descripcion}</div>

      <form class="search-card-editor" hidden>
        <label>Titulo</label>
        <input name="text" maxlength="95" value="${escapeHtml(task.text || "")}" required />

        <label>Descripcion</label>
        <textarea name="descripcion" maxlength="250">${escapeHtml(task.descripcion || "")}</textarea>

        <div class="search-editor-row">
          <div>
            <label>Prioridad</label>
            <select name="prioridad">
              <option value="Alta" ${task.prioridad === "Alta" ? "selected" : ""}>Alta</option>
              <option value="Media" ${task.prioridad === "Media" ? "selected" : ""}>Media</option>
              <option value="Baja" ${task.prioridad === "Baja" ? "selected" : ""}>Baja</option>
              <option value="Ninguna" ${task.prioridad === "Ninguna" ? "selected" : ""}>Ninguna</option>
            </select>
          </div>
          <div>
            <label>Estado</label>
            <select name="done">
              <option value="false" ${task?.done ? "" : "selected"}>Pendiente</option>
              <option value="true" ${task?.done ? "selected" : ""}>Completada</option>
            </select>
          </div>
        </div>

        <div class="search-card-actions">
          <button type="submit" class="btn-search-action primary" data-action="save">Guardar</button>
          <button type="button" class="btn-search-action" data-action="cancel-edit">Cancelar</button>
        </div>
      </form>
    </article>
  `;
}

function renderLoadingState() {
  if (!searchResultsContainer) return;
  searchResultsContainer.innerHTML = `
    <div class="search-feedback">Cargando tareas...</div>
  `;
}

function renderNoResults(texto) {
  if (!searchResultsContainer) return;
  searchResultsContainer.innerHTML = `
    <div class="search-feedback">${escapeHtml(texto)}</div>
    <div class="search-no-results">No se encontraron tareas para esta busqueda.</div>
  `;
}

function renderQuickSuggestions() {
  if (!searchResultsContainer) return;

  const chips = quickFilters
    .map(
      (item) =>
        `<button type="button" class="search-suggestion-chip" data-filter-id="${item.id}">${item.label} buscar</button>`,
    )
    .join("");

  searchResultsContainer.innerHTML = `
    <section class="search-empty-block">
      <h5>Busca por texto o usa una opcion rapida</h5>
      <p>Empieza escribiendo arriba o selecciona un filtro sugerido.</p>
      <div class="search-suggestions">${chips}</div>
    </section>
  `;
}

function renderGroupedResults(tasks, feedbackText) {
  if (!searchResultsContainer) return;
  if (!tasks.length) {
    renderNoResults(feedbackText);
    return;
  }

  const groups = groupTasksByDate(tasks);
  const blocks = [];
  blocks.push(`<div class="search-feedback">${escapeHtml(feedbackText)}</div>`);

  groups.forEach((groupTasks, dateKey) => {
    const title =
      dateKey === "sin-fecha" ? "Sin fecha" : formatDateLabel(dateKey);
    const cards = groupTasks.map(buildTaskCard).join("");

    blocks.push(`
      <section class="search-group">
        <h5>${escapeHtml(title)}</h5>
        <div class="search-group-cards">${cards}</div>
      </section>
    `);
  });

  searchResultsContainer.innerHTML = blocks.join("");
}

function renderSearchState() {
  const query = searchState.query.trim();

  if (searchState.mode === "filter" && searchState.filterId) {
    const filter = quickFilters.find(
      (item) => item.id === searchState.filterId,
    );
    if (!filter) {
      renderQuickSuggestions();
      return;
    }

    const filtered = allTasks.filter(filter.predicate);
    renderGroupedResults(
      filtered,
      `${filter.feedback} (${filtered.length} resultado${filtered.length === 1 ? "" : "s"})`,
    );
    return;
  }

  if (!query) {
    renderQuickSuggestions();
    return;
  }

  const matched = filterTasksByQuery(query);
  renderGroupedResults(
    matched,
    `Resultados para "${query}" (${matched.length})`,
  );
}

async function ensureTasksLoaded(forceReload = false) {
  if (loadPromise && !forceReload) return loadPromise;

  loadPromise = Storage.getTasks()
    .then((tasks) => {
      allTasks = Array.isArray(tasks) ? tasks : [];
      return allTasks;
    })
    .finally(() => {
      if (!forceReload) return;
      loadPromise = null;
    });

  return loadPromise;
}

async function saveTaskFromCard(card, form) {
  const taskId = Number(card?.dataset?.taskId);
  if (!taskId || !form) return;

  const textInput = form.querySelector('[name="text"]');
  const descripcionInput = form.querySelector('[name="descripcion"]');
  const prioridadInput = form.querySelector('[name="prioridad"]');
  const doneInput = form.querySelector('[name="done"]');

  const nextText = textInput?.value?.trim() || "";
  if (!nextText) return;

  const fields = {
    text: nextText,
    descripcion: descripcionInput?.value?.trim() || null,
    prioridad: prioridadInput?.value || "Ninguna",
    done: doneInput?.value === "true",
  };

  const updated = await Storage.updateTask(taskId, fields);
  if (!updated) return;

  allTasks = allTasks.map((task) =>
    task.id === taskId ? { ...task, ...fields } : task,
  );
  renderSearchState();
}

btnOpenBuscador?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (buscadorOverlay?.classList.contains("show")) return;
  openBuscador();
});

buscadorOverlay?.addEventListener("click", (e) => {
  if (buscadorDialog?.contains(e.target)) return;
  if (buscadorOverlay.classList.contains("show")) history.back();
});

buscadorDialog?.addEventListener("click", (e) => {
  e.stopPropagation();
});

buscadorForm?.addEventListener("submit", (e) => {
  e.preventDefault();
});

buscadorInput?.addEventListener("input", (e) => {
  searchState = {
    mode: "query",
    query: e.target.value || "",
    filterId: null,
  };
  renderSearchState();
});

searchResultsContainer?.addEventListener("click", async (e) => {
  const filterChip = e.target.closest("[data-filter-id]");
  if (filterChip) {
    const filterId = filterChip.dataset.filterId;
    const filter = quickFilters.find((item) => item.id === filterId);
    searchState = { mode: "filter", query: "", filterId };
    if (buscadorInput && filter) buscadorInput.value = filter.inputValue;
    renderSearchState();
    return;
  }

  const actionBtn = e.target.closest("[data-action]");
  if (!actionBtn) return;

  const card = actionBtn.closest(".search-card-task");
  if (!card) return;

  const details = card.querySelector(".search-card-details");
  const editor = card.querySelector(".search-card-editor");

  if (actionBtn.dataset.action === "open") {
    const shouldOpen = details?.hasAttribute("hidden");
    if (details) {
      if (shouldOpen) details.removeAttribute("hidden");
      else details.setAttribute("hidden", "");
    }
    actionBtn.textContent = shouldOpen ? "Ocultar" : "Abrir";
    return;
  }

  if (actionBtn.dataset.action === "edit") {
    if (editor?.hasAttribute("hidden")) editor.removeAttribute("hidden");
    return;
  }

  if (actionBtn.dataset.action === "cancel-edit") {
    if (editor && !editor.hasAttribute("hidden"))
      editor.setAttribute("hidden", "");
  }
});

searchResultsContainer?.addEventListener("submit", async (e) => {
  const form = e.target.closest(".search-card-editor");
  if (!form) return;

  e.preventDefault();
  const card = form.closest(".search-card-task");
  await saveTaskFromCard(card, form);
});

document.addEventListener("click", (e) => {
  const daysContainer = document.querySelector(".days");
  const day_Detalles = document.querySelector(".day-tasks-detalles-dia");
  const container_dayDetalles = document.querySelector(
    ".lista-tareas-interfaz-calendar",
  );

  if (!day_Detalles || !container_dayDetalles || !daysContainer) return;

  if (
    !daysContainer.contains(e.target) &&
    !container_dayDetalles.contains(e.target)
  ) {
    day_Detalles.textContent = "";
  }
});
