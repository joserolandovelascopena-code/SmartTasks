// ui.js
import { App } from "./app.js";
import { Toast } from "./toastManager/toast.js";
import { OverlayManager } from "./overlayManager/overlayManager.js";
import { ScrollBody } from "./modals/scrollModals.js";
import { monthNames } from "./modals/modals.js";
import { Haptic } from "./toastManager/haptic.js";

let lastCantidadTasks = null;
let originalSelectedDate = null;

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

// PRIORIDAD – AGREGAR
document.addEventListener("click", (e) => {
  const element = e.target.closest(".options-prioridad");
  if (!element) return;

  UI.setPrioridad(element.dataset.prioridad);
});

// PRIORIDAD – EDITAR
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btnProridadEdit");
  if (!btn) return;

  const container = btn.closest(".ProridadEditar");
  UI.setPrioridad(btn.dataset.prioridad, container);
});

function cargarPrioridadEdit(container, prioridadGuardada) {
  if (!container || !prioridadGuardada) return;

  const btn = container.querySelector(
    `.btnProridadEdit[data-prioridad="${prioridadGuardada}"]`,
  );
  if (!btn) return;

  container
    .querySelectorAll(".btnProridadEdit")
    .forEach((b) => b.classList.remove("baja", "media", "alta"));

  aplicarPrioridad(btn, prioridadGuardada);
}

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

