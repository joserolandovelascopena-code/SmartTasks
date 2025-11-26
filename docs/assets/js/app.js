const App = {
  tasks: Storage.getTasks(),

  init() {
    UI.renderTasks(this.tasks);

    // Evento CLICK en el botón
    document.getElementById("addBtn").addEventListener("click", () => {
      this.addTask();
    });

    // Evento ENTER en el input
    document.getElementById("newTask").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addTask();
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
  }
};

App.init();
