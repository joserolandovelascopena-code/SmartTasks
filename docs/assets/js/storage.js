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

  async uploadAvatar(file) {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user || !file) throw new Error("No hay sesión o archivo");

    const filePath = `${user.id}/avatar`; // 👈 PATH FIJO

    const { error } = await supabaseClient.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) throw error;

    const { data } = supabaseClient.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async uploadHeader(file) {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user || !file) throw new Error("No hay sesión o archivo");

    const filePath = `${user.id}/header`;

    const { error } = await supabaseClient.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) throw error;

    const { data } = supabaseClient.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async updateAvatarUrl(url) {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) throw new Error("No hay sesión");

    const { error } = await supabaseClient
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", user.id);

    if (error) throw error;

    return true;
  },

  async updateHeaderUrl(url) {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const user = sessionData?.session?.user;

    const { error } = await supabaseClient
      .from("profiles")
      .update({ header_url: url })
      .eq("id", user.id);

    if (error) throw error;
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
    const { data, error: selectError } = await supabaseClient
      .from("tasks")
      .select("text")
      .eq("id", id)
      .single();

    if (selectError) {
      throw new Error(selectError.message);
    }

    const taskName = data.text;

    const { error: deleteError } = await supabaseClient
      .from("tasks")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return taskName;
  },

  async deleteAvatarFile(userId) {
    const { error } = await supabaseClient.storage
      .from("avatars")
      .remove([`${userId}/avatar`]);

    if (error) throw error;
  },

  async deleteHeaderFile(userId) {
    const { error } = await supabaseClient.storage
      .from("avatars")
      .remove([`${userId}/header`]);

    if (error) throw error;
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
