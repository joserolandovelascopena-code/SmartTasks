import { supabaseClient } from "./supabase.js";


//SIGN UP
export async function signup(fullName, email, password) {
  const { data, error } = await supabaseClient.auth.signUp({
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

  return data.user;
}


//LOGIN 
export async function login(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  const user = data.user;


  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

 
  if (!profile) {
    await supabaseClient.from("profiles").insert({
      id: user.id,
      full_name: user.user_metadata.full_name ?? null,
      avatar_url: null
    });
  }

  return user;
}


export async function createProfile(userId, email) {
  const { error } = await supabaseClient.from("profiles").insert({
    id: userId,
    email,
    nombre: null,
    foto_url: null
  });

  if (error) throw error;
}


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



export async function recoverPassword(email) {
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo:
      "https://joserolandovelascopena-code.github.io/SmartTasks/pages/autentication/reset-password.html"
  });

  if (error) throw error;
}

export async function updatePassword(newPass) {
  const { error } = await supabaseClient.auth.updateUser({ password: newPass });
  if (error) throw error;
}
