// ui.js
import { App } from "./app.js";

export const UI = {

  hasClickedTask: false,

  renderTasks(tasks) {
    const list = document.getElementById("taskList");
  
    list.innerHTML = "";
 

    tasks.forEach(task => {
      const li = document.createElement("li");
    
      li.classList.add("task-item");
      li.dataset.id = task.id;


   

      if (task.done) {
        li.style.background = " #7998ff38"
       } else {
        li.style.background = "#ffffffff"
      }

  
      // texto + estilo de completada
     li.innerHTML = `
     <div class="box_tasks_text">
     <input type="checkbox"class="check ${task.done ? "done" : ""}"${task.done ? "checked" : ""} data-id="${task.id}">
     <span class="task-text ${task.done ? "done" : ""}">${task.text}</span>
     </div>
     <stection class="contentCatPro">
     <span class="task-cat">${task.categoria}   <i class="CateIcons"></i></span>
     </stection>
     <stection class="contentCatPro">
     <span class="task-pro">${task.prioridad} </span>
     </stection>
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
                    class="input editar"
                    placeholder="Edita la actividad"
                  />
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
                    <div class="marketing2 options2" data-categoria="Marketing">
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

                <div class="ProgramacionEditar">
                  <article class="días btnEditarProgrmacion">
                    <i class="fa-regular fa-calendar-days"></i>
                    <p>Día/Fecha</p>
                  </article>

                  <article class="duracion btnEditarProgrmacion">
                    <i class="fa-regular fa-clock"></i>
                    <p>Duración</p>
                  </article>

                  <article class="repetir btnEditarProgrmacion">
                    <i class="fa-regular fa-calendar-days"></i>
                    <p>Repetir</p>
                  </article>
                </div>

                <div class="Proridad">
                  <article class="EditarProridad">
                    <button data="bajaEditar">Baja</button>
                  </article>
                  <article class="EditarProridad">
                    <button data="mediaEditar">Media</button>
                  </article>
                  <article class="EditarProridad">
                    <button data="altaEditar">Alta</button>
                  </article>
                </div>

                <div class="eliminarTasks">
                  <button class="opentAviso">Eliminar</button>
                </div>

                <article class="footer-editar"></article>
              </div>
            </div>
          </div>
        </section>
      </div>

       <section class="advertenciaDelete">
        <div class="backgrundAviso">
          <article class="ContentAvisoDelete">
            <header class="headerMainAviso">
              <p>Aviso de confirmación</p>
            </header>
            <div class="headerAviso">
              <i class="fa fa-xmark"></i>
            </div>
            <div class="textAviso">
              <h4>¿Estás seguro de eliminar esta tarea?</h4>
              <div class="botonAviso">
                <button class="CerrarAvisoDelete">Cancelar</button
                ><button class="delete-btn">Si, Eliminar</button>
              </div>
            </div>
          </article>
        </div>
      </section>
     `;

   
      // marcar completada
      li.querySelector(".check").addEventListener("click", () =>{
        App.toggleTask(task.id);
        
      });

      li.querySelector(".task-text").addEventListener("click", () => {
        App.toggleTask(task.id);
      });

      // eliminar tarea
li.querySelector(".opentAviso").addEventListener("click", (e) => {
  e.stopPropagation();

  const btnDeleteTasks = li.querySelector(".delete-btn");
  const btnCancelarDelete = li.querySelector(".CerrarAvisoDelete");
  const avisoDelete = li.querySelector(".advertenciaDelete");
  const avisofondo = li.querySelector(".backgrundAviso");
  const contenidoAviso = li.querySelector(".ContentAvisoDelete");
  const contenedorEditar = li.querySelector(".editar_item");

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
      avisoDelete.classList.remove("active");
      avisofondo.classList.remove("hide");
      contenidoAviso.classList.remove("hide");
      contenedorEditar.classList.remove("active");
      App.deleteTask(task.id);
    }, 400);
  };

  // ===== CANCELAR =====
btnCancelarDelete.onclick = (e) => {
  e.stopPropagation();

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
};

});

      li.addEventListener("click", (e) => {

     if (
       e.target.closest(".opentAviso") ||
       e.target.closest(".openEditar") ||
       e.target.closest(".check")
      ) return;

     UI.hasClickedTask = true;
     UI.renderTarjetas(App.tasks);
});

// ABRIR MODAL TAREA
const contenedorEditar = li.querySelector(".editar_item");
const modalEditar = li.querySelector(".Editar_targeta");
const closeEditar = li.querySelector(".Closeeditar");


 li.querySelector(".openEditar").addEventListener("click", (e) => {
  e.stopPropagation();

  UI.renderEditar(li, task);

  contenedorEditar.classList.add("active");
  modalEditar.classList.add("active");
});



closeEditar.addEventListener("click", (e) => {
  e.stopPropagation(); 
  contenedorEditar.classList.remove("active");
  modalEditar.classList.remove("active");
});


      //Estilo Proridad
  if (task.prioridad === "Ninguna") {
    li.querySelector(".task-pro").style.background = "linear-gradient(40deg, #f2fdfbff, #dffbffff, #c7effcff )";
    li.querySelector(".task-pro").style.color = "#a0a0a0ff";
  }

      if (task.prioridad === "Baja") {
        li.querySelector(".task-pro").style.background = "#c2ffcfff ";
        li.querySelector(".task-pro").style.border = "1px solid #00cc3dff";
        li.querySelector(".task-pro").style.color = "#01ad35ff";
      }

      if (task.prioridad === "Media") {
      li.querySelector(".task-pro").style.background = "linear-gradient(40deg, #02ebdf2a, #0145ff36 )";
        li.querySelector(".task-pro").style.border = "1px solid #00a9ecff";
      li.querySelector(".task-pro").style.color = "#0004fdff";
      }

      if (task.prioridad === "Alta") {

      li.querySelector(".task-pro").style.background = " #fadee3ff";
      li.querySelector(".task-pro").style.color = "#ff0000ff";
      }

      // Iconos Style categoria
      

     // ---------------- ICONOS POR CATEGORÍA ----------------- //

if (task.categoria === "Trabajo") {
  const icon = li.querySelector(".CateIcons");
  icon.style.color = "#ff00b3ff";
  icon.style.background = "rgba(0, 0, 0, 1)";
  icon.classList.add("fa-solid", "fa-briefcase");
}

if (task.categoria === "Estudio") {
  const icon = li.querySelector(".CateIcons");
  icon.style.color = "#ff0000ff";
  icon.style.background = "#ffffffff";
  icon.classList.add("fa-solid", "fa-book");
}

if (task.categoria === "Dieta") {
  const icon = li.querySelector(".CateIcons");
  icon.style.color = "#01cc4fff";
  icon.style.background = "#ffffffff";
  icon.classList.add("fa-solid", "fa-apple-whole");
}

if (task.categoria === "Marketing") {
  const icon = li.querySelector(".CateIcons");
  icon.style.color = "#0bff03ff";
  icon.style.background = "#31010181";
  icon.classList.add("fa-solid", "fa-chart-line");
}

if (task.categoria === "Rutina diaria") {
  const icon = li.querySelector(".CateIcons");
  icon.style.color = "#01cc4fff";
  icon.style.background = "#ffffffff";
  icon.classList.add("fa-solid", "fa-person-running");
}

if (task.categoria === "Fitness") {
  const icon = li.querySelector(".CateIcons");
  icon.style.color = "#ff9900ff";
  icon.style.background = "#ffffffff";
  icon.classList.add("fa-solid", "fa-dumbbell");
}

if (task.categoria === "Festividades") {
  const icon = li.querySelector(".CateIcons");
  icon.style.color = "#ff08b5ff";
  icon.style.background = "#0027a8ff";
  icon.classList.add("fa-solid", "fa-church");
}

if (task.categoria === "Vacaciones") {
  const icon = li.querySelector(".CateIcons");
  icon.style.color = "#5900ffff";
  icon.style.background = "#fedcffff";
  icon.classList.add("fa-solid", "fa-umbrella-beach");
}

      list.appendChild(li);
    });
    
  },
