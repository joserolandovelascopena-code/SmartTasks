// render.tasks.js
import { App } from "../core/app.js";
import { OverlayManager } from "../overlayManager/overlayManager.js";
import { ScrollBody } from "../modals/scrollModals.js";

import { UIState } from "./ui.state.js";
import { initCalendarEditar } from "./TaskCalendar.js";
import { getTaskListItemHtml } from "./templates/modals.templates.js";
import { createTaskCard } from "./templates/task.card.js";
import {
  getEmptyCardsHtml,
  getEmptyListHtml,
} from "./templates/empty.states.js";

export function formatFechaPlano(dateStr) {
  if (!dateStr) return "Sin fecha";

  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);

  const dias = ["Dom", "Lun", "Mar", "Mier", "Jue", "Vier", "Sab"];
  const meses = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];

  const diaSemana = dias[date.getDay()];
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = meses[date.getMonth()];
  const year = date.getFullYear();

  return `${diaSemana}, ${dia} ${mes} ${year}`;
}

export function formatHoraPlano(timeStr) {
  if (!timeStr) return "Sin hora";

  const [h, m] = timeStr.split(":");
  const date = new Date();
  date.setHours(h, m);

  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function prioridadValor(prioridad) {
  if (!prioridad) return 0;
  if (prioridad === "Alta") return 3;
  if (prioridad === "Media") return 2;
  if (prioridad === "Baja") return 1;
  return 0;
}

function fechaValor(task) {
  if (!task.due_date) return Infinity;
  return new Date(task.due_date).getTime();
}

function ordenarPorPrioridadYFecha(a, b) {
  const pDiff = prioridadValor(b.prioridad) - prioridadValor(a.prioridad);
  if (pDiff !== 0) return pDiff;

  return fechaValor(a) - fechaValor(b);
}

function crearSeccion(titulo) {
  const section = document.createElement("section");
  section.classList.add("seccion-tareas");

  section.innerHTML = `<h4 class="titulo-seccion">${titulo}</h4>`;

  return section;
}

export function setPrioridad(prioridad, container = document) {
  if (!prioridad) return;

  container
    .querySelectorAll(".options-prioridad, .btnProridadEdit")
    .forEach((el) => {
      el.classList.remove(
        "active-baja",
        "active-media",
        "active-alta",
        "baja",
        "media",
        "alta",
        "selected",
      );

      if (el.dataset.prioridad === prioridad) {
        el.classList.add("selected");
        el.classList.add(prioridad.toLowerCase());
        el.classList.add(`active-${prioridad.toLowerCase()}`);
      }
    });

  App.prioridadSeleccionada = prioridad;
}

export function renderTasks(tasks) {
  const ui = this;
  const list = document.getElementById("taskList");

  list.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");

    li.classList.add("task-item");
    li.dataset.id = task.id;

    if (task.done) {
      li.classList.add("done");
    }

    li.innerHTML = getTaskListItemHtml(task);

    // eliminar tarea
    const btnDeleteTasks = li.querySelector(".delete-btn");
    const btnCancelarDelete = li.querySelector(".CerrarAvisoDelete");
    const avisoDelete = li.querySelector(".advertenciaDelete");
    const avisofondo = li.querySelector(".backgrundAviso");
    const contenidoAviso = li.querySelector(".ContentAvisoDelete");

    function openAvisoDelete() {
      li.querySelector(".btnGuardarCambios").addEventListener("click", (e) => {
        e.stopPropagation();
        history.back();
      });

      // abrir
      avisoDelete.classList.add("active");
      avisofondo.classList.add("show");
      contenidoAviso.classList.add("show");

      // ===== ELIMINAR =====
      btnDeleteTasks.onclick = (e) => {
        e.stopPropagation();

        avisofondo.classList.remove("show");
        contenidoAviso.classList.remove("show");

        void avisofondo.offsetWidth;
        void contenidoAviso.offsetWidth;

        avisofondo.classList.add("hide");
        contenidoAviso.classList.add("hide");
        setTimeout(() => {
          ScrollBody.enableBodyScroll();
          history.back();
          App.deleteTask(task.id);
        }, 400);
      };

      history.pushState({ Eliminar_Tarea: true }, "", "#eliminarTarea");
      OverlayManager.push("deleteTasks", cancelarDeleteTarea);
    }

    function cancelarDeleteTarea() {
      avisofondo.classList.remove("show");
      contenidoAviso.classList.remove("show");

      void avisofondo.offsetWidth;
      void contenidoAviso.offsetWidth;

      avisofondo.classList.add("hide");
      contenidoAviso.classList.add("hide");

      setTimeout(() => {
        avisoDelete.classList.remove("active");
        avisofondo.classList.remove("hide");
        contenidoAviso.classList.remove("hide");
      }, 400);
    }

    li.querySelector(".opentAviso").addEventListener(
      "click",
      openAvisoDelete,
      (e) => {
        e.stopPropagation();
      },
    );

    // ===== CANCELAR =====
    btnCancelarDelete.onclick = (e) => {
      e.stopPropagation();
      history.back();
    };

    li.addEventListener("click", (e) => {
      if (
        e.target.closest(".check") ||
        e.target.closest("input") ||
        e.target.closest("label")
      ) {
        return;
      }

      if (e.target.closest(".opentAviso") || e.target.closest(".openEditar"))
        return;

      ui.hasClickedTask = true;
      ui.renderTarjetas(App.tasks);
    });

    // Editar
    const contenedorEditar = li.querySelector(".editar_item");
    const modalEditar = li.querySelector(".Editar_targeta");
    const closeEditar = li.querySelector(".Closeeditar");

    function openEditarTasks() {
      ScrollBody.disableBodyScroll();

      App.currentEditTaskId = task.id;
      App.currentEditTask = { ...task };
      App.selectedDateEditar = task.due_date || null;
      App.selectedTimeEditar = task.due_time
        ? String(task.due_time).split(":").slice(0, 2).join(":")
        : null;
      App.prioridadSeleccionada = task.prioridad;

      App.categoriaSeleccionada = task.categoria;
      App.prioridadSeleccionada = task.prioridad;

      contenedorEditar.classList.add("active");
      modalEditar.classList.add("active");

      // eslint-disable-next-line no-invalid-this
      // `this` here is not UI. Use outer scope.
      ui.fillEditModal(li, App.currentEditTask);

      const calendarState = li._calendarState;
      if (calendarState && task.fecha) {
        calendarState.setDate(task.fecha);
      }

      const contPrioridad = li.querySelector(".ProridadEditar");
      ui.setPrioridad(task.prioridad, contPrioridad);

      history.pushState({ Editar_Tarea: true }, "", "#editar_tarea");
      OverlayManager.push("editarTask", closeEditarWindow);
    }

    function closeEditarWindow(li) {
      ScrollBody.enableBodyScroll();

      li?._restoreDate?.();
      li?._restoreTime?.();

      contenedorEditar.classList.remove("active");
      modalEditar.classList.remove("active");
    }

    li.querySelector(".openEditar").addEventListener(
      "click",
      openEditarTasks,
      (e) => {
        e.stopPropagation();
      },
    );

    closeEditar.addEventListener("click", (e) => {
      e.stopPropagation();
      history.back();
    });

    //Estilo Proridad
    const proridadStyle = li.querySelector(".task-pro");
    if (task.prioridad === "Ninguna") {
      proridadStyle.classList.add("styleNinguna");
    }
    if (task.prioridad === "Baja") {
      proridadStyle.classList.add("styleBaja");
    }

    if (task.prioridad === "Media") {
      proridadStyle.classList.add("styleNormal");
    }

    if (task.prioridad === "Alta") {
      proridadStyle.classList.add("styleAlta");
    }

    // ---------------- ICONOS POR CATEGORÃA ----------------- //

    const icon = li.querySelector(".CateIcons");

    if (icon) {
      // limpiar clases
      icon.className = "CateIcons fa-solid";

      switch (task.categoria) {
        case "Trabajo":
          icon.classList.add("cate-trabajo", "fa-briefcase");
          break;

        case "Estudio":
          icon.classList.add("cate-estudio", "fa-book");
          break;

        case "Dieta":
          icon.classList.add("cate-dieta", "fa-apple-whole");
          break;

        case "Marketing":
          icon.classList.add("cate-marketing", "fa-chart-line");
          break;

        case "Rutina diaria":
          icon.classList.add("cate-rutina", "fa-person-running");
          break;

        case "Fitness":
          icon.classList.add("cate-fitness", "fa-dumbbell");
          break;

        case "Festividades":
          icon.classList.add("cate-festividades", "fa-church");
          break;

        case "Vacaciones":
          icon.classList.add("cate-vacaciones", "fa-umbrella-beach");
          break;
      }
    }

    list.appendChild(li);
    initCalendarEditar(li, task);
  });
}

