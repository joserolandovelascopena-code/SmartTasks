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

function resetInlineThemeStyles(elements = []) {
  elements.forEach((el) => {
    if (!el) return;

    el.removeAttribute("style");
  });
}

function resetNodeListStyles(nodeList = []) {
  if (!nodeList.length) return;
  nodeList.forEach((el) => el.removeAttribute("style"));
}

export function applyTheme(theme) {
  if (!VALID_THEMES.includes(theme)) theme = "system";

  const lightBtn = safeEl("Default_light");
  const darkBtn = safeEl("Default_dark");
  const systemBtn = safeEl("System_theme");

  if (!lightBtn || !darkBtn || !systemBtn) {
    console.warn("applyTheme: botones del theme no encontrados.");
  } else {
    resetButtonStyles(lightBtn, darkBtn, systemBtn);
  }

  const navMain = qs(".nav-main");
  const iconsNav = qsa(".funciones_smart i");
  const navMovil = qs(".NavMovil");
  const fotoAddPersonHome = qs(".perfil_user");

  const editarTareaContenido = qsa(".cuerpo_modal ");
  const footerEditarTarea = qsa(".footer-editar ");
  const inputEditeTarea = qsa(".input-editar input ");
  const textTareaEditarTasks = qsa(".descripcionEditar textarea");
  const btnsProgramcion = qsa(".btnEditarProgrmacion");
  const CajasEccionEditarTasks = qsa(".cajaSeccionEditar");
  const openMsgDlete = qsa(".eliminarTasks");

  const perfil = qs(".Perfile");
  const editarModalPerfil = qs(".ContentEditar ");
  const contenidoEditarPerfil = qs(".foto_Perfil_header ");
  const closeEditarPerfil = qs(".CerrarEditor_Foto i ");
  const BottonSheetPerfil = qs(".ContentSheet");
  const opcionesSheetPerfil = qs(".AccionesAvanzadasEditarFoto");
  const OpcionesShetBackgroud = qsa(".opcionesEditarfoto");
  const textOpcionesShet = qsa(".opcionesEditarfoto p");
  const iconOpcionesShet = qsa(".opcionesEditarfoto  i");
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

  const ALL_THEME_ELEMENTS = [
    navMain,
    navMovil,
    titleVisionGeneral,
    fotoAddPersonHome,
    perfil,
    editarModalPerfil,
    closeEditarPerfil,
    contenidoEditarPerfil,
    BottonSheetPerfil,
    opcionesSheetPerfil,
    addTareasContenedor,
    contenidoAddTarea,
    navAddTasks,
    sectionAddTkas,
    sectionAddTkas1,
    sectionAddTkas2,
    descripcionTasks,
    inputAddTasks,
    titleNameApp,
    fechaCantidadTasks,
    dateNow,
    numberDateHome,
    cantidadTareasHome,
    plusAdd,
  ];

  const ALL_THEME_NODELISTS = [
    encabezadosNavMain,
    editarTareaContenido,
    footerEditarTarea,
    textTareaEditarTasks,
    inputEditeTarea,
    btnsProgramcion,
    openMsgDlete,
    CajasEccionEditarTasks,
    encabezadosSectionAddTasks,
    iconsNav,
    OpcionesShetBackgroud,
    textOpcionesShet,
    iconOpcionesShet,
  ];

  //Const colors
  const COLORS = {
    white: "#fff",
    whiteDark: "#aaaaaa",
    black: "#000",
    blackSoft: "#232627ff",
    graySoft: "#555555",
    gray: "#383838ff",
    blueTransparent: "#8cc7d41e",
    skyBlue: "rgb(0, 162, 255)",
  };

  if (theme === "light") {
    resetInlineThemeStyles(ALL_THEME_ELEMENTS);
    ALL_THEME_NODELISTS.forEach(resetNodeListStyles);

    document.documentElement.setAttribute("data-theme", "light");
    setActiveButton(lightBtn);
  }

  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    setActiveButton(darkBtn);

    if (fotoAddPersonHome) {
      fotoAddPersonHome.style.background = COLORS.black;
    }

    if (titleNameApp) {
      titleNameApp.style.color = COLORS.white;
    }

    if (contenidoEditarPerfil) {
      contenidoEditarPerfil.style.background = COLORS.black;
    }

    if (closeEditarPerfil) {
      closeEditarPerfil.style.color = COLORS.white;
    }

    if (addTareasContenedor) {
      navAddTasks.style.color = COLORS.white;
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
    resetInlineThemeStyles(ALL_THEME_ELEMENTS);
    setActiveButton(systemBtn);

    document.documentElement.setAttribute(
      "data-theme",
      systemPrefersDark() ? "dark" : "light",
    );
  }

  localStorage.setItem("theme", theme);
}
