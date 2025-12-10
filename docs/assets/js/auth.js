import { supabaseClient } from "./supabase.js";

// ------------------------
// LOGIN
// ------------------------
export async function login(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    // Error por correo o contraseña incorrectos
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("Correo o contraseña incorrectos");
    }

    // Formato de correo inválido
    if (error.message.includes("Invalid email")) {
      throw new Error("El correo tiene un formato inválido.");
    }

    // Otros errores
    throw error;
  }

  const { user } = data;

  if (!user.email_confirmed_at) {
    await supabaseClient.auth.signOut();
    throw new Error("Debes verificar tu correo antes de entrar.");
  }

  return user;
}



// ------------------------
// SIGN UP
// ------------------------
export async function signup(email, password) {
  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        "https://joserolandovelascopena-code.github.io/SmartTasks/pages/autentication/reset-password.html"
    }
  });

  if (error) throw error;
}

// ------------------------
// LOGOUT
//------------------------
export async function logout() {
  await supabaseClient.auth.signOut();
   window.location.href = "./pages/autentication/login.html";
}

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


// ------------------------
// RECUPERAR CONTRASEÑA
// ------------------------
export async function recoverPassword(email) {
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo:
      "https://joserolandovelascopena-code.github.io/SmartTasks/pages/autentication/reset-password.html"
  });

  if (error) throw error;
}

// ------------------------
// ACTUALIZAR CONTRASEÑA
// ------------------------
export async function updatePassword(newPass) {
  const { error } = await supabaseClient.auth.updateUser({ password: newPass });
  if (error) throw error;
}
