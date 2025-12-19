import { supabaseClient } from "./supabase.js";

const Storage = {

async getProfile(){
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
  .single(); // 👈 clave

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
    const resp = await supabaseClient
      .from("tasks")
      .update(fields)
      .eq("id", id)
      .select();

    console.log("updateTask response:", resp); 
    if (resp.error) {
      console.error("Error actualizando tarea:", resp.error);
      return null;
    }
    return resp.data?.[0] ?? null;
  } catch (err) {
    console.error("Exception en updateTask:", err);
    return null;
  }
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
