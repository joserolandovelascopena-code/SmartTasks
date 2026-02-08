// auth.service.js
import { Storage } from "../storage.js";
import { supabaseClient } from "../supabase.js";

export const AuthService = {
  async getSessionUser() {
    const { data } = await supabaseClient.auth.getSession();
    return data?.session?.user || null;
  },

  async requireSessionUser() {
    const user = await this.getSessionUser();
    if (!user) {
      throw new Error("No hay sesión");
    }
    return user;
  },

  async buildProfile(userId) {
    const profile = await Storage.getProfile();
    const totalTasks = await Storage.cantidadTasksPorUsuario(userId);
    return {
      ...profile,
      totalTasks,
    };
  },

  async loadProfile() {
    return await Storage.getProfile();
  },

  async deleteAvatar(userId) {
    await Storage.updateAvatarUrl(null);
    await Storage.deleteAvatarFile(userId);
    return { avatar_url: null };
  },

  async deleteHeader(userId) {
    await Storage.updateHeaderUrl(null);
    await Storage.deleteHeaderFile(userId);
    return { header_url: null };
  },
};
