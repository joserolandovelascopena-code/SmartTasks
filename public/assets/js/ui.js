const UI = {
  renderTasks(tasks) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.classList.add("task-item");

      // texto + estilo de completada
      li.innerHTML = `
        <span class="task-text ${task.done ? "done" : ""}">
          ${task.text}
        </span>
        <button class="delete-btn">✖</button>
      `;

      // marcar completada
      li.querySelector(".task-text").addEventListener("click", () => {
        App.toggleTask(task.id);
      });

      // eliminar tarea
      li.querySelector(".delete-btn").addEventListener("click", () => {
        App.deleteTask(task.id);
      });

      list.appendChild(li);
    });
  }
};