renderPerfile(perfile){
  if (!perfile) return;

  const nameMainUser = document.getElementById("MainNameUser");
  const nameSecondUser = document.getElementById("name_user");

  nameMainUser.textContent = "Hola, " + perfile.full_name ?? "User SmartTasks";
  nameSecondUser.textContent = perfile.full_name ?? "User SmartTasks";
},

renderEditar(li, task) {
  if (!li || !task) return;

  const input = li.querySelector(".input.editar");
  if (!input) return;

  input.value = task.text;
  input.dataset.id = task.id;
},

renderCategoria() {

  const opciones = document.querySelectorAll(".contenedor_categoria .options");

  opciones.forEach(op => {
    op.addEventListener("click", () => {

      const selected = op.dataset.categoria;
      App.categoriaSeleccionada = selected;   
      console.log("Categoria seleccionada:", selected);


      opciones.forEach(x => x.classList.remove("selected"));
      op.classList.add("selected");

    });
  });
},
renderPrioridad() {
  document.querySelectorAll(".options-prioridad").forEach(prioridad => {
    
    prioridad.addEventListener("click", () => {
      
      const selected = prioridad.dataset.prioridad;
      App.prioridadSeleccionada = selected; // ← guardar
      console.log("Prioridad seleccionada:", selected);

      // limpiar
      document.querySelectorAll(".options-prioridad").forEach(p => {
        p.style.background = "";
        p.style.color = "";
      });

      // aplicar estilo a la seleccionada
      const element = document.querySelector(`[data-prioridad="${selected}"]`);
      
      if (selected === "Baja") {
        element.style.background = "linear-gradient(40deg, #04cf60ff, #03b65cff )";;
      } else if (selected === "Media") {
        element.style.background = "linear-gradient(40deg, #02ebdfff, #0145ffff )"; 
      } else if (selected === "Alta") {
        element.style.background = "linear-gradient(40deg, #ff6565ff, #ff0162ff )";; 
      }

      element.style.color = "#fff";
    });

  });
},

renderTarjetas(tasks) {

  if (this.hasClickedTask) return;

  const container = document.querySelector(".body_tarea");
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
          <i class="fa-solid fa-calendar"></i>
        </div>
        <p>Crea y planifica tus actividades con SmartTasks.</p>
      </article>
    `;
    return;
  }

  const primerasTres = tasks.slice(0, 4);

  primerasTres.forEach(task => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("cont_tarjetas");

    tarjeta.innerHTML = `
      <div class="emoji"></div>
      <h4 class="nombre_actividad">${task.text}</h4>
      <div class="editar">
        <i class="fa-solid fa-pen-to-square editar"></i>
        <p>Editar la actividad</p>
      </div>
    `;

    container.appendChild(tarjeta);
  });
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
    this.carousel.scrollTo({ left: this.index * this.cardSize, behavior: "auto" });
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


  if (!this.cardSize || this.cardSize < 1) this.cardSize = Math.round(first.width);
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
      behavior: "smooth"
    });
  } else {
    // fallback: usa offsetWidth de la primera tarjeta
    const w = this.cards[0] ? this.cards[0].offsetWidth : 0;
    this.carousel.scrollTo({
      left: this.index * w,
      behavior: "smooth"
    });
  }
}
};
