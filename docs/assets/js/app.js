// app.js
import { Storage } from "./storage.js";
import { UI } from "./ui.js";
import { supabaseClient } from "./supabase.js";
import { Toast } from "./toastManager/toast.js";
import { Sound } from "./toastManager/sound.js";

document.addEventListener(
  "pointerdown",
  () => {
    Sound.unlock();
  },
  { once: true }
);

export const App = {
  tasks: [],
  profile: null,
  currentEditTaskId: null,
  currentEditTask: null,
  categoriaSeleccionada: null,
  prioridadSeleccionada: null,

  async loadTasks() {
    this.tasks = await Storage.getTasks();
  },
  async init() {
    await this.loadTasks();

    Sound.init();
    Toast.init();

    const { data: sessionData } = await supabaseClient.auth.getSession();
    if (!sessionData.session) return;

    const userId = sessionData.session.user.id;

    const profile = await Storage.getProfile();
    const totalTasks = await Storage.cantidadTasksPorUsuario(userId);

    this.profile = {
      ...profile,
      totalTasks,
    };

    // Render inicial
    UI.renderPerfile(this.profile);

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
    const contenAdd = document.querySelector(".subir_tarea");
    const bodycontenedor = document.querySelector(".contenedor");
    const backgraudAnimation = document.querySelector(".backgraud-tasks");

    input.addEventListener("focus", () => {
      if (!input.value.trim()) {
        categoria.classList.add("active");
        bodycontenedor.style.overflow = "hidden";
      }
    });

    btnGuardar.forEach((btnSave) => {
      btnSave.addEventListener("click", async (e) => {
        e.preventDefault();

        const success = await App.addTask();
        if (!success) return;

        bodycontenedor.style.overflowY = "auto";
        document.querySelector(".List_check").classList.remove("show");
        document.querySelector(".info_tarea").classList.remove("show");
        contenAdd.classList.remove("show");
        backgraudAnimation.classList.remove("show");
      });
    });

    document.addEventListener("click", async (e) => {
      if (!e.target.classList.contains("btnGuardarCambios")) return;

      e.stopPropagation();
      await App.editeTasks();
    });
  },

  async addTask() {
    const input = document.getElementById("newTask");
    const text = input.value.trim();

    const descriptionTextarea = document.getElementById("descripcion");
    const descriptionText = descriptionTextarea?.value.trim() || "";

    if (!text) {
      Toast.show("Error: escribe una tarea", "error", {
        sound: true,
        haptic: true,
      });

      return false;
    }

    const { data: sessionData } = await supabaseClient.auth.getSession();
    if (!sessionData.session) {
      Toast.show("Error: No hay sesión activa", "error");
      return false;
    }

    const nuevaTarea = {
      text,
      categoria: this.categoriaSeleccionada || "Ninguna",
      prioridad: this.prioridadSeleccionada || "Ninguna",
      descripcion: descriptionText,
      done: false,
      user_id: sessionData.session.user.id,
    };

    await Storage.saveTask(nuevaTarea);
    await this.loadTasks();

    this.profile.totalTasks = this.tasks.length;

    UI.renderTasks(this.tasks);
    UI.renderTarjetas(this.tasks, true);
    UI.renderPerfile(this.profile);

    input.value = "";
    if (descriptionTextarea) descriptionTextarea.value = "";

    return true;
  },

  async editeTasks() {
    if (!this.currentEditTaskId) {
      Toast.show("No hay tarea en edición", "error");
      return false;
    }

    const modalActivo = document.querySelector(".editar_item.active");
    if (!modalActivo) return false;

    const inputEdite = modalActivo.querySelector(".InputEditarTasks");
    if (!inputEdite) return false;

    const text = inputEdite.value.trim();

    const textarea = modalActivo.querySelector(".EditarDescripcion");
    const descripcionNew = textarea ? textarea.value.trim() : "";

    if (!text) {
      Toast.show("Campo vacío, tarea sin nombre", "error", {
        sound: true,
        haptic: true,
      });
      return false;
    }

    const taskActual = this.tasks.find((t) => t.id === this.currentEditTaskId);

    const fields = {
      text,
      categoria: this.categoriaSeleccionada || taskActual.categoria,
      prioridad: this.prioridadSeleccionada || taskActual.prioridad,
      descripcion: descripcionNew,
    };

    await Storage.SaveUpdateTask(this.currentEditTaskId, fields);

    this.currentEditTaskId = null;
    this.currentEditTask = null;

    await this.loadTasks();
    UI.renderTasks(this.tasks);
    UI.renderTarjetas(this.tasks, true);

    Toast.show("Se ha actualizado la tarea", "success", {
      sound: true,
      haptic: true,
    });
    return true;
  },

  async getProfile() {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    if (!sessionData.session) {
      Toast.show("Error: No hay sesión activa", "error");
      return;
    }

    const user_id = sessionData.session.user.id;

    const full_name = this.userProfile.full_name;
    const avatar_url = this.userProfile.avatar_url;

    const loaderUser = { full_name, avatar_url, user_id };

    UI.renderPerfile(loaderUser);
  },

  async toggleTask(id) {
    let newDone = false;
    let tareaCambiada = null;

    this.tasks = this.tasks.map((t) => {
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
    this.tasks = this.tasks.map((c) =>
      c.id === id ? { ...c, cleck: !c.cleck } : c
    );

    const tarea = this.tasks.find((t) => t.id === id);
    try {
      await Storage.updateTask(id, {
        cleck: tarea.cleck,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error actualizando cleck en BD:", err);
    }

    UI.renderTasks(this.tasks);
  },

  async deleteTask(id) {
    // 1. Actualizas el estado principal
    this.tasks = this.tasks.filter((t) => t.id !== id);

    // 2. Actualizas el contador EN MEMORIA
    if (this.profile) {
      this.profile.totalTasks = this.tasks.length;
    }

    // 3. Persistes en BD
    try {
      await Storage.deleteTask(id);
    } catch (err) {
      console.error("Error borrando tarea en BD:", err);
    }

    // 4. Renderizas
    UI.renderTasks(this.tasks);
    UI.renderTarjetas(this.tasks, true);
    UI.renderPerfile(this.profile);
  },

  async cantidadTasksPorUsuario(userId) {
    const { count, error } = await supabaseClient
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) {
      console.error("Error contando tareas:", error.message);
      return 0;
    }

    return count;
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const openAdd = document.getElementById("Add");
  const contenAdd = document.querySelector(".subir_tarea");
  const bodycontenedor = document.querySelector(".contenedor");
  const closeAddTaks = document.getElementById("CloseAddTasks");
  const backgraudAnimation = document.querySelector(".backgraud-tasks");
  const listCheck = document.querySelector(".List_check");
  const infoTarea = document.querySelector(".info_tarea");

  openAdd.addEventListener("click", () => {
    bodycontenedor.style.overflowY = "hidden";

    contenAdd.classList.add("show");
    backgraudAnimation.classList.add("show");

    bodycontenedor.classList.add("show");
    listCheck.classList.add("show");
    infoTarea.classList.add("show");
  });

  closeAddTaks.addEventListener("click", () => {
    bodycontenedor.style.overflowY = "auto";

    contenAdd.classList.remove("show");
    backgraudAnimation.classList.remove("show");

    bodycontenedor.classList.remove("show");
    listCheck.classList.remove("show");
    infoTarea.classList.remove("show");
  });
});

document.addEventListener("change", (e) => {
  if (e.target.classList.contains("check")) {
    const id = Number(e.target.dataset.id);
    App.toggleTask(id);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const repeticion_tasks = document.querySelector(".repeticion_tasks");
  const openRepeticion = document.getElementById("openOpiciones");

  openRepeticion.addEventListener("click", () => {
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

//perfil
const openPerfile = document.querySelectorAll(".openPerfil");
const closePerfil = document.getElementById("Hogar");
const closePerfilFlecha = document.querySelector(".salirPerfil");
const perfilContainer = document.querySelector(".Perfile");
const cantidadTkasPerfile = document.querySelector(".cantidadTasksPerfile");

openPerfile.forEach((per) => {
  per.addEventListener("click", () => {
    perfilContainer.classList.add("show");

    cantidadTkasPerfile.classList.remove("active");
    void cantidadTkasPerfile.offsetWidth; // fuerza reflow
    cantidadTkasPerfile.classList.add("active");
  });
});

closePerfil.addEventListener("click", () => {
  perfilContainer.classList.remove("show");
});

closePerfilFlecha.addEventListener("click", () => {
  perfilContainer.classList.remove("show");
});

// editar fotos

// Modal
const editorPerfil = document.querySelector(".EditarPerfilHeader");
const btnCerrarEditor = document.querySelector(".CerrarEditor_Foto");

const openEditarFotos = document.querySelector(".iconoAjustesheader");
const contenidoEditarFotos = document.querySelector(".ContentEditar");

const inputFotoPerfil = document.getElementById("inputFotoPerfil");
const inputFotoHeader = document.getElementById("inputFotoHeader");

// Preview
const previewImg = document.querySelector(".VisualizarFotoPerfil img");

// Botón aceptar
const btnAceptar = document.querySelector(".ApcentarCambio");

//animaciones succes de editar
const VisualizarFotoBorder = document.querySelector(".borderActiveImg");
const btnAceptarCambiosFoto = document.querySelector(".btnAceptar button");
const BtnLoaderCambiarFoto = document.querySelector(".cajaBtnLoader");

openEditarFotos.addEventListener("click", () => {
  editorPerfil.classList.add("show");
  contenidoEditarFotos.classList.add("show");
});

btnCerrarEditor.addEventListener("click", (e) => {
  e.stopPropagation();
  e.preventDefault();

  editorPerfil.classList.remove("show");
  contenidoEditarFotos.classList.remove("show");
  VisualizarFotoBorder.classList.remove("show");
  btnAceptarCambiosFoto.classList.remove("active");
});

inputFotoPerfil.addEventListener("click", () => {
  VisualizarFotoBorder.classList.remove("show");
  btnAceptarCambiosFoto.classList.remove("active");
});

inputFotoPerfil.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    Toast.show("Archivo no válido", "error", {
      sound: true,
      haptic: true,
    });
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    previewImg.src = reader.result;
  };

  reader.readAsDataURL(file);
  VisualizarFotoBorder.classList.add("show");
  btnAceptarCambiosFoto.classList.add("active");
});

inputFotoHeader.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    Toast.show("Archivo no válido", "error", {
      sound: true,
      haptic: true,
    });
    return;
  }

  console.log("Header seleccionado:", file.name);
});

btnAceptar.addEventListener("click", async () => {
  try {
    const file = inputFotoPerfil.files[0];
    if (!file) {
      Toast.show("Selecciona una imagen", "warning");
      return;
    }

    BtnLoaderCambiarFoto.classList.add("active");

    Toast.show("Subiendo foto...", "info");

    // 1. Subir a Supabase
    const avatarUrl = await Storage.uploadAvatar(file);

    setTimeout(() => {
      editorPerfil.classList.remove("show");
      BtnLoaderCambiarFoto.classList.remove("active");

      Toast.show("Foto actualizada correctamente", "success", {
        sound: true,
        haptic: true,
      });
    }, 1500);

    // 2. Guardar en profiles
    await Storage.updateAvatarUrl(avatarUrl);

    // 3. Actualizar estado local
    App.profile.avatar_url = avatarUrl;

    // 4. Re-render perfil
    UI.renderPerfile(App.profile);
  } catch (err) {
    console.error(err);
    Toast.show("Error al subir la imagen", "error", {
      sound: true,
      haptic: true,
    });
  }
});

const actionSheet = document.querySelector(".actionSheet");
const ContentSheet = document.querySelector(".ContentSheet");
const btnOpenSheet = document.querySelector(".btnOpenSheet");
const btnCancelarAccionSheet = document.querySelector(
  ".btnCancelarAccionSheet"
);

btnOpenSheet.addEventListener("click", () => {
  actionSheet.classList.add("active");
  ContentSheet.classList.add("active");
});

btnCancelarAccionSheet.addEventListener("click", () => {
  ContentSheet.classList.remove("active");
  setTimeout(() => {
    actionSheet.classList.remove("active");
  }, 400);
});

//Themes

document.addEventListener("DOMContentLoaded", () => {
  const themes = document.querySelector(".content_theme");
  const animation = document.querySelector(".nav_themes");
  const openThemes = document.getElementById("openThemes");
  const closeThemes = document.querySelector(".contenedor");

  openThemes.addEventListener("click", () => {
    themes.classList.add("active");
    animation.classList.add("active");
  });

  setTimeout(() => {
    closeThemes.addEventListener("click", () => {
      themes.classList.remove("active");
    });
  }, 1000);

  closeThemes.addEventListener("click", () => {
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
