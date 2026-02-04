// task.service.js
import { Storage } from "../storage.js";
import { supabaseClient } from "../supabase.js";
import {
  sanitizeAndValidate,
  sanitizeText,
  normalizeText,
} from "../security/inputSanitizer.js";
import { SchedulerService } from "./scheduler.service.js";

export const TaskService = {
  async createTask({
    text,
    descripcion,
    categoria,
    prioridad,
    selectedDate,
    selectedTime,
  }) {
    // 1. Validación título
    const result = sanitizeAndValidate(text, {
      min: 3,
      max: 120,
    });

    if (result.error) {
      throw new Error(result.error);
    }

    // 2. Descripción segura
    const safeDescription = descripcion
      ? sanitizeText(normalizeText(descripcion))
      : "";

    // 3. Sesión
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) {
      throw new Error("Sesión inválida");
    }

    // 4. Fechas
    const { due_date, due_time } = SchedulerService.normalizeDueDateTime(
      selectedDate,
      selectedTime,
    );

    // 5. Modelo final
    const task = {
      text: result.value,
      descripcion: safeDescription,
      categoria: categoria || "Ninguna",
      prioridad: prioridad || "Ninguna",
      done: false,
      user_id: data.session.user.id,
      created_at: new Date().toISOString(),

      due_date,
      due_time,
      notify: false,
      notify_before: null,
      repeat_type: null,
    };

    // 6. Persistencia
    await Storage.saveTask(task);

    return task;
  },
};
