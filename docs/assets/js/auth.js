import { supabaseClient } from "./supabase.js";

/* ------------------------
   SIGN UP + CREATE PROFILE
-------------------------*/
export async function signup(fullName, email, password) {
await supabaseClient.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo:
      "https://joserolandovelascopena-code.github.io/SmartTasks/pages/autentication/verify.html",
    data: {
      full_name: fullName
    }
  }
});
  if (error) throw error;

}



/* ------------------------
   LOGIN + GET PROFILE
-------------------------*/
export async function login(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  const user = data.user;

  // Buscar perfil
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Si NO existe, crearlo
  if (!profile) {
    await supabaseClient.from("profiles").insert({
      id: user.id,
      full_name: user.user_metadata.full_name ?? null,
      avatar_url: null
    });
  }

  return user;
}

// CREAR PERFIL PARA USUARIO NUEVO
export async function createProfile(userId, email) {
  const { error } = await supabaseClient.from("profiles").insert({
    id: userId,
    email,
    nombre: null,
    foto_url: null
  });

  if (error) throw error;
}

/* ------------------------
   LOGOUT  (TAL CUAL LO TIENES)
-------------------------*/
export async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "./pages/autentication/login.html";
}

/* ------------------------
   PROTEGER RUTA (TAL CUAL LO TIENES)
-------------------------*/
export async function protectRoute() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    window.location.href = "./pages/autentication/login.html";
    return;
  }

  if (!user.email_confirmed_at) {
    await supabaseClient.auth.signOut();
    window.location.href = "./pages/autentication/login.html";
  }
}


/* ------------------------
   RECUPERAR CONTRASEÑA
-------------------------*/
export async function recoverPassword(email) {
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo:
      "https://joserolandovelascopena-code.github.io/SmartTasks/pages/autentication/reset-password.html"
  });

  if (error) throw error;
}

/* ------------------------
   ACTUALIZAR CONTRASEÑA
-------------------------*/
export async function updatePassword(newPass) {
  const { error } = await supabaseClient.auth.updateUser({ password: newPass });
  if (error) throw error;
}
