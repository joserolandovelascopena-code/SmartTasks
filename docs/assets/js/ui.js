const UI = {
  renderTasks(tasks) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.classList.add("task-item");

      // texto + estilo de completada
      li.innerHTML = `
       <input type="checkbox" class="check ${task.done ? "done" : ""}" ${task.done ? "checked" : ""}>
        <span class="task-text ${task.done ? "done" : ""}">
          ${task.text}
        </span> 
        <button class="delete-btn">✖</button> 
        <div class="editar_item"></div>
      `;

      // marcar completada
      li.querySelector(".check").addEventListener("click", () =>{
        App.toggleTask(task.id);
      });

      li.querySelector(".task-text").addEventListener("click", () => {
        App.toggleTask(task.id);
      });

      // eliminar tarea
      li.querySelector(".delete-btn").addEventListener("click", () => {
        setTimeout(() => {
        App.deleteTask(task.id);
        }, 1000);
      });

      list.appendChild(li);
    });
  }
};
