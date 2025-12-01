let categoriaSeleccionada = "";
let prioridadSeleccionada = "";
const App = {
  tasks: Storage.getTasks(),
  categoriaSeleccionada: "", 
  prioridadSeleccionada: "",
 

  init() {
      UI.renderTasks(this.tasks);
      UI.renderTarjetas(this.tasks);
      UI.initCarousel();
      UI.renderCategoria();    
      UI.renderPrioridad();


    // Evento CLICK en el botón
    document.getElementById("Guadar-btn").addEventListener("click", () => {
      this.addTask();
    });

    // Evento ENTER en el input
    document.getElementById("newTask").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addTask();
      }
    });


const categoria = document.querySelector(".Categoria");
const input = document.getElementById("newTask");
const btnGuardar = document.getElementById("Guadar-btn");
const btnAbrirCategoria = document.getElementById("addBtn");
const bodycontenedor = document.querySelector(".contenedor");

// Abrir cuando el input toma foco
input.addEventListener("focus", () => {
  categoria.classList.add("active");
  bodycontenedor.style.overflow = "hidden"
  
});

btnAbrirCategoria.addEventListener("click", () => {
  categoria.classList.toggle("active");

  bodycontenedor.style.overflowY =
  bodycontenedor.style.overflowY === "hidden" ? "auto" : "hidden";
});


// Cerrar al guardar
btnGuardar.addEventListener("click", () => {
  categoria.classList.remove("active");
  bodycontenedor.style.overflowY = "auto"
});

// Cerrar con Enter
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    categoria.classList.remove("active");
      bodycontenedor.style.overflowY = "auto"
  }
});


  },

 addTask() {
  const input = document.getElementById("newTask");
  const text = input.value.trim();

  if (!text) return alert("Escribe una tarea");

  this.tasks.push({
    id: Date.now(),
    text,
    categoria: this.categoriaSeleccionada || "Ninguna", 
    prioridad: this.prioridadSeleccionada || "Ninguna",
    done: false
    
  });

  Storage.saveTasks(this.tasks);
  UI.renderTasks(this.tasks);

  input.value = "";
  input.focus();
},
  toggleTask(id) {
  this.tasks = this.tasks.map(t => {
    if (t.id === id) {
      const newDone = !t.done;

      // si acaba de completarse → mostramos el modal animado
      if (!t.done && newDone) {
        mostrarModalCompletado();
      }

      return { ...t, done: newDone };
    }
    return t;
  });

  Storage.saveTasks(this.tasks);
  UI.renderTasks(this.tasks);
},

  toggleCleck(id){
    this.tasks = this.tasks.map(c => 
      c.id === id ? { ...c, cleck: !c.cleck} : c
    );

    Storage.saveTasks(this.tasks);
    UI.renderTasks(this.tasks);

  },

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    Storage.saveTasks(this.tasks);
    UI.renderTasks(this.tasks);
  },
};

//Completado animacion

function mostrarModalCompletado() {
  const modal = document.getElementById("modalCompletado");
  const anim = modal.querySelector(".modal-content");
  const backgraud_Content = modal.querySelector(".backgraud-content");
  const tituloModal = modal.querySelector(".titulo-modal");


  // Reiniciar animaciones
  anim.style.animation = "none";
  anim.offsetHeight; // << forzar reflow (truco importante)
  anim.style.animation = "";

  backgraud_Content.style.animation = "none";
  backgraud_Content.offsetHeight;
  backgraud_Content.style.animation = "";

  tituloModal.style.animation = "none";
  tituloModal.offsetHeight;
  tituloModal.style.animation = "";



  modal.classList.add("show");

  setTimeout(() => {
    modal.classList.remove("show");
  }, 2200);
}

//Themes

document.addEventListener("click", () =>{
  const themes = document.querySelector(".content_theme");
  const animation = document.querySelector(".nav_themes");
  const openThemes = document.getElementById("openThemes");
  const closeThemes = document.querySelector(".contenedor");

  openThemes.addEventListener("click", () =>{
    themes.classList.toggle("active");
    animation.classList.toggle("active");
  });

  setTimeout(() => {
      closeThemes.addEventListener("click", () =>{
      themes.classList.remove("active");
  });
  }, 1000);
  closeThemes.addEventListener("click", () =>{
  animation.classList.remove("active");
  });

});


App.init();
