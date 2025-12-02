// storage.js
const Storage = {

  async getTasks() {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error obteniendo tareas:", error);
      return [];
    }

    return data || [];
  },

  async saveTask(task) {
  const { data, error } = await supabaseClient.from("tasks").insert(task);
  if (error) {
    console.error("Error creando tarea:", error);
    alert("Supabase ERROR: " + error.message);
  }
  return data;
},

  async updateTask(id, fields) {
    const { error } = await supabaseClient
      .from("tasks")
      .update(fields)
      .eq("id", id);

    if (error) console.error("Error actualizando:", error);
  },

  async deleteTask(id) {
    const { error } = await supabaseClient
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) console.error("Error borrando:", error);
  }
};
