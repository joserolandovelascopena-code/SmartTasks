const UI = {
  renderTasks(tasks) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.classList.add("task-item");

      if (task.done) {
        li.style.background = "linear-gradient(to right, #ff79c3ff, #ff6479ff)";
       } else {
        li.style.background = "linear-gradient( to right, #e4fbff, #b4f0ff)";
      }

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

      document.addEventListener("click", () =>{
        const modalEtidar = document.querySelector(".Editar_targeta");
        const closeEditar = document.querySelector(".Closeeditar");
        

      });

      list.appendChild(li);
    });
    
  },
  // dentro de UI:
initCarousel() {
  this.carousel = document.querySelector(".carousel");
  this.cards = document.querySelectorAll(".card");
  this.prev = document.querySelector(".prev");
  this.next = document.querySelector(".next");
  this.index = 0;

  // calcula ancho real (card + gap)
  this.computeCardSize();

  // vuelve a calcular si cambia el tamaño de ventana
  window.addEventListener("resize", () => {
    this.computeCardSize();
    // reajusta scroll para que el centro quede correcto
    this.carousel.scrollTo({ left: this.index * this.cardSize, behavior: "auto" });
  });

  this.bindCarouselEvents();
  this.updateCarousel();
},

// función que calcula ancho real de "paso" (card + gap)
computeCardSize() {
  this.cards = document.querySelectorAll(".card"); // refresca NodeList por si cambian
  if (!this.cards.length) {
    this.cardSize = 0;
    return;
  }

  const first = this.cards[0].getBoundingClientRect();
  // Si hay al menos 2 tarjetas, usa la distancia entre ellas para incluir gap
  if (this.cards.length > 1) {
    const second = this.cards[1].getBoundingClientRect();
    // distancia entre lefts = gap + width; 
    // cardSize = second.left - first.left
    this.cardSize = Math.round(second.left - first.left);
  } else {
    // si solo hay una, usa su ancho
    this.cardSize = Math.round(first.width);
  }

  // por seguridad mínimo 1
  if (!this.cardSize || this.cardSize < 1) this.cardSize = Math.round(first.width);
},


bindCarouselEvents() {
  // proteger si no hay elementos
  if (this.next) {
    this.next.addEventListener("click", () => {
      this.index = Math.min(this.index + 1, this.cards.length - 1);
      this.updateCarousel();
    });
  }
  if (this.prev) {
    this.prev.addEventListener("click", () => {
      this.index = Math.max(this.index - 1, 0);
      this.updateCarousel();
    });
  }

 
  if (this.carousel) {
    // Debounce ligero para no recalcular mil veces (opcional)
    let raf = null;
    this.carousel.addEventListener("scroll", () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!this.cardSize) return;
        const newIndex = Math.round(this.carousel.scrollLeft / this.cardSize);
        if (newIndex !== this.index) {
          this.index = Math.max(0, Math.min(newIndex, this.cards.length - 1));
          this.updateCarousel();
        }
      });
    });
  }

  // (opcional) teclas izquierda/derecha
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      this.index = Math.min(this.index + 1, this.cards.length - 1);
      this.updateCarousel();
    } else if (e.key === "ArrowLeft") {
      this.index = Math.max(this.index - 1, 0);
      this.updateCarousel();
    }
  });
},


updateCarousel() {
  if (!this.cards) return;

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

  // usa cardSize dinámico
  if (this.cardSize) {
    this.carousel.scrollTo({
      left: this.index * this.cardSize,
      behavior: "smooth"
    });
  } else {
    // fallback: usa offsetWidth de la primera tarjeta
    const w = this.cards[0] ? this.cards[0].offsetWidth : 0;
    this.carousel.scrollTo({
      left: this.index * w,
      behavior: "smooth"
    });
  }
}

};