// ui.js
export const UI = {
  hasClickedTask: false,

  setPrioridad(prioridad, container = document) {
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
  },

  renderTasks(tasks) {
    const list = document.getElementById("taskList");

    list.innerHTML = "";

    tasks.forEach((task) => {
      const li = document.createElement("li");

      li.classList.add("task-item");
      li.dataset.id = task.id;

      if (task.done) {
        li.classList.add("done");
      }

      li.innerHTML = `
       <div class="box_tasks_text">
         <input type="checkbox"class="check" data-id="${task.id}" ${task.done ? "checked" : ""} />
         <span class="task-text ${task.done ? "done" : ""}">
          ${task.text}
         </span>
       </div>

    

        <div class="CategoriasProridad">
          <section class="contentCatPro">
            <span class="task-cat">
              ${task.categoria} <i class="CateIcons"></i>
            </span>
          </section>

          <section class="contentCatPro">
            <span class="task-pro">${task.prioridad}</span>
          </section>
        </div>
        <i class="fa-solid fa-ellipsis-vertical openEditar"></i>


         <div class="editar_item">
          <section class="Editar_targeta">
            <div class="backgrauEditar">
              <div class="cuerpo_modal">
                <div class="header-editar">
                  <p>Editar</p>
                  <div>
                    <span class="Closeeditar">&times;</span>
                  </div>
                </div>

                <div class="contenido-editar">
                  <article class="input-editar">
                    <input
                      type="text"
                      id="EditarTask-${task.id}"
                      name="EditarTask"
                      class="input editar InputEditarTasks"
                      placeholder="Actividad"
                    />
                  </article>

                  <article class="tarea-completada">
                    <label class="check-completada" for="MarcarTask-${task.id}">
                      <input
                        type="checkbox"
                        class="check-completada__input"
                        id="MarcarTask-${task.id}"
                     ${task.done ? "checked" : ""} />

                      <span class="check-completada__box">
                        <svg viewBox="0 0 24 24" class="check-completada__icon">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </label>

                    <h4 class="tarea-completada__texto">
                      Marcar esta tarea como completada
                    </h4>
                  </article>

                  <article class="Configuracion">
                    <div class="contenedor_Editar">
                      <div class="trabajo2 options2" data-categoria="Trabajo">
                        <p>Trabajo</p>
                        <i class="fa-solid fa-briefcase"></i>
                      </div>
                      <div class="estudio2 options2" data-categoria="Estudio">
                        <p>Estudio</p>
                        <i class="fa-solid fa-book"></i>
                      </div>
                      <div class="dieta2 options2" data-categoria="Dieta">
                        <p>Dieta</p>
                        <i class="fa-solid fa-apple-whole"></i>
                      </div>
                      <div
                        class="marketing2 options2"
                        data-categoria="Marketing"
                      >
                        <p>Marketing</p>
                        <i class="fa-solid fa-chart-line"></i>
                      </div>
                      <div
                        class="rutina_diaria2 options2"
                        data-categoria="Rutina diaria"
                      >
                        <p>Rutina díaria</p>
                        <i class="fa-solid fa-person-running"></i>
                      </div>
                      <div class="fitnest2 options2" data-categoria="Fitness">
                        <p>Fitness</p>
                        <i class="fa-solid fa-dumbbell"></i>
                      </div>
                      <div
                        class="festividades2 options2"
                        data-categoria="Festividades"
                      >
                        <p>Festividades</p>
                        <i class="fa-solid fa-church"></i>
                      </div>
                      <div
                        class="vacaciones2 options2"
                        data-categoria="Vacaciones"
                      >
                        <p>Vacaciones</p>
                        <i class="fa-solid fa-umbrella-beach"></i>
                      </div>
                    </div>
                  </article>

                  <div class="contentSeccionesEditar cajaSeccionEditar">
                    <h5>Programación de la Tarea</h5>
                    <div class="ProgramacionEditar">
                      <article class="días btnEditarProgrmacion fechaEditar">
                        <i class="fa-regular fa-calendar-days"></i>
                        <p>Día/Fecha</p>
                      </article>

                      <article class="duracion btnEditarProgrmacion">
                        <i class="fa-regular fa-clock"></i>
                        <p>Duración</p>
                      </article>

                      <article class="repetir btnEditarProgrmacion">
                        <i class="fa-solid fa-rotate-right"></i>
                        <p>Repetir</p>
                      </article>
                    </div>
                  </div>

                  <div class="contentSeccionesEditar cajaSeccionEditar">
                    <h5>Prioridad de la tarea</h5>
                    <div class="ProridadEditar">
                      <article class="EditarProridad">
                        <button data-prioridad="Baja" class="btnProridadEdit">
                          Baja
                        </button>
                      </article>
                      <article class="EditarProridad">
                        <button data-prioridad="Media" class="btnProridadEdit">
                          Media
                        </button>
                      </article>
                      <article class="EditarProridad">
                        <button data-prioridad="Alta" class="btnProridadEdit">
                          Alta
                        </button>
                      </article>
                    </div>
                  </div>

                  <div class="descripcionEditar cajaSeccionEditar">
                    <label for="EditarDescripcion-${task.id}"
                      >Descripción</label
                    >
                    <textarea
                      id="EditarDescripcion-${task.id}"
                      name="EditarDescripcion"
                      class="EditarDescripcion"
                      title="Descripción de la tarea"
                    ></textarea>
                  </div>

                  <div class="eliminarTasks">
                    <i class="far fa-trash-can"></i>
                    <h5>Eliminar tarea</h5>

                    <button class="opentAviso">Borrar tarea</button>
                  </div>

                  <article class="footer-editar">
                    <div class="GuardarCambios">
                      <button type="button" class="btnGuardarCambios">
                        Guardar Cambios
                      </button>
                    </div>
                  </article>
                  <section class="contenedorCalendarioEditar">
                    <article>
                      <div class="calendarEditar">
                        <div class="calendar-headerEditar">
                          <button class="prevMonthEditar">‹</button>
                          <span class="monthYearEditar"></span>
                          <button class="nextMonthEditar">›</button>
                        </div>

                        <div class="calendar-weekdaysEditar">
                          <span>L</span><span>M</span><span>X</span>
                          <span>J</span><span>V</span><span>S</span
                          ><span>D</span>
                        </div>

                        <div class="calendar-daysEditar"></div>

                        <div class="btnsOpcionesCanlndarEditar">
                          <div>
                            <button class="cancelarDateEditar">CANCELAR</button>
                          </div>
                          <div>
                            <button class="aceptarDateEditar">ACEPTAR</button>
                          </div>
                        </div>
                      </div>
                    </article>
                  </section>
                </div>
              </div>
            </div>
          </section>
        </div>

      <section class="advertenciaDelete">
        <div class="backgrundAviso">
          <article class="ContentAvisoDelete">
            <header class="headerMainAviso">
              <p>Borrar tarea</p>
            </header>
            <div class="headerAviso">
              <i class="far fa-trash-can"></i>
            </div>
            <div class="textAviso">
              <h3>¿Estás seguro de que deseas eliminar esta tarea?</h3>
              <p>Esta acción no se puede deshacer.</p>
              <div class="botonAviso">
                <button class="CerrarAvisoDelete">Cancelar</button
                ><button class="delete-btn">Si, Eliminar</button>
              </div>
            </div>
          </article>
        </div>
      </section>
     `;

      function initCalendarEditar(li) {
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
        originalSelectedDate = selectedDate ? new Date(selectedDate) : null;

        let currentDate = selectedDate ? new Date(selectedDate) : new Date();

        function restaurarFechaOriginal() {
          selectedDate = originalSelectedDate
            ? new Date(originalSelectedDate)
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

            // Marcar hoy
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

      // eliminar tarea
      const btnDeleteTasks = li.querySelector(".delete-btn");
      const btnCancelarDelete = li.querySelector(".CerrarAvisoDelete");
      const avisoDelete = li.querySelector(".advertenciaDelete");
      const avisofondo = li.querySelector(".backgrundAviso");
      const contenidoAviso = li.querySelector(".ContentAvisoDelete");

      function openAvisoDelete() {
        li.querySelector(".btnGuardarCambios").addEventListener(
          "click",
          (e) => {
            e.stopPropagation();
            history.back();
          },
        );

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

        UI.hasClickedTask = true;
        UI.renderTarjetas(App.tasks);
      });

      // Editar
      const contenedorEditar = li.querySelector(".editar_item");
      const modalEditar = li.querySelector(".Editar_targeta");
      const closeEditar = li.querySelector(".Closeeditar");

      function openEditarTasks() {
        ScrollBody.disableBodyScroll();

        App.currentEditTaskId = task.id;
        App.currentEditTask = { ...task };
        App.prioridadSeleccionada = task.prioridad;

        App.categoriaSeleccionada = task.categoria;
        App.prioridadSeleccionada = task.prioridad;

        contenedorEditar.classList.add("active");
        modalEditar.classList.add("active");

        UI.fillEditModal(li, App.currentEditTask);

        const calendarState = li._calendarState;
        if (calendarState && task.fecha) {
          calendarState.setDate(task.fecha);
        }

        const contPrioridad = li.querySelector(".ProridadEditar");
        UI.setPrioridad(task.prioridad, contPrioridad);

        history.pushState({ Editar_Tarea: true }, "", "#editar_tarea");
        OverlayManager.push("editarTask", closeEditarWindow);
      }

      function closeEditarWindow(li) {
        ScrollBody.enableBodyScroll();

        li?._restoreDate?.();

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

      // ---------------- ICONOS POR CATEGORÍA ----------------- //

      const icon = li.querySelector(".CateIcons");
      if (!icon) return;

      // Limpiar clases anteriores
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

      list.appendChild(li);
      initCalendarEditar(li);
    });
  },
  renderPerfile(perfile) {
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

    /*TAREAS */
    const cantidadTasks = document.getElementById("CantidadTasks");
    const badge = document.querySelector(".cantidadTasksPerfile");

    const cantidad = Number(perfile.totalTasks) || 0;

    if (cantidadTasks) {
      cantidadTasks.textContent =
        cantidad > 0 ? `${cantidad} Tareas` : "No hay tareas";
    }

    if (cantidad === 0) {
      if (badge) {
        badge.className = "cantidadTasksPerfile";
      }
      lastCantidadTasks = 0;
      return;
    }

    // ---- Mostrar badge ----
    if (!badge) return;

    badge.textContent = cantidad;
    badge.classList.add("show");

    if (lastCantidadTasks === null) {
      lastCantidadTasks = cantidad;
      return;
    }

    if (cantidad === lastCantidadTasks) return;

    badge.classList.remove("up", "down");
    void badge.offsetWidth;

    if (cantidad > lastCantidadTasks) {
      badge.classList.add("up");
    } else {
      badge.classList.add("down");
    }

    lastCantidadTasks = cantidad;
  },

  fillEditModal(li, task) {
    if (!li || !task) return;

    const input = li.querySelector(".InputEditarTasks");
    const textarea = li.querySelector(".EditarDescripcion");

    if (input) input.value = task.text;
    if (textarea) {
      textarea.value = task.descripcion ?? "";
      textarea.placeholder = "No hay descripción aún.";
    }
    li.querySelectorAll(".options2").forEach((o) => {
      o.classList.toggle("selected", o.dataset.categoria === task.categoria);
    });

    li.querySelectorAll(".btnProridadEdit").forEach((p) => {
      p.classList.toggle("selected", p.dataset.prioridad === task.prioridad);
    });
  },

  renderCategoria() {
    const opciones = document.querySelectorAll(
      ".contenedor_categoria .options",
    );

    opciones.forEach((op) => {
      op.addEventListener("click", () => {
        const selected = op.dataset.categoria;
        App.categoriaSeleccionada = selected;
        console.log("Categoria seleccionada:", selected);

        opciones.forEach((x) => x.classList.remove("selected"));
        op.classList.add("selected");
      });
    });
  },

  renderPrioridad() {
    document.querySelectorAll(".options-prioridad").forEach((prioridad) => {
      prioridad.addEventListener("click", () => {
        const selected = prioridad.dataset.prioridad;
        App.prioridadSeleccionada = selected;
        console.log("Prioridad seleccionada:", selected);
      });
    });
  },

  renderTarjetas(tasks, force = false) {
    if (this.hasClickedTask && !force) return;

    const container = document.querySelector(".CardsTareas");
    const containerList = document.getElementById("taskList");
    container.innerHTML = "";

    if (tasks.length === 0) {
      container.innerHTML = `
      <article class="viso_boxVacia">
        <div class="caja2">
               <p>No hay actividades aún.</p>
        </div>
      </article>
    `;

      containerList.innerHTML = `
      <article class="viso_caja_vacia">
        <div class="caja">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800.001" height="600" viewBox="0 0 800.001 600" role="img" artist="Katerina Limpitsouni" source="https://undraw.co/"><g transform="translate(-560 -240)"><path d="M362.407,214.655H313.476A17.758,17.758,0,0,0,295.734,232.4v53.049c-.626-.037-1.251-.093-1.868-.168a62.563,62.563,0,1,1,68.261-72.491C362.23,213.4,362.323,214.03,362.407,214.655Z" transform="translate(400.338 79.507)" fill="#f2f2f2"/>
        <path d="M944.026,216.5H317.448a19.631,19.631,0,0,0-19.61,19.61V566.669a19.631,19.631,0,0,0,19.61,19.61H944.026a19.631,19.631,0,0,0,19.61-19.61V236.1A19.631,19.631,0,0,0,944.026,216.5Zm17.742,350.174a17.758,17.758,0,0,1-17.742,17.742H317.448a17.758,17.758,0,0,1-17.742-17.742V236.1a17.758,17.758,0,0,1,17.742-17.742H944.026A17.758,17.758,0,0,1,961.768,236.1Z" transform="translate(396.365 75.799)" fill="#3f3d56"/><path d="M916.719,273.732H351.772a.934.934,0,1,1,0-1.868H916.719a.934.934,0,1,1,0,1.868Z" transform="translate(392.855 72.133)" fill="#3f3d56"/><path d="M522.772,547.582a.934.934,0,0,1-.934-.934V239.429a.934.934,0,1,1,1.868,0V546.648a.934.934,0,0,1-.934.934Z" transform="translate(381.535 74.343)" fill="#3f3d56"/><path d="M673.772,547.582a.934.934,0,0,1-.934-.934V239.429a.934.934,0,0,1,1.868,0V546.648a.934.934,0,0,1-.934.934Z" transform="translate(371.539 74.343)" fill="#3f3d56"/>
        <path d="M824.772,547.582a.934.934,0,0,1-.934-.934V239.429a.934.934,0,0,1,1.868,0V546.648a.934.934,0,0,1-.934.934Z" transform="translate(361.543 74.343)" fill="#3f3d56"/>
        <path d="M423.037,373.632H388.916a4.207,4.207,0,0,1-4.2-4.2V329.165a4.207,4.207,0,0,1,4.2-4.2h34.121a4.207,4.207,0,0,1,4.2,4.2V369.43a4.207,4.207,0,0,1-4.2,4.2Z" transform="translate(390.613 68.618)" fill="#6c63ff"/><path d="M38.323,48.669H4.2a4.207,4.207,0,0,1-4.2-4.2V4.2A4.207,4.207,0,0,1,4.2,0H38.323a4.207,4.207,0,0,1,4.2,4.2V44.467A4.207,4.207,0,0,1,38.323,48.669Z" transform="translate(754.418 541.12) rotate(22)" fill="#6c63ff"/>
        <path d="M593.037,399.632H558.916a4.207,4.207,0,0,1-4.2-4.2V355.165a4.207,4.207,0,0,1,4.2-4.2h34.121a4.207,4.207,0,0,1,4.2,4.2V395.43A4.207,4.207,0,0,1,593.037,399.632Z" transform="translate(379.359 66.897)" fill="#6c63ff"/><path d="M746.037,352.632H711.916a4.207,4.207,0,0,1-4.2-4.2V308.165a4.207,4.207,0,0,1,4.2-4.2h34.121a4.207,4.207,0,0,1,4.2,4.2V348.43A4.207,4.207,0,0,1,746.037,352.632Z" transform="translate(369.23 70.008)" fill="#6c63ff"/><path d="M887.037,352.632H852.916a4.207,4.207,0,0,1-4.2-4.2V308.165a4.207,4.207,0,0,1,4.2-4.2h34.121a4.207,4.207,0,0,1,4.2,4.2V348.43a4.207,4.207,0,0,1-4.2,4.2Z" transform="translate(359.896 70.008)" fill="#6c63ff"/>
        <path d="M952.037,364.632H917.916a4.207,4.207,0,0,1-4.2-4.2V320.165a4.207,4.207,0,0,1,4.2-4.2h34.121a4.207,4.207,0,0,1,4.2,4.2V360.43A4.207,4.207,0,0,1,952.037,364.632Z" transform="translate(355.592 69.214)" fill="#e6e6e6"/><path d="M923.037,441.632H888.916a4.207,4.207,0,0,1-4.2-4.2V397.165a4.207,4.207,0,0,1,4.2-4.2h34.121a4.207,4.207,0,0,1,4.2,4.2V437.43A4.207,4.207,0,0,1,923.037,441.632Z" transform="translate(357.512 64.116)" fill="#e6e6e6"/><path d="M799.037,425.632H764.916a4.207,4.207,0,0,1-4.2-4.2V381.165a4.207,4.207,0,0,1,4.2-4.2h34.121a4.207,4.207,0,0,1,4.2,4.2V421.43A4.207,4.207,0,0,1,799.037,425.632Z" transform="translate(365.721 65.176)" fill="#ff6584"/>
        <path d="M728.037,441.632H693.916a4.207,4.207,0,0,1-4.2-4.2V397.165a4.207,4.207,0,0,1,4.2-4.2h34.121a4.207,4.207,0,0,1,4.2,4.2V437.43A4.207,4.207,0,0,1,728.037,441.632Z" transform="translate(370.422 64.116)" fill="#e6e6e6"/>
        <path d="M575.037,509.632H540.916a4.207,4.207,0,0,1-4.2-4.2V465.165a4.207,4.207,0,0,1,4.2-4.2h34.121a4.207,4.207,0,0,1,4.2,4.2V505.43a4.207,4.207,0,0,1-4.2,4.2Z" transform="translate(380.551 59.614)" fill="#e6e6e6"/>
        <path d="M390.037,452.632H355.916a4.207,4.207,0,0,1-4.2-4.2V408.165a4.207,4.207,0,0,1,4.2-4.2h34.121a4.207,4.207,0,0,1,4.2,4.2V448.43a4.207,4.207,0,0,1-4.2,4.2Z" transform="translate(454.156 63.389)" fill="#ff6584"/><path d="M493.037,373.632H458.916a4.207,4.207,0,0,1-4.2-4.2V329.165a4.207,4.207,0,0,1,4.2-4.2h34.121a4.207,4.207,0,0,1,4.2,4.2V369.43a4.207,4.207,0,0,1-4.2,4.2Z" transform="translate(385.979 68.618)" fill="#e6e6e6"/><path d="M461.8,256.966H408.573a3.735,3.735,0,1,1,0-7.47H461.8a3.735,3.735,0,1,1,0,7.47Z" transform="translate(389.281 73.615)" fill="#ccc"/><path d="M622.8,256.966H569.573a3.735,3.735,0,1,1,0-7.47H622.8a3.735,3.735,0,0,1,0,7.47Z" transform="translate(378.621 73.615)" fill="#ccc"/>
        <path d="M773.8,256.966H720.573a3.735,3.735,0,1,1,0-7.47H773.8a3.735,3.735,0,0,1,0,7.47Z" transform="translate(368.625 73.615)" fill="#ccc"/><path d="M914.8,256.966H861.573a3.735,3.735,0,0,1,0-7.47H914.8a3.735,3.735,0,0,1,0,7.47Z" transform="translate(359.291 73.615)" fill="#ccc"/><path d="M909.139,739.442H190.321a1.159,1.159,0,1,1,0-2.318H909.139a1.159,1.159,0,1,1,0,2.318Z" transform="translate(370.838 95.915)" fill="#3f3d56"/><g transform="translate(612.412 422.64)"><rect width="15.012" height="19.787" transform="translate(111.811 383.916)" fill="#ed9da0"/>
        <path d="M652.753,496.292h31.91a18.4,18.4,0,0,0,7.926-1.806l5.882-2.827a3.534,3.534,0,0,0-.589-6.589l-12.138-3.358L664.984,470.8l-.015.077c-.386,1.966-.989,4.937-1.067,5.118-2.129,2.441-4.316,3.563-6.5,3.342-3.811-.386-6.344-4.788-6.368-4.831l-.019-.034-.039,0a2.526,2.526,0,0,0-1.962,1.07c-.87,1.313-.339,3.329-.252,3.634-1.041,1.017-1.508,6.707-1.545,7.166-1.505,1.6-2.22,3.129-2.126,4.557a4.91,4.91,0,0,0,2.06,3.45,8.912,8.912,0,0,0,5.6,1.939Z" transform="translate(-538.38 -78.933)" fill="#090814"/><rect width="15.012" height="19.787" transform="translate(21.686 398.085) rotate(-163.78)" fill="#ed9da0"/><path d="M771.946,485.969l30.641,8.914a18.4,18.4,0,0,0,8.115.48l6.439-1.072a3.533,3.533,0,0,0,1.272-6.487L807.7,481.19l-16.89-16.276-.036.068c-.919,1.776-2.332,4.464-2.454,4.616-2.725,1.748-5.14,2.216-7.175,1.39-3.553-1.435-4.754-6.368-4.766-6.417l-.009-.038-.038-.007a2.527,2.527,0,0,0-2.182.479c-1.2,1.017-1.255,3.1-1.257,3.419-1.284.687-3.321,6.019-3.485,6.449-1.891,1.111-3.006,2.384-3.314,3.784a4.909,4.909,0,0,0,1.017,3.887,8.911,8.911,0,0,0,4.837,3.427Z" transform="translate(-766.026 -78.252)" fill="#090814"/>
        <path d="M709.709,60.906A24.4,24.4,0,1,1,741.428,84.2l-4.718,31.18-24.051-20.04a60.6,60.6,0,0,0,7.986-14.081,24.38,24.38,0,0,1-10.93-20.344Z" transform="translate(-654.158 -32.577)" fill="#ed9da0"/>
        <path d="M702.047,187.525,698.523,138.2a32.62,32.62,0,0,1,1.591-12.641l10.443-31.319,30.752,9.877,12.975,29.685,7.067,12.956a15.147,15.147,0,0,1-2.586,17.962l-4.479,4.479,6.245,22.905-.657-.023.881.114s41.753,125.606,40.254,232.429H747.417l-3.181-124-9.309,128.814-70.62-4.067,37.737-237.85Z" transform="translate(-656.127 -38.739)" fill="#e6e6e6"/><path d="M704.662,92.5s1.14,8.65,11.7,8.929l21.418.573s-18.106-44.063-10.658-39.1,27.3-15.847,27.3-15.847l5.858,10.986s13.992-5.068-1.515-17.477c0,0-18.506-14.309-38.152-5.715S704.662,92.5,704.662,92.5Z" transform="translate(-656.948 -32.106)" fill="#090814"/>
        <path d="M760.382,201.45c.283-5.507-4.876-10.247-11.528-10.592a13.1,13.1,0,0,0-9.589,3.251l-.154-.008-39.436-4.084,2.958-39.14c1.094-7.569-1.031-15.2-8.487-16.914h0a14.7,14.7,0,0,0-18,14.4l.226,49.3a12.666,12.666,0,0,0,12.749,12.613l49.493-3.7a13.1,13.1,0,0,0,9.2,4.224c6.653.344,12.28-3.841,12.562-9.345Z" transform="translate(-626.052 -42.94)" fill="#ed9da0"/><path d="M771.945,133.113l-2.376,44.655-33.007-2.24,5.837-46.441" transform="translate(-691.568 -42.457)" fill="#e6e6e6"/></g><g transform="translate(938.527 407.82)"><path d="M451.075,606.189H418.227a18.945,18.945,0,0,1-8.161-1.859l-6.056-2.91a3.636,3.636,0,0,1,.606-6.782l12.492-3.457,21.375-11.233.016.081c.4,2.024,1.019,5.082,1.1,5.268,2.192,2.511,4.443,3.668,6.692,3.44,3.922-.4,6.53-4.927,6.556-4.973l.019-.035.04,0a2.6,2.6,0,0,1,2.019,1.1c.9,1.349.349,3.427.259,3.741,1.072,1.048,1.554,6.9,1.59,7.378,1.549,1.642,2.286,3.221,2.192,4.693a5.052,5.052,0,0,1-2.119,3.551,9.174,9.174,0,0,1-5.765,2Z" transform="translate(-360.847 -181.109)" fill="#090814"/><path d="M587.679,390.937a7.648,7.648,0,0,0,9.512-6.862l26.254-7.032-10.561-9.378-23.312,8.115a7.69,7.69,0,0,0-1.893,15.157Z" transform="translate(-581.826 -215.507)" fill="#9f616a"/>
        <path d="M491.08,359.56a4.48,4.48,0,0,0,3.637.289l43.188-16.391a46.119,46.119,0,0,0,24.821-20.922l18.01-32.127a14.416,14.416,0,1,0-21.51-19.2l-31.172,49.409-39.23,23a4.489,4.489,0,0,0-1.909,4.774l1.951,8.267a4.474,4.474,0,0,0,2.213,2.9Z" transform="translate(-465.985 -188.1)" fill="#6c63ff"/>
        <path d="M6.971,0-8.475,4.309l4.324,15.606L15.539,16.67Z" transform="translate(94.433 45.185)" fill="#9f616a"/><rect width="14.085" height="14.782" transform="matrix(-0.799, 0.602, -0.602, -0.799, 194.622, 387.998)" fill="#9f616a"/>
        <path d="M7.553,0H38.976a18.123,18.123,0,0,1,7.8,1.777l5.793,2.786a3.479,3.479,0,0,1-.579,6.488L40.045,14.362,19.6,25.108l-.016-.078c-.382-1.936-.972-4.86-1.048-5.039-2.1-2.4-4.25-3.509-6.4-3.29-3.752.38-6.247,4.713-6.271,4.757l-.019.034-.038,0a2.488,2.488,0,0,1-1.932-1.053c-.856-1.291-.334-3.278-.248-3.578-1.025-1-1.486-6.6-1.521-7.059C.622,8.227-.082,6.717.008,5.308a4.835,4.835,0,0,1,2.027-3.4A8.776,8.776,0,0,1,7.55,0Z" transform="matrix(-0.799, 0.602, -0.602, -0.799, 206.732, 395.713)" fill="#090814"/><rect width="14.723" height="15.452" transform="translate(78.141 395.571)" fill="#9f616a"/><path d="M458.953,300.881s6.594-5.052,6.594,7.288l1.041,40.781-11.627,38.525-6.768-12.495,2.777-27.072Z" transform="translate(-320.02 -197.156)" fill="#6c63ff"/><path d="M392.942,448.946s-7.647,37.24,2.039,67.8L400.2,630.511l19.756,2.212,6.883-87.173,6.628-43.333,13.764,39.511,45.37,83.6,20.9-16.313s-23.162-63.2-40.273-76.468l-8.582-97.742Z" transform="translate(-324.549 -233.68)" fill="#090814"/><ellipse cx="22.379" cy="22.379" rx="22.379" ry="22.379" transform="matrix(-0.48, -0.877, 0.877, -0.48, 82.756, 65.1)" fill="#9f616a"/>
        <path d="M518.308,195.172c-2.683.349-4.706-2.4-5.645-4.933s-1.654-5.491-3.986-6.861c-3.187-1.873-7.264.38-10.908-.238-4.115-.7-6.791-5.059-7-9.227s1.449-8.178,3.077-12.021l.568,4.776a9.472,9.472,0,0,1,4.139-8.279l-.733,7.009a7.439,7.439,0,0,1,8.558-6.153l-.115,4.176a69,69,0,0,1,14.315-.7c4.767.43,9.568,1.939,13.181,5.078,5.4,4.7,7.378,12.429,6.716,19.561s-3.605,13.826-6.672,20.3c-.771,1.628-1.839,3.465-3.627,3.672a3.654,3.654,0,0,1-3.579-2.7,9.775,9.775,0,0,1,.043-4.8c.453-2.4,1.022-4.858.6-7.267s-2.158-4.787-4.585-5.083-4.911,2.48-3.744,4.628Z" transform="translate(-425.067 -155.698)" fill="#090814"/><path d="M489.155,241.744l-4.686-6.505s-5.237,1.78-19.262,8.761l-.991,6.094L439.871,399.834s24.333-1.322,44.251-1.911,35.422-.447,35.422-.447l-2.626-43.287L513.1,321.219,519,290.16s7.424-28.525-21.172-43.9Z" transform="translate(-376.079 -179.669)" fill="#6c63ff"/></g></g></svg>
             </div>
        <p>Crea y planifica tus actividades con SmartTasks.</p>
      </article>
    `;
      return;
    }

    function getClasePrioridad(prioridad) {
      if (!prioridad) return "";
      return prioridad.toLowerCase(); // alta | media | baja
    }

    const primerasVeite = tasks.slice(0, 20);

    primerasVeite.forEach((task) => {
      const tarjeta = document.createElement("article");
      tarjeta.classList.add("cards-grid");
      tarjeta.dataset.id = task.id;

      tarjeta.innerHTML = `
            <div class="card-objeto">
              <div class="card-objeto__top">
                <div class="card-objeto__emoji">📌</div>
                 <div class="card-objeto__prioridad ${getClasePrioridad(task.prioridad)}">
                 ${task.prioridad}
                 </div>
              </div>

              <h4 class="card-objeto__titulo">
                ${task.text}
              </h4>

              <div class="card-objeto__info">
                <div class="card-objeto__item">
                  <i class="fa-regular fa-clock"></i>
                  <span>08:30 AM</span>
                </div>

                <div class="card-objeto__item">
                  <i class="fa-regular fa-calendar"></i>
                  <span>12 Sep 2026</span>
                </div>
              </div>

              <button class="card-objeto__editar">
                <i class="fa-solid fa-pen-to-square"></i>
                Editar
              </button>
            </div>
    `;

      container.appendChild(tarjeta);
    });
  },

  openEditarDesdeTarjeta(task) {
    const li = document.querySelector(`li[data-id="${task.id}"]`);
    if (!li) return;

    li.querySelector(".openEditar")?.click();
  },

  resetFechaHoraUI() {
    const fechaText = document.querySelector("#fecha .programacionTasks");
    const horaText = document.querySelector("#hora .programacionTasks");

    if (fechaText) fechaText.textContent = "Fecha/Día";
    if (horaText) horaText.textContent = "Hora";

    const datePicker = document.getElementById("datePicker");
    const timePicker = document.getElementById("timePicker");

    if (datePicker) datePicker.value = "";
    if (timePicker) timePicker.value = "";
  },

  initCarousel() {
    this.carousel = document.querySelector(".carousel");
    this.cards = document.querySelectorAll(".card");
    this.prev = document.querySelector(".prev");
    this.next = document.querySelector(".next");
    this.index = 0;

    // calcula ancho real (card + gap)
    this.computeCardSize();

    // vuelve a calcular si cambia el tamaño de ventana
    window.addEventListener("resize", () => {
      this.computeCardSize();
      // reajusta scroll para que el centro quede correcto
      this.carousel.scrollTo({
        left: this.index * this.cardSize,
        behavior: "auto",
      });
    });

    this.bindCarouselEvents();
    this.updateCarousel();
  },

  computeCardSize() {
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
  },

  bindCarouselEvents() {
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
      // Debounce ligero para no recalcular mil veces (opcional)
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

    // (opcional) teclas izquierda/derecha
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        this.index = Math.min(this.index + 1, this.cards.length - 1);
        this.updateCarousel();
      } else if (e.key === "ArrowLeft") {
        this.index = Math.max(this.index - 1, 0);
        this.updateCarousel();
      }
    });
  },

  updateCarousel() {
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

    // usa cardSize dinámico
    if (this.cardSize) {
      this.carousel.scrollTo({
        left: this.index * this.cardSize,
        behavior: "smooth",
      });
    } else {
      // fallback: usa offsetWidth de la primera tarjeta
      const w = this.cards[0] ? this.cards[0].offsetWidth : 0;
      this.carousel.scrollTo({
        left: this.index * w,
        behavior: "smooth",
      });
    }
  },
};
