function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

// Cargar preferencia guardada
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
} else {
  // Si no hay preferencia, deja que el sistema decida
  console.log("Usando tema del sistema");
}

// Botón de cambio de tema
document.getElementById("toggle-theme").addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  let newTheme = current === "dark" ? "light" : "dark";
  setTheme(newTheme);
});
