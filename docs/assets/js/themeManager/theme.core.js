// theme.core.js
import {
  VALID_THEMES,
  systemPrefersDark,
  safeEl,
  qs,
  qsa,
  resetButtonStyles,
  setActiveButton,
} from "./theme.helpers.js";

export function applyTheme(theme) {
  if (!VALID_THEMES.includes(theme)) theme = "system";

  const lightBtn = safeEl("Default_light");
  const darkBtn = safeEl("Default_dark");
  const systemBtn = safeEl("System_theme");

  if (!lightBtn || !darkBtn || !systemBtn) {
    console.warn("applyTheme: botones del theme no encontrados.");
    return;
  }

  resetButtonStyles(lightBtn, darkBtn, systemBtn);

  const navMain = qs(".nav-main");
  const iconsNav = qsa(".funciones_smart i");
  const navMovil = qs(".NavMovil ");

  const perfil = qs(".Perfile");
  const addTareasContenedor = qs(".subir_tarea");
  const contenidoAddTarea = qs(".contenido_main");
  const navAddTasks = qs(".Nav_addTasks");
  const sectionAddTkas = qs(".Categoria");
  const sectionAddTkas1 = qs(".contenedor_categoria");
  const encabezadosSectionAddTasks = qsa(".Categoria h4");
  const sectionAddTkas2 = qs(".descrition_box");
  const inputAddTasks = safeEl("newTask");
  const descripcionTasks = qs(".descrition_box textarea ");

  const encabezadosNavMain = qsa(".funciones_smart p");
  const titleVisionGeneral = qs(".tasksProyecAll h2");
  const plusAdd = qs(".plusAdd");

  const titleNameApp = safeEl("Titulo_app");
  const fechaCantidadTasks = qs(".contanier_settinRigth");
  const dateNow = qs(".dateNow");
  const numberDateHome = qs(".day");
  const cantidadTareasHome = qs(".candTasks");

  //Const colors
  const white = "#fff";
  const black = "#000";
  const blackTenue = "#232627ff";
  const gray = "#383838ff";
  const blueTransparet = "#8cc7d41e";
  const skyBlue = "rgb(0, 162, 255)";

  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    setActiveButton(lightBtn);
  }

  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    setActiveButton(darkBtn);

    if (navMain) {
      navMain.style.background = black;
    }
    if (navMovil) {
      navMovil.style.background = black;
      navMovil.style.boxShadow = "0 0  3px" + gray;
    }

    if (titleNameApp) {
      titleNameApp.style.color = white;
    }

    encabezadosNavMain.forEach((encabezados) => {
      encabezados.style.color = white;
    });

    if (perfil) {
      perfil.style.background = blackTenue;
      perfil.style.borderLeft = "2px solid" + gray;
    }
    if (addTareasContenedor) {
      addTareasContenedor.style.background = blackTenue;
      contenidoAddTarea.style.background = blackTenue;
      navAddTasks.style.color = white;
      sectionAddTkas.style.background = black;

      sectionAddTkas1.style.background = black;
      sectionAddTkas2.style.background = black;
      descripcionTasks.style.background = blueTransparet;
      descripcionTasks.style.color = white;
      inputAddTasks.style.background = blueTransparet;
      inputAddTasks.style.color = white;
    }

    if (plusAdd) plusAdd.style.background = "rgba(0, 13, 255, 0.93)";
    encabezadosSectionAddTasks.forEach((encabezados) => {
      encabezados.style.color = white;
    });
    iconsNav.forEach((ico) => {
      ico.style.color = "rgba(255, 255, 255, 0.93)";
    });

    if (titleVisionGeneral) {
      titleVisionGeneral.style.color = white;
    }
    if (fechaCantidadTasks) {
      fechaCantidadTasks.style.background = blueTransparet;
    }
    if (dateNow || numberDateHome) {
      dateNow.style.background = black;
      numberDateHome.style.background = black;
      numberDateHome.style.color = skyBlue;
      numberDateHome.style.border = "2px solid rgb(0, 162, 255)";
    }
    if (caches) {
      cantidadTareasHome.style.background = black;
    }
  }

  if (theme === "system") {
    setActiveButton(systemBtn);

    document.documentElement.setAttribute(
      "data-theme",
      systemPrefersDark() ? "dark" : "light"
    );
  }

  localStorage.setItem("theme", theme);
}
