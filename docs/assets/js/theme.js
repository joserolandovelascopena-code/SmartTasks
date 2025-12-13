// theme.js (reemplaza tu archivo con esto)

const VALID_THEMES = ["light", "dark", "system"];

const systemPrefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function safeEl(id) {
  return document.getElementById(id);
}

function applyTheme(theme) {
  // Validar valor
  if (!VALID_THEMES.includes(theme)) theme = "system";

  const lightBtn = safeEl("Default_light");
  const darkBtn = safeEl("Default_dark");
  const systemBtn = safeEl("System_theme");

  if (!lightBtn || !darkBtn || !systemBtn) {
    console.warn("applyTheme: botones del theme no encontrados todavía.");
    return;
  }


  lightBtn.style.background = "";
  darkBtn.style.background = "";
  systemBtn.style.background = "";
  lightBtn.style.color = "";
  darkBtn.style.color = "";
  systemBtn.style.color = "";

  // Helpers para elementos opcionales
  const navMain = document.querySelector(".nav-main");
  const iconsNav = document.querySelectorAll(".funciones_smart i");
  const plusAdd = document.querySelector(".plusAdd");

  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    lightBtn.style.background = "#020580";
    lightBtn.style.color = "#ffffffff";
  } else if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    darkBtn.style.background = "#020580";
    darkBtn.style.color = "#ffffffff";

    if (navMain) {
      navMain.style.background = "rgba(0, 0, 66, 0.82)";
      navMain.style.boxShadow = "0 0 0 rgba(26, 2, 46, 0)";
    }
    if (plusAdd) plusAdd.style.background = "rgba(0, 13, 255, 0.93)";
    if (iconsNav && iconsNav.length) {
      iconsNav.forEach(ico => {
        ico.style.color = "rgba(0, 13, 255, 0.93)";
      });
    }
  } else if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
    systemBtn.style.background = "#020580";
    systemBtn.style.color = "#ffffffff";

    if (systemPrefersDark()) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }

  localStorage.setItem("theme", theme);
}


document.addEventListener("DOMContentLoaded", () => {

  let savedTheme = localStorage.getItem("theme");
  if (!VALID_THEMES.includes(savedTheme)) savedTheme = "system";

  applyTheme(savedTheme);


  document.getElementById("Default_light")?.addEventListener("click", () => {
    applyTheme("light");
  });
  document.getElementById("Default_dark")?.addEventListener("click", () => {
    applyTheme("dark");
  });
  document.getElementById("System_theme")?.addEventListener("click", () => {
    applyTheme("system");
  });

});


window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    if (localStorage.getItem("theme") === "system") {
      // Asegurarse de que los elementos existan antes de aplicar
      if (document.getElementById("Default_light")) applyTheme("system");
    }
  });
