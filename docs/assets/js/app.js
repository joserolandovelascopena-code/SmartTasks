const App = {
  tasks: Storage.getTasks(),

  init() {
    UI.renderTasks(this.tasks);
    UI.renderTarjetas(this.tasks);   // ← NECESARIO
    // Inicializar carrusel
    UI.initCarousel();



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

// Abrir cuando el input toma foco
input.addEventListener("focus", () => {
  categoria.classList.add("active");
});

// También abrir mientras escribe
input.addEventListener("keyup", () => {
  categoria.classList.add("active");
});

// Abrir con el botón +
btnAbrirCategoria.addEventListener("click", () => {
  categoria.classList.toggle("active");
});

// Cerrar al guardar
btnGuardar.addEventListener("click", () => {
  categoria.classList.remove("active");
});

// Cerrar con Enter
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    categoria.classList.remove("active");
  }
});


  },

  addTask() {
    const input = document.getElementById("newTask");
    const text = input.value.trim();

    if (!text) return alert("Escribe una tarea");

    this.tasks.push({
      id: Date.now(),  // ID único
      text,
      done: false
    });


    Storage.saveTasks(this.tasks);
    UI.renderTasks(this.tasks);

    input.value = "";        // limpiar input
    input.focus();           // volver a enfocar
  },

  toggleTask(id) {
    this.tasks = this.tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    );

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

App.init();
