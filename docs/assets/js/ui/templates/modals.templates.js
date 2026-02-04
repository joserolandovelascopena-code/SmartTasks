// modals.templates.js
export function getTaskListItemHtml(task) {
  return `
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
}
