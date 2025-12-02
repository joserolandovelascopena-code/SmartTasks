// Cuando hay sesión iniciada, empezamos la app.
supabaseClient.auth.getSession().then(({ data }) => {
  if (data.session) {
    document.getElementById("login-screen").style.display = "none";
    App.init();
  }
});



let categoriaSeleccionada = "";
let prioridadSeleccionada = "";
const App = {
  tasks: [],
  categoriaSeleccionada: "", 
  prioridadSeleccionada: "",
  async loadTasks() {
  this.tasks = await Storage.getTasks();
},
 

async init() {
  await this.loadTasks();

  UI.renderTasks(this.tasks);
  UI.renderTarjetas(this.tasks);

  UI.initCarousel();
  UI.renderCategoria();
  UI.renderPrioridad();
  
  document.getElementById("Guadar-btn").addEventListener("click", () => {
    this.addTask();
  });

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
  input.focus();
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

// Si "cleck" es algo que quieres persistir en la BD, hazlo async también:
async toggleCleck(id) {
  this.tasks = this.tasks.map(c => 
    c.id === id ? { ...c, cleck: !c.cleck } : c
  );

  const tarea = this.tasks.find(t => t.id === id);
  try {
    // si no guardas cleck en la BD, elimina esta línea
    await Storage.updateTask(id, { cleck: tarea.cleck, updated_at: new Date().toISOString() });
  } catch (err) {
    console.error("Error actualizando cleck en BD:", err);
  }

  UI.renderTasks(this.tasks);
},

async deleteTask(id) {
  // eliminar localmente primero para UX instantánea
  this.tasks = this.tasks.filter(t => t.id !== id);

  try {
    await Storage.deleteTask(id); // Storage.deleteTask debe ser async y borrar en Supabase
  } catch (err) {
    console.error("Error borrando tarea en BD:", err);
  }

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
