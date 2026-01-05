import { supabaseClient } from "./supabase.js";

const Storage = {
  async getProfile() {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      console.error("No hay sesión activa");
      return [];
    }

    const { data, error } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error obteniendo perfiles:", error.message);
      return [];
    }

    return data;
  },

  async getTasks() {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      console.error("No hay sesión activa");
      return [];
    }

    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false });

    if (error) {
      console.error("Error obteniendo tareas:", error.message);
      return [];
    }

    return data ?? [];
  },
  async saveTask(task) {
    try {
      const { data, error } = await supabaseClient
        .from("tasks")
        .insert(task)
        .select();

      if (error) {
        console.error("Error guardando tarea:", error);
        return null;
      }

      return data?.[0] ?? null;
    } catch (err) {
      console.error("Exception en saveTask:", err);
      return null;
    }
  },
  async updateTask(id, fields) {
    try {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const userId = sessionData?.session?.user?.id;

      if (!userId) {
        console.error("No hay sesión activa");
        return null;
      }

      const { data, error } = await supabaseClient
        .from("tasks")
        .update(fields)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error actualizando tarea:", error.message);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Exception en updateTask:", err);
      return null;
    }
  },
  async SaveUpdateTask(id, fields) {
    try {
      const { data, error } = await supabaseClient
        .from("tasks")
        .update(fields)
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error editando tarea:", error);
        return null;
      }

      return data?.[0] ?? null;
    } catch (err) {
      console.error("Exception SaveUpdateTask:", err);
      return null;
    }
  },
  // Eliminar tarea
  async deleteTask(id) {
    const { error } = await supabaseClient.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error eliminando tarea:", error.message);
      return false;
    }

    return true;
  },
  async cantidadTasksPorUsuario(userId) {
    try {
      const { count, error } = await supabaseClient
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (error) {
        console.error("Error obteniendo cantidad de tareas:", error);
        return null;
      }

      return count;
    } catch (err) {
      console.error("Exception cantidadTasks:", err);
      return null;
    }
  },
};
export { Storage };
