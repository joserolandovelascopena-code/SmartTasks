import { supabaseClient } from "./supabase.js";
// storage.js
const Storage = {

  // Obtener todas las tareas ordenadas por ID
  async getTasks() {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error obteniendo tareas:", error.message);
      return [];
    }

    return data ?? [];
  },

  // Crear nueva tarea
  async saveTask(task) {
    const { data, error } = await supabaseClient
      .from("tasks")
      .insert(task)
      .select(); // <-- esto devuelve la tarea creada

   if (error) {
  console.error("Supabase insert ERROR:", error);
  alert("Supabase ERROR: " + error.message);
} else {
  console.log("Tarea insertada:", data);
}


    return data[0]; // devolvemos la tarea insertada
  },

  // Actualizar tarea
  async updateTask(id, fields) {
    const { data, error } = await supabaseClient
      .from("tasks")
      .update(fields)
      .eq("id", id)
      .select(); // <-- para obtener la tarea actualizada

    if (error) {
      console.error("Error actualizando tarea:", error.message);
      return null;
    }

    return data?.[0] ?? null;
  },

  // Eliminar tarea
  async deleteTask(id) {
    const { error } = await supabaseClient
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error eliminando tarea:", error.message);
      return false;
    }

    return true;
  }
};
export { Storage };
