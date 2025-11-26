const Storage = {
  key: "tasks",

  getTasks() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch (e) {
      console.warn("Error leyendo LocalStorage:", e);
      return [];
    }
  },

  saveTasks(tasks) {
    localStorage.setItem(this.key, JSON.stringify(tasks));
  },

  clearTasks() {
    localStorage.removeItem(this.key);
  }
};