export function renderPerfile(perfile) {
  if (!perfile) return;

  //NOMBRES
  const nameMainUser = document.getElementById("MainNameUser");
  const nameSecondUser = document.getElementById("name_user");
  const namePerfil = document.querySelectorAll(".namePerfil");
  const nameMsgs = document.querySelector(".NameUserMsg");

  const name = perfile.full_name ?? "User SmartTasks";

  if (nameMainUser) nameMainUser.textContent = "Hola, " + name;
  if (nameSecondUser) nameSecondUser.textContent = name;
  if (namePerfil) {
    namePerfil.forEach((n) => {
      n.textContent = name;
    });
  }
  if (nameMsgs) nameMsgs.textContent = name;

  const avatarImg = document.querySelector(".fotoPerfil img");
  const avatarBarraNav = document.querySelectorAll(".foto_perfil img");
  const avatarMsg = document.querySelector(".imgAppPerfil img");
  const previewImg = document.querySelector(".VisualizarFotoPerfil img");
  const imgAppPerfilGlobal = document.querySelectorAll(".ImgUserGlobal");
  const headerPerfileIMG = document.querySelector(".headerPerfil");

  if (avatarImg) {
    avatarImg.src = perfile.avatar_url
      ? `${perfile.avatar_url}?t=${Date.now()}`
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  }

  if (imgAppPerfilGlobal) {
    imgAppPerfilGlobal.forEach((im) => {
      im.src = perfile.avatar_url
        ? `${perfile.avatar_url}?t=${Date.now()}`
        : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    });
  }

  if (previewImg) {
    previewImg.src = perfile.avatar_url
      ? `${perfile.avatar_url}?t=${Date.now()}`
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  }

  avatarBarraNav.forEach((fotoNav) => {
    if (fotoNav) {
      fotoNav.src = perfile.avatar_url
        ? `${perfile.avatar_url}?t=${Date.now()}`
        : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
  });

  if (avatarMsg) {
    avatarMsg.src = perfile.avatar_url
      ? `${perfile.avatar_url}?t=${Date.now()}`
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  }

  if (headerPerfileIMG) {
    headerPerfileIMG.style.backgroundImage = perfile.header_url
      ? `url(${perfile.header_url}?t=${Date.now()})`
      : "";
  }

  // ====== Estado de tareas ======
  const badge = document.querySelector(".cantidadTasksPerfile");
  const cantidadTasks = document.querySelector(".TotalTasks");

  const cantidad = perfile.totalTasks ?? 0;

  if (cantidadTasks) {
    cantidadTasks.textContent =
      cantidad > 0 ? `${cantidad} Tareas` : "No hay tareas";
  }

  if (cantidad === 0) {
    if (badge) {
      badge.className = "cantidadTasksPerfile";
    }
    UIState.lastCantidadTasks = 0;
    return;
  }

  // ---- Mostrar badge ----
  if (!badge) return;

  badge.textContent = cantidad;
  badge.classList.add("show");

  if (UIState.lastCantidadTasks === null) {
    UIState.lastCantidadTasks = cantidad;
    return;
  }

  if (cantidad === UIState.lastCantidadTasks) return;

  badge.classList.remove("up", "down");
  void badge.offsetWidth;

  if (cantidad > UIState.lastCantidadTasks) {
    badge.classList.add("up");
  } else {
    badge.classList.add("down");
  }

  UIState.lastCantidadTasks = cantidad;
}

export function fillEditModal(li, task) {
  if (!li || !task) return;

  const input = li.querySelector(".InputEditarTasks");
  const textarea = li.querySelector(".EditarDescripcion");

  if (input) input.value = task.text;
  if (textarea) {
    textarea.value = task.descripcion ?? "";
    textarea.placeholder = "No hay descripción.";
  }
  li.querySelectorAll(".options2").forEach((o) => {
    o.classList.toggle("selected", o.dataset.categoria === task.categoria);
  });

  li.querySelectorAll(".btnProridadEdit").forEach((p) => {
    p.classList.toggle("selected", p.dataset.prioridad === task.prioridad);
  });
}

export function renderCategoria() {
  const opciones = document.querySelectorAll(".contenedor_categoria .options");

  opciones.forEach((op) => {
    op.addEventListener("click", () => {
      const selected = op.dataset.categoria;
      App.categoriaSeleccionada = selected;
      console.log("Categoria seleccionada:", selected);

      opciones.forEach((x) => x.classList.remove("selected"));
      op.classList.add("selected");
    });
  });
}

export function renderPrioridad() {
  document.querySelectorAll(".options-prioridad").forEach((prioridad) => {
    prioridad.addEventListener("click", () => {
      const selected = prioridad.dataset.prioridad;
      App.prioridadSeleccionada = selected;
      console.log("Prioridad seleccionada:", selected);
    });
  });
}

export function renderTarjetas(tasks, force = false) {
  if (this.hasClickedTask && !force) return;

  const container = document.querySelector(".CardsTareas");
  const containerList = document.getElementById("taskList");
  container.innerHTML = "";

  if (tasks.length === 0) {
    container.innerHTML = getEmptyCardsHtml();
    containerList.innerHTML = getEmptyListHtml();
    return;
  }

  /* =========================
     SECCION 1 DE PENDIENTES
  ========================= */
  const pendientes = tasks
    .filter((t) => !t.done)
    .sort(ordenarPorPrioridadYFecha);

  if (pendientes.length) {
    const secPendientes = crearSeccion("Pendientes");
    secPendientes.classList.add("pendientes");

    pendientes.forEach((task) =>
      secPendientes.appendChild(
        createTaskCard(task, {
          formatHoraPlano,
          formatFechaPlano,
        }),
      ),
    );

    container.appendChild(secPendientes);
  }

  /* =========================
     SECCION 2  COMPLETADAS
  ========================= */
  const completadas = tasks
    .filter((t) => t.done)
    .sort(ordenarPorPrioridadYFecha);

  if (completadas.length) {
    const secCompletadas = crearSeccion("Completadas");
    secCompletadas.classList.add("completadas");

    completadas.forEach((task) =>
      secCompletadas.appendChild(
        createTaskCard(task, {
          formatHoraPlano,
          formatFechaPlano,
        }),
      ),
    );

    container.appendChild(secCompletadas);
  }

  /* =========================
     SECCIÃ“N 3 â€“ POR CATEGORÃA
  ========================= */
  const conCategoria = tasks.filter((t) => t.categoria);

  if (conCategoria.length) {
    const agrupadas = {};

    conCategoria.forEach((task) => {
      if (!agrupadas[task.categoria]) {
        agrupadas[task.categoria] = [];
      }
      agrupadas[task.categoria].push(task);
    });

    Object.entries(agrupadas).forEach(([categoria, lista]) => {
      const secCat = crearSeccion(categoria);
      lista.sort(ordenarPorPrioridadYFecha).forEach((task) =>
        secCat.appendChild(
          createTaskCard(task, {
            formatHoraPlano,
            formatFechaPlano,
          }),
        ),
      );

      container.appendChild(secCat);
    });
  }
}

export function openEditarDesdeTarjeta(task) {
  const li = document.querySelector(`li[data-id="${task.id}"]`);
  if (!li) return;

  li.querySelector(".openEditar")?.click();
}

export function resetFechaHoraUI() {
  const fechaText = document.querySelector("#fecha .programacionTasks");
  const horaText = document.querySelector("#hora .programacionTasks");

  if (fechaText) fechaText.textContent = "Fecha/Dí­a";
  if (horaText) horaText.textContent = "Hora";

  const datePicker = document.getElementById("datePicker");
  const timePicker = document.getElementById("timePicker");

  if (datePicker) datePicker.value = "";
  if (timePicker) timePicker.value = "";
}

export function initCarousel() {
  this.carousel = document.querySelector(".carousel");
  this.cards = document.querySelectorAll(".card");
  this.prev = document.querySelector(".prev");
  this.next = document.querySelector(".next");
  this.index = 0;

  this.computeCardSize();

  window.addEventListener("resize", () => {
    this.computeCardSize();
    this.carousel.scrollTo({
      left: this.index * this.cardSize,
      behavior: "auto",
    });
  });

  this.bindCarouselEvents();
  this.updateCarousel();
}

export function computeCardSize() {
  this.cards = document.querySelectorAll(".card");
  if (!this.cards.length) {
    this.cardSize = 0;
    return;
  }

  const first = this.cards[0].getBoundingClientRect();

  if (this.cards.length > 1) {
    const second = this.cards[1].getBoundingClientRect();

    this.cardSize = Math.round(second.left - first.left);
  } else {
    this.cardSize = Math.round(first.width);
  }

  if (!this.cardSize || this.cardSize < 1)
    this.cardSize = Math.round(first.width);
}

export function bindCarouselEvents() {
  if (this.next) {
    this.next.addEventListener("click", () => {
      this.index = Math.min(this.index + 1, this.cards.length - 1);
      this.updateCarousel();
    });
  }
  if (this.prev) {
    this.prev.addEventListener("click", () => {
      this.index = Math.max(this.index - 1, 0);
      this.updateCarousel();
    });
  }

  if (this.carousel) {
    let raf = null;
    this.carousel.addEventListener("scroll", () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!this.cardSize) return;
        const newIndex = Math.round(this.carousel.scrollLeft / this.cardSize);
        if (newIndex !== this.index) {
          this.index = Math.max(0, Math.min(newIndex, this.cards.length - 1));
          this.updateCarousel();
        }
      });
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      this.index = Math.min(this.index + 1, this.cards.length - 1);
      this.updateCarousel();
    } else if (e.key === "ArrowLeft") {
      this.index = Math.max(this.index - 1, 0);
      this.updateCarousel();
    }
  });
}

export function updateCarousel() {
  if (!this.cards) return;

  this.cards.forEach((card, i) => {
    card.classList.remove("active", "inactive-left", "inactive-right");

    if (i === this.index) {
      card.classList.add("active");
    } else if (i < this.index) {
      card.classList.add("inactive-left");
    } else {
      card.classList.add("inactive-right");
    }
  });

  if (this.cardSize) {
    this.carousel.scrollTo({
      left: this.index * this.cardSize,
      behavior: "smooth",
    });
  } else {
    const w = this.cards[0] ? this.cards[0].offsetWidth : 0;
    this.carousel.scrollTo({
      left: this.index * w,
      behavior: "smooth",
    });
  }
}
