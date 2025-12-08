
const systemPrefersDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;


function applyTheme(theme) {
  const lightBtn = document.getElementById("Default_light");
  const darkBtn = document.getElementById("Default_dark");
  const systemBtn = document.getElementById("System_theme");

  // Reset estilos
  lightBtn.style.background = "";
  darkBtn.style.background = "";
  systemBtn.style.background = "";

  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    lightBtn.style.background = "#020580";
    lightBtn.style.color = "#ffffffff";
    darkBtn.style.color = "";
    systemBtn.style.color = "";
  }
  else if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    darkBtn.style.background = "#020580";
    darkBtn.style.color = "#ffffffff";
    lightBtn.style.color = "#000000ff";
    systemBtn.style.color = "#000000ff";
    document.querySelector(".nav-main").style.background = "rgba(0, 0, 66, 0.82)"
    document.querySelector(".nav-main").style.boxShadow = "0 0 0 rgba(26, 2, 46, 0)"
    const iconsNav = document.querySelectorAll(".funciones_smart i");
    const icos2 = document.querySelector(".plusAdd");
    const blueicosNav = "rgba(0, 13, 255, 0.93)";
    icos2.style.background = blueicosNav;
    iconsNav.forEach(icos => {
    icos.style.color = blueicosNav;
    })

  }
  else if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
    systemBtn.style.background = "#020580";
    systemBtn.style.color = "#ffffffff";
    lightBtn.style.color = "";
    darkBtn.style.color = "";


    if (systemPrefersDark()) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }


  localStorage.setItem("theme", theme);
}


const savedTheme = localStorage.getItem("theme") || "system";
applyTheme(savedTheme);

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    if (localStorage.getItem("theme") === "system") {
      applyTheme("system");
    }
  });


document.getElementById("Default_light").addEventListener("click", () => {
  applyTheme("light");
});

document.getElementById("Default_dark").addEventListener("click", () => {
  applyTheme("dark");
});

document.getElementById("System_theme").addEventListener("click", () => {
  applyTheme("system");
});
