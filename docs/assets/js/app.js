// app.js
import { Storage } from "./storage.js";
import { UI } from "./ui.js";
import { supabaseClient } from "./supabase.js"; 
import { Toast } from "./toastManager/toast.js";
import { Sound } from "./toastManager/sound.js";

document.addEventListener("pointerdown", () => {
  Sound.unlock();
}, { once: true });


export const App = {
  tasks: [],
  categoriaSeleccionada: "", 
  prioridadSeleccionada: "",
  async loadTasks() { this.tasks = await Storage.getTasks(); },
  async init() {
    await this.loadTasks();

    Sound.init();
    Toast.init();

    const profile = await Storage.getProfile();
     if (profile) {
    UI.renderPerfile(profile);
    }

    UI.renderTasks(this.tasks);
    UI.renderTarjetas(this.tasks);
    UI.initCarousel();
    UI.renderCategoria();
    UI.renderPrioridad();

   
  document.getElementById("newTask").addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.addTask();
    });

    // Lógica de mostrar y ocultar categoría
   const categoria = document.querySelector(".Categoria");
    const input = document.getElementById("newTask");
    const btnGuardar = document.querySelectorAll(".Guadar-btn");
    const bodycontenedor = document.querySelector(".contenedor");

   input.addEventListener("focus", () => {
    if (!input.value.trim()) {
    categoria.classList.add("active");
    bodycontenedor.style.overflow = "hidden";
    }
    });
    
    btnGuardar.forEach(btnSave => {
      btnSave.addEventListener("click", async (e) => {
      e.preventDefault();

      const success = await App.addTask();
      if (!success) return;

      document.querySelector(".subir_tarea")?.classList.remove("show");
      categoria.classList.remove("active");
      bodycontenedor.style.overflowY = "auto";
      document.querySelector(".List_check").classList.remove("show");
      document.querySelector(".info_tarea").classList.remove("show");
    });

    });
  



},

async addTask() {
  const input = document.getElementById("newTask");
  const text = input.value.trim();


  if (!text) {
   Toast.show(
   "Error: escribe una tarea",
   "error",{ sound: true });
   return false;
  }

  // Obtener usuario
  const { data: sessionData } = await supabaseClient.auth.getSession();
  if (!sessionData.session) {
    Toast.show("Error: No hay sesión activa", "error");
    return false;
  }
  const user_id = sessionData.session.user.id;

  const nuevaTarea = {
    text,
    categoria: this.categoriaSeleccionada || "Ninguna",
    prioridad: this.prioridadSeleccionada || "Ninguna",
    done: false,
    user_id
  };


  await Storage.saveTask(nuevaTarea);


  await this.loadTasks();
  UI.renderTasks(this.tasks);

  input.value = "";
  return true;
}, 
async getProfile(){
  const { data: sessionData } = await supabaseClient.auth.getSession();
  if (!sessionData.session) {
    Toast.show("Error: No hay sesión activa", "error");
    return false;
  }
  const user_id = sessionData.session.user.id;

  const loaderUser = {
    full_name,
    avatar_url,
    user_id
  }

  await Storage.getProfile(loaderUser);
  UI.renderPerfile();
},

async toggleTask(id) {
  let newDone = false;
  let tareaCambiada = null;

  this.tasks = this.tasks.map(t => {
    if (t.id === id) {
      newDone = !t.done;
      tareaCambiada = !t.done; 
      return { ...t, done: newDone };
    }
    return t;
  });


  if (tareaCambiada === true) {
    mostrarModalCompletado();
  }

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
  const closeAddTaks = document.getElementById("CloseAddTasks");
  const bodyDoc = document.querySelector("body");

  openAdd.addEventListener("click", () =>{
    contenAdd.classList.add("show")
    bodycontenedor.style.overflowY = bodycontenedor.style.overflowY === "hidden" ? "auto" : "hidden";
    bodycontenedor.classList.add("show")
    document.querySelector(".List_check").classList.toggle("show");
    document.querySelector(".info_tarea").classList.toggle("show");
  });
    closeAddTaks.addEventListener("click", () =>{
    contenAdd.classList.remove("show")
    bodycontenedor.style.overflowY = bodycontenedor.style.overflowY === "hidden" ? "auto" : "hidden";
    bodycontenedor.classList.remove("show")
    document.querySelector(".List_check").classList.remove("show");
    document.querySelector(".info_tarea").classList.remove("show");
  });
});

document.addEventListener("change", e => {
  if (e.target.classList.contains("check")) {
    const id = Number(e.target.dataset.id);
    App.toggleTask(id);
  }
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
    themes.classList.add("active");
    animation.classList.add("active");
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