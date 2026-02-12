// app.js
import { Storage } from "../storage.js";
import { UI, initUIEvents } from "../ui.js";
import { UIST } from "../ui/ui.selectors.js";
import { TaskService } from "./task.service.js";
import { AuthService } from "./auth.service.js";
import { SchedulerService } from "./scheduler.service.js";

import { supabaseClient } from "../supabase.js";
import { Toast } from "../toastManager/toast.js";
import { Sound } from "../toastManager/sound.js";
import { ScrollBody } from "../modals/scrollModals.js";
import {
  sanitizeAndValidate,
  sanitizeText,
  normalizeText,
} from "../security/inputSanitizer.js";

document.addEventListener(
  "pointerdown",
  () => {
    Sound.unlock();
  },
  { once: true },
);

if (!history.state) {
  history.replaceState({ base: true }, "", location.pathname);
}

document.addEventListener("warning:confirm", async (e) => {
  const { action } = e.detail;
  await App.executeGlobalAction(action);
});

let isAddingTask = false;

export const App = {
  tasks: [],
  profile: null,
  currentEditTaskId: null,
  currentEditTask: null,

  categoriaSeleccionada: null,
  prioridadSeleccionada: null,

  selectedDate: null,
  selectedDateEditar: null,
  selectedTime: null,
  selectedTimeEditar: null,

  async loadTasks() {
    this.tasks = await Storage.getTasks();
  },

  async init() {
    this.selectedDate = null;
    this.selectedDateEditar = null;
    this.selectedTime = null;
    this.selectedTimeEditar = null;

    await this.loadTasks();

    UIST.init();
    Sound.init();
    Toast.init();
    initUIEvents(this);

    const user = await AuthService.getSessionUser();
    if (!user) return;

    this.profile = await AuthService.buildProfile(user.id);

    // Render inicial
    UI.renderPerfile(this.profile);

    UI.renderTasks(this.tasks);
    UI.renderTarjetas(this.tasks);
    //UI.renderTasksMainCalendar(this.tasks);
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
    const backgraudAnimation = document.querySelector(".backgraud-tasks");

    input.addEventListener("focus", () => {
      if (!input.value.trim()) {
        categoria.classList.add("active");
      }
    });

    btnGuardar.forEach((btnSave) => {
      btnSave.addEventListener("click", async (e) => {
        e.preventDefault();

        const success = await App.addTask();
        if (!success) return;
        ScrollBody.enableBodyScroll();

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
      ScrollBody.enableBodyScroll();
    });
  },

  async addTask() {
    if (isAddingTask) {
      console.warn("Bloqueado: ya se está agregando una tarea");
      return false;
    }

    isAddingTask = true;

    try {
      // 1. DOM (esto SÍ es responsabilidad de App)
      const input = document.getElementById("newTask");
      const descriptionTextarea = document.getElementById("descripcion");

      // 2. Llamada al service
      await TaskService.createTask({
        text: input.value,
        descripcion: descriptionTextarea?.value || "",
        categoria: this.categoriaSeleccionada,
        prioridad: this.prioridadSeleccionada,
        selectedDate: this.selectedDate,
        selectedTime: this.selectedTime,
      });

      // 3. Estado
      await this.loadTasks();

      // 4. UI
      UI.renderTasks(this.tasks);
      UI.renderTarjetas(this.tasks, true);

      // 5. Reset UI
      input.value = "";
      if (descriptionTextarea) descriptionTextarea.value = "";

      this.selectedDate = null;
      this.selectedTime = null;

      UI.resetFechaHoraUI();

      return true;
    } catch (err) {
      console.error("Error en addTask:", err.message);
      Toast.show(err.message || "Error inesperado", "error");
      return false;
    } finally {
      isAddingTask = false;
    }
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

    const result = sanitizeAndValidate(inputEdite.value, {
      min: 3,
      max: 120,
    });

    if (result.error) {
      Toast.show(result.error, "error", {
        sound: true,
        haptic: true,
      });
      return false;
    }

    const safeText = result.value;

    const textarea = modalActivo.querySelector(".EditarDescripcion");
    const descResult = sanitizeAndValidate(textarea?.value || "", {
      min: 0,
      max: 500,
    });

    if (descResult.error) {
      Toast.show(descResult.error, "error");
      return false;
    }

    const taskActual = this.tasks.find((t) => t.id === this.currentEditTaskId);

    const checkboxEditar = modalActivo.querySelector(
      `#MarcarTask-${this.currentEditTaskId}`,
    );

    const { due_date, due_time } = SchedulerService.normalizeDueDateTime(
      App.selectedDateEditar,
      App.selectedTimeEditar,
    );

    const fields = {
      text: safeText,
      categoria: this.categoriaSeleccionada || taskActual.categoria,
      prioridad: this.prioridadSeleccionada || taskActual.prioridad,
      descripcion: descResult.value,
      done: checkboxEditar ? checkboxEditar.checked : taskActual.done,

      due_date,
      due_time,
    };

    await Storage.SaveUpdateTask(this.currentEditTaskId, fields);

    this.currentEditTaskId = null;
    this.currentEditTask = null;
    this.selectedDateEditar = null;
    this.selectedTimeEditar = null;

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
    const user = await AuthService.getSessionUser();
    if (!user) {
      Toast.show("No hay sesión activa", "error");
      return;
    }

    const user_id = user.id;
    const profile = await AuthService.loadProfile();
    this.profile = profile || this.profile;

    const full_name = profile?.full_name || "";
    const avatar_url = profile?.avatar_url || null;
    const avatarHeader_url = profile?.header_url || null;
    const loaderUser = { full_name, avatar_url, avatarHeader_url, user_id };

    UI.renderPerfile(loaderUser);
  },

  async toggleTask(id, done, fromEdit = false) {
    this.tasks = this.tasks.map((t) => (t.id === id ? { ...t, done } : t));

    if (done && !fromEdit) {
      mostrarModalCompletado();
    }

    await Storage.updateTask(id, { done });

    UI.renderTarjetas(this.tasks, true);
  },

  async deleteTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);

    if (this.profile) {
      this.profile.totalTasks = this.tasks.length;
    }

    try {
      const taskName = await Storage.deleteTask(id);

      Toast.showInferior(`Se eliminó la tarea: "${taskName}"`, "deleElement");
    } catch (err) {
      console.error("Error borrando tarea en BD:", err.message);
    }

    UI.renderTasks(this.tasks);
    UI.renderTarjetas(this.tasks, true);
    UI.renderPerfile(this.profile);
  },

  async executeGlobalAction(action) {
    const ACTIONS = {
      DELETE_AVATAR: async () => {
        await this.deleteAvatar();
      },
      DELETE_HEADER: async () => {
        await this.deleteHeader();
      },
    };

    const fn = ACTIONS[action];
    if (!fn) {
      Toast.show("Acción no implementada", "error");
      return;
    }

    await fn();
  },

  async deleteAvatar() {
    const user = await AuthService.requireSessionUser();
    await AuthService.deleteAvatar(user.id);

    this.profile.avatar_url = null;
    UI.renderPerfile(this.profile);

    Toast.show("Foto de perfil eliminada", "success", {
      haptic: true,
    });
  },

  async deleteHeader() {
    const user = await AuthService.requireSessionUser();
    await AuthService.deleteHeader(user.id);

    this.profile.header_url = null;
    UI.renderPerfile(this.profile);

    Toast.show("Se eliminó el header", "success", {
      haptic: true,
    });
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
