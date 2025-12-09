// app.js
// app.js
import { Storage } from "./storage.js";
import { UI } from "./ui.js";
import { supabaseClient } from "./supabase.js"; 

export const App = {
  tasks: [],
  categoriaSeleccionada: "", 
  prioridadSeleccionada: "",
  async loadTasks() { this.tasks = await Storage.getTasks(); },
  async init() {
    await this.loadTasks();
    UI.renderTasks(this.tasks);
    UI.renderTarjetas(this.tasks);
    UI.initCarousel();
    UI.renderCategoria();
    UI.renderPrioridad();

    document.getElementById("Guadar-btn").addEventListener("click", () => this.addTask());
    document.getElementById("newTask").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addTask();
    });

    // Lógica de mostrar y ocultar categoría
    const categoria = document.querySelector(".Categoria");
    const input = document.getElementById("newTask");
    const btnGuardar = document.getElementById("Guadar-btn");
    const btnAbrirCategoria = document.getElementById("addBtn");
    const bodycontenedor = document.querySelector(".contenedor");

   input.addEventListener("focus", () => {
    if (!input.value.trim()) {
    categoria.classList.add("active");
    bodycontenedor.style.overflow = "hidden";
    }
    });

    btnAbrirCategoria.addEventListener("click", () => {
      categoria.classList.toggle("active");
      bodycontenedor.style.overflowY = bodycontenedor.style.overflowY === "hidden" ? "auto" : "hidden";
    });

    btnGuardar.addEventListener("click", () => {
      document.querySelector(".subir_tarea").classList.remove("show");
      document.querySelector(".List_check").classList.remove("show");
      document.querySelector(".info_tarea").classList.remove("show");
    });

    btnGuardar.addEventListener("click", () => {
      categoria.classList.remove("active");
      bodycontenedor.style.overflowY = "auto";
    });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        categoria.classList.remove("active");
        bodycontenedor.style.overflowY = "auto";
      }
    });
  },


async addTask() {
  const input = document.getElementById("newTask");
  const text = input.value.trim();

  if (!text) return alert("Escribe una tarea");

  // Obtener usuario
  const { data: sessionData } = await supabaseClient.auth.getSession();
  if (!sessionData.session) return alert("No hay sesión activa");

  const user_id = sessionData.session.user.id;

  const nuevaTarea = {
    text,
    categoria: this.categoriaSeleccionada || "Ninguna",
    prioridad: this.prioridadSeleccionada || "Ninguna",
    done: false,
    user_id
  };


  await Storage.saveTask(nuevaTarea);

  // Recargar lista
  await this.loadTasks();
  UI.renderTasks(this.tasks);

  input.value = "";

},


async toggleTask(id) {
  let newDone = false;

  this.tasks = this.tasks.map(t => {
    if (t.id === id) {
      newDone = !t.done;

      if (!t.done && newDone) {
        mostrarModalCompletado();
      }

      return { ...t, done: newDone };
    }
    return t;
  });

  await Storage.updateTask(id, { done: newDone });
  UI.renderTasks(this.tasks);
},


async toggleCleck(id) {
  this.tasks = this.tasks.map(c => 
    c.id === id ? { ...c, cleck: !c.cleck } : c
  );

  const tarea = this.tasks.find(t => t.id === id);
  try {
        await Storage.updateTask(id, { cleck: tarea.cleck, updated_at: new Date().toISOString() });
  } catch (err) {
    console.error("Error actualizando cleck en BD:", err);
  }

  UI.renderTasks(this.tasks);
},

async deleteTask(id) {

  this.tasks = this.tasks.filter(t => t.id !== id);

  try {
    await Storage.deleteTask(id); 
  } catch (err) {
    console.error("Error borrando tarea en BD:", err);
  }

  UI.renderTasks(this.tasks);
},
};

//add tasks
document.addEventListener("DOMContentLoaded", () =>{
  const openAdd = document.getElementById("Add");
  const contenAdd = document.querySelector(".subir_tarea");
  const bodycontenedor = document.querySelector(".contenedor");

  openAdd.addEventListener("click", () =>{
    contenAdd.classList.toggle("show")
    bodycontenedor.style.overflowY = bodycontenedor.style.overflowY === "hidden" ? "auto" : "hidden";
    bodycontenedor.classList.toggle("show")
    document.querySelector(".List_check").classList.toggle("show");
    document.querySelector(".info_tarea").classList.toggle("show");
  });
});

document.addEventListener("DOMContentLoaded", () =>{
  const repeticion_tasks = document.querySelector(".repeticion_tasks");
  const openRepeticion = document.getElementById("openOpiciones");

  openRepeticion.addEventListener("click",() =>{
    repeticion_tasks.classList.toggle("show");
  });
});

//Completado animacion

function mostrarModalCompletado() {
  const modal = document.getElementById("modalCompletado");
  const anim = modal.querySelector(".modal-content");
  const backgraud_Content = modal.querySelector(".backgraud-content");
  const tituloModal = modal.querySelector(".titulo-modal");


  // Reiniciar animaciones
  anim.style.animation = "none";
  anim.offsetHeight; 
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

document.addEventListener("DOMContentLoaded", () =>{
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

/*
function actualizarEstadoConexion() {
    const mensajeDesconexion = document.getElementById('mensaje-offline'); 

    if (navigator.onLine) {
        console.log("Conectado a Internet");
        if (mensajeDesconexion) {
            mensajeDesconexion.style.display = 'none';
        }
    } else {
        console.log("Desconectado de Internet");
        if (mensajeDesconexion) {
            mensajeDesconexion.style.display = 'block'; 
        }
    }
}*/