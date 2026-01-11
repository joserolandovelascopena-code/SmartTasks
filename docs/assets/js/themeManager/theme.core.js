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
  const navMovil = qs(".NavMovil");

  const perfil = qs(".Perfile");
  const editarModalPerfil = qs(".ContentEditar ");
  const contenidoEditarPerfil = qs(".foto_Perfil_header ");
  const closeEditarPerfil = qs(".CerrarEditor_Foto i ");
  const BottonSheetPerfil = qs(".ContentSheet");
  const opcionesSheetPerfil = qs(".AccionesAvanzadasEditarFoto");
  const textOpcionesShet = qsa(".opcionesEditarfoto p");

  const addTareasContenedor = qs(".subir_tarea");
  const contenidoAddTarea = qs(".contenido_main");
  const navAddTasks = qs(".Nav_addTasks");
  const sectionAddTkas = qs(".Categoria");
  const sectionAddTkas1 = qs(".contenedor_categoria");
  const encabezadosSectionAddTasks = qsa(".Categoria h4");
  const sectionAddTkas2 = qs(".descrition_box");
  const inputAddTasks = safeEl("newTask");
  const descripcionTasks = qs(".descrition_box textarea");

  const encabezadosNavMain = qsa(".funciones_smart p");
  const titleVisionGeneral = qs(".tasksProyecAll h2");
  const plusAdd = qs(".plusAdd");

  const titleNameApp = safeEl("Titulo_app");
  const fechaCantidadTasks = qs(".contanier_settinRigth");
  const dateNow = qs(".dateNow");
  const numberDateHome = qs(".day");
  const cantidadTareasHome = qs(".candTasks");

  //Const colors
  const COLORS = {
    white: "#fff",
    whiteDark: "#aaaaaa",
    black: "#000",
    blackSoft: "#232627ff",
    gray: "#383838ff",
    blueTransparent: "#8cc7d41e",
    skyBlue: "rgb(0, 162, 255)",
  };

  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    setActiveButton(lightBtn);
  }

  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    setActiveButton(darkBtn);

    if (navMain) {
      navMain.style.background = COLORS.black;
      navMain.style.boxShadow = "0 0  3px rgb(48, 47, 47)";
    }
    if (navMovil) {
      navMovil.style.background = COLORS.black;
      navMovil.style.boxShadow = "0 0  3px rgb(27, 27, 27)";
    }

    if (titleNameApp) {
      titleNameApp.style.color = COLORS.white;
    }

    if (encabezadosNavMain.length) {
      encabezadosNavMain.forEach((el) => {
        el.style.color = COLORS.whiteDark;
      });
    }

    if (perfil) {
      perfil.style.background = COLORS.blackSoft;
      perfil.style.borderLeftColor = " rgb(58, 58, 58)";
    }

    if (editarModalPerfil) {
      editarModalPerfil.style.background = COLORS.blackSoft;
      editarModalPerfil.style.color = COLORS.white;
    }

    if (contenidoEditarPerfil) {
      contenidoEditarPerfil.style.background = COLORS.black;
      BottonSheetPerfil.style.background = COLORS.blackSoft;
      opcionesSheetPerfil.style.background = COLORS.blackSoft;
      opcionesSheetPerfil.style.color = COLORS.white;
    }

    if (textOpcionesShet) {
      textOpcionesShet.forEach((op) => {
        op.style.color = COLORS.whiteDark;
      });
    }

    if (closeEditarPerfil) {
      closeEditarPerfil.style.color = COLORS.white;
    }

    if (addTareasContenedor) {
      addTareasContenedor.style.background = COLORS.blackSoft;
      contenidoAddTarea.style.background = COLORS.blackSoft;
      navAddTasks.style.color = COLORS.white;
      sectionAddTkas.style.background = COLORS.black;

      sectionAddTkas1.style.background = COLORS.black;
      sectionAddTkas2.style.background = COLORS.black;
    }

    if (descripcionTasks) {
      descripcionTasks.style.background = COLORS.blueTransparent;
      descripcionTasks.style.color = COLORS.white;
    }

    if (inputAddTasks) {
      inputAddTasks.style.background = COLORS.blueTransparent;
      inputAddTasks.style.color = COLORS.white;
    }

    if (plusAdd) {
      plusAdd.style.background = "rgba(0, 13, 255, 0.93)";
    }

    encabezadosSectionAddTasks.forEach((encabezados) => {
      encabezados.style.color = COLORS.white;
    });

    iconsNav.forEach((ico) => {
      ico.style.color = COLORS.whiteDark;
    });

    if (titleVisionGeneral) {
      titleVisionGeneral.style.color = COLORS.white;
    }
    if (fechaCantidadTasks) {
      fechaCantidadTasks.style.background = COLORS.blueTransparent;
    }
    if (dateNow || numberDateHome) {
      dateNow.style.background = COLORS.black;
      numberDateHome.style.background = COLORS.black;
      numberDateHome.style.color = COLORS.skyBlue;
      numberDateHome.style.border = "2px solid rgb(0, 162, 255)";
    }
    if (cantidadTareasHome) {
      cantidadTareasHome.style.background = COLORS.black;
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
