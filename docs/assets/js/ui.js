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
       
        App.deleteTask(task.id);
        
      });

      list.appendChild(li);
    });
    
  },
  // --- NUEVO: CARRUSEL ---
  initCarousel() {
    this.carousel = document.querySelector(".carousel");
    this.cards = document.querySelectorAll(".card");
    this.prev = document.querySelector(".prev");
    this.next = document.querySelector(".next");
    this.index = 0;

    this.bindCarouselEvents();
    this.updateCarousel();
  },

  bindCarouselEvents() {

    // Botón siguiente
    this.next.addEventListener("click", () => {
      this.index = Math.min(this.index + 1, this.cards.length - 1);
      this.updateCarousel();
    });

    // Botón anterior
    this.prev.addEventListener("click", () => {
      this.index = Math.max(this.index - 1, 0);
      this.updateCarousel();
    });

    // Scroll manual detecta tarjeta activa
    this.carousel.addEventListener("scroll", () => {
      const newIndex = Math.round(this.carousel.scrollLeft / 200);

      if (newIndex !== this.index) {
        this.index = newIndex;
        this.updateCarousel();
      }
    });
  },

  updateCarousel() {
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

    this.carousel.scrollTo({
      left: this.index * 200,
      behavior: "smooth"
    });
  }
};

