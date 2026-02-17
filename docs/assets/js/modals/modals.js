//modals.js

import { App } from "../core/app.js";
import { Storage } from "../storage.js";
import { UI } from "../ui.js";
import { Toast } from "../toastManager/toast.js";
import { OverlayManager } from "../overlayManager/overlayManager.js";
import { ScrollBody } from "./scrollModals.js";
import { Haptic } from "../toastManager/haptic.js";
import { monthNames } from "../utils/monthNames.js";

document.addEventListener("DOMContentLoaded", () => {
  const openAdd = document.querySelectorAll(".openAdd");
  const contenAdd = document.querySelector(".subir_tarea");

  const perfilContainer = document.querySelector(".Perfile");

  const closeAddTaks = document.getElementById("CloseAddTasks");

  function openAddTask() {
    perfilContainer.classList.remove("show");
    Overview.classList.remove("show");

    ScrollBody.disableBodyScroll(); // SOLO móvil

    contenAdd.classList.add("show");

    history.pushState({ addTask: true }, "", "#add-task");
    OverlayManager.push("closeAddTasks", closeAddTask);
  }

  function closeAddTask() {
    // SOLO móvil
    ScrollBody.enableBodyScroll();
    contenAdd.classList.remove("show");

    bodycontenedor.classList.remove("show");
  }

  openAdd.forEach((op) => {
    op.addEventListener("click", openAddTask);
  });

  closeAddTaks.addEventListener("click", () => {
    history.back();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const repeticion_tasks = document.querySelector(".repeticion_tasks");
  const openRepeticion = document.getElementById("openOpiciones");

  openRepeticion.addEventListener("click", () => {
    repeticion_tasks.classList.toggle("show");
  });
});

// fecha
/*======================================= */
let currentDate = new Date();
let selectedDate = null;
let calendarWheelLocked = false;
let originalAddCalendarDate = null;

const monthYear = document.getElementById("monthYear");
const daysContainer = document.getElementById("calendarDays");

function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [y, m, d] = clean.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function renderCalendar(monthDirection = 0) {
  daysContainer.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = `${monthNames[month]} ${year}`;
  daysContainer.classList.remove("slide-left", "slide-right");

  if (monthDirection === 1) {
    daysContainer.classList.add("slide-left");
  } else if (monthDirection === -1) {
    daysContainer.classList.add("slide-right");
  }

  const firstDay = new Date(year, month, 1).getDay();
  const startDay = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let dayIndex = 0;

  for (let i = 0; i < startDay; i++) {
    const emptyEl = document.createElement("div");
    emptyEl.className = "calendar-day-empty";
    daysContainer.appendChild(emptyEl);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("calendar-day-item");
    dayEl.style.animationDelay = `${dayIndex * 18}ms`;
    dayEl.textContent = day;

    const isSameDay =
      selectedDate &&
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day;

    if (isSameDay) {
      dayEl.classList.add("selected");
    }

    const today = new Date();
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day;

    if (isToday) {
      dayEl.classList.add("today");
      dayEl.title = "Hoy";
    }

    dayEl.onclick = () => {
      document
        .querySelectorAll(".calendar-days .selected")
        .forEach((d) => d.classList.remove("selected"));

      dayEl.classList.add("selected");
      selectedDate = new Date(year, month, day);
      Haptic.vibrateUi("success");
    };

    daysContainer.appendChild(dayEl);
    dayIndex++;
  }
}

function changeAddTaskCalendarMonth(step) {
  currentDate.setMonth(currentDate.getMonth() + step);
  renderCalendar(step);
  Haptic.vibrateUi("success");
}

function triggerAddTaskCalendarMonth(step) {
  if (calendarWheelLocked) return;
  calendarWheelLocked = true;
  changeAddTaskCalendarMonth(step);

  window.setTimeout(() => {
    calendarWheelLocked = false;
  }, 280);
}

function handleCalendarLateralScroll(event) {
  const calendar = document.querySelector(".calendar");
  if (!calendar?.classList.contains("show")) return;

  const lateralDelta =
    Math.abs(event.deltaX) > 0
      ? event.deltaX
      : event.shiftKey
        ? event.deltaY
        : 0;

  if (Math.abs(lateralDelta) < 12) return;

  event.preventDefault();
  triggerAddTaskCalendarMonth(lateralDelta > 0 ? 1 : -1);
}

function handleCalendarTouchSwipe() {
  let touchStartX = 0;
  let touchStartY = 0;

  daysContainer.addEventListener(
    "touchstart",
    (event) => {
      const calendar = document.querySelector(".calendar");
      if (!calendar?.classList.contains("show")) return;

      const touch = event.changedTouches?.[0];
      if (!touch) return;

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true },
  );

  daysContainer.addEventListener(
    "touchend",
    (event) => {
      const calendar = document.querySelector(".calendar");
      if (!calendar?.classList.contains("show")) return;

      const touch = event.changedTouches?.[0];
      if (!touch) return;

      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      const isHorizontalSwipe =
        Math.abs(deltaX) >= 34 && Math.abs(deltaX) > Math.abs(deltaY);

      if (!isHorizontalSwipe) return;

      triggerAddTaskCalendarMonth(deltaX < 0 ? 1 : -1);
    },
    { passive: true },
  );
}

const btnOpenCalendar = document.getElementById("fecha");
btnOpenCalendar.addEventListener("click", openCalendar);

function openCalendar() {
  selectedDate = parseLocalDate(App.selectedDate);
  originalAddCalendarDate = selectedDate ? new Date(selectedDate) : null;

  if (selectedDate) {
    currentDate = new Date(selectedDate);
  }

  renderCalendar();

  document.querySelector(".contenedorCalendario").classList.add("show");
  document.querySelector(".calendar").classList.add("show");

  history.pushState({ calendarEditar: true }, "", "#calendar-system");
  OverlayManager.push("close-calendar", cerrarCalendario);
}

document.querySelector(".aceptarDate").addEventListener("click", () => {
  if (!selectedDate) return;

  App.selectedDate = selectedDate.toISOString().split("T")[0];

  const fechaText = document
    .getElementById("fecha")
    .querySelector(".programacionTasks");

  fechaText.textContent = selectedDate.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  history.back();
});

document.querySelector(".cancelarDate").addEventListener("click", () => {
  selectedDate = originalAddCalendarDate
    ? new Date(originalAddCalendarDate)
    : null;
  currentDate = selectedDate ? new Date(selectedDate) : new Date();
  renderCalendar();
  history.back();
});

document.addEventListener("click", (e) => {
  const contenedorCalen = document.querySelector(".contenedorCalendario");
  const caledario = document.querySelector(".calendar");

  if (!btnOpenCalendar || !contenedorCalen || !caledario) return;

  const estaAbierto = contenedorCalen.classList.contains("show");
  const clickDentroDelCalen = caledario.contains(e.target);
  const clickEnBoton = btnOpenCalendar.contains(e.target);

  if (estaAbierto && !clickDentroDelCalen && !clickEnBoton) {
    history.back();
  }
});

function cerrarCalendario() {
  document.querySelector(".calendar").classList.remove("show");
  setTimeout(() => {
    document.querySelector(".contenedorCalendario").classList.remove("show");
  }, 200);
}

document.getElementById("prevMonth").onclick = () => {
  changeAddTaskCalendarMonth(-1);
};

document.getElementById("nextMonth").onclick = () => {
  changeAddTaskCalendarMonth(1);
};

daysContainer.addEventListener("wheel", handleCalendarLateralScroll, {
  passive: false,
});
handleCalendarTouchSwipe();

renderCalendar();

//=============================
const hourSelect = document.getElementById("hourSelect");
const minuteSelect = document.getElementById("minuteSelect");

let tempHour = null;
let tempMinute = null;

/* CREAR HORAS */
for (let h = 0; h < 24; h++) {
  const div = document.createElement("div");
  div.className = "opcionHora";
  div.textContent = h.toString().padStart(2, "0");

  div.onclick = () => {
    tempHour = div.textContent;
    activarSeleccion(hourSelect, div);
  };

  hourSelect.appendChild(div);
}

/* CREAR MINUTOS */
for (let m = 0; m < 60; m++) {
  const div = document.createElement("div");
  div.className = "opcionHora";
  div.textContent = m.toString().padStart(2, "0");

  div.onclick = () => {
    tempMinute = div.textContent;
    activarSeleccion(minuteSelect, div);
  };

  minuteSelect.appendChild(div);
}

function activarPorScroll(contenedor, tipo) {
  let ticking = false;

  contenedor.addEventListener("scroll", () => {
    if (ticking) return;

    window.requestAnimationFrame(() => {
      const opciones = [...contenedor.children];
      const centro = contenedor.scrollTop + contenedor.clientHeight / 2;

      let seleccionado = opciones[0];

      opciones.forEach((op) => {
        const opCentro = op.offsetTop + op.offsetHeight / 2;
        if (
          Math.abs(opCentro - centro) <
          Math.abs(
            seleccionado.offsetTop + seleccionado.offsetHeight / 2 - centro,
          )
        ) {
          seleccionado = op;
        }
      });

      activarSeleccion(contenedor, seleccionado);

      if (tipo === "hora") tempHour = seleccionado.textContent;
      if (tipo === "minuto") tempMinute = seleccionado.textContent;

      actualizarHoraFormada();
      ticking = false;
    });

    ticking = true;
  });
}

activarPorScroll(hourSelect, "hora");
activarPorScroll(minuteSelect, "minuto");

function formato12h(hora24, minuto) {
  let h = parseInt(hora24, 10);
  const ampm = h >= 12 ? "p.m." : "a.m.";
  h = h % 12 || 12;
  return `${h} : ${minuto} ${ampm}`;
}

function actualizarHoraFormada() {
  if (tempHour === null || tempMinute === null) return;

  document.querySelector(".horaFormada h5").textContent = formato12h(
    tempHour,
    tempMinute,
  );
}

function activarSeleccion(contenedor, elemento) {
  contenedor
    .querySelectorAll(".opcionHora")
    .forEach((o) => o.classList.remove("active"));
  elemento.classList.add("active");
}

/* ABRIR */

document.getElementById("hora").addEventListener("click", openReloj);
const ContendorReloj = document.querySelector(".contenedorReloj");
const reloj = document.querySelector(".reloj");

function openReloj() {
  ContendorReloj.classList.add("show");
  reloj.classList.add("show");

  history.pushState({ openReloj: true }, "", "#reloj-system");
  OverlayManager.push("close-Reloj", cerrarReloj);
}

/* CANCELAR */
document.querySelector(".cancelarHora").onclick = () => {
  tempHour = null;
  tempMinute = null;
  history.back();
};

document.addEventListener("click", (e) => {
  const openReloj = document.getElementById("hora");
  const contenedorReloj = document.querySelector(".contenedorReloj");
  const reloj = document.querySelector(".reloj");

  if (!openReloj || !contenedorReloj || !reloj) return;

  const estaAbierto = contenedorReloj.classList.contains("show");
  const clickDentroDelReloj = reloj.contains(e.target);
  const clickEnBoton = openReloj.contains(e.target);

  if (estaAbierto && !clickDentroDelReloj && !clickEnBoton) {
    history.back();
  }
});

/* ACEPTAR */
document.querySelector(".aceptarHora").onclick = () => {
  if (tempHour === null || tempMinute === null) {
    console.warn("Hora incompleta");
    return;
  }

  const finalTime = `${tempHour}:${tempMinute}`;
  App.selectedTime = finalTime;

  document
    .getElementById("hora")
    .querySelector(".programacionTasks").textContent = finalTime;

  history.back();
};

function cerrarReloj() {
  document.querySelector(".reloj").classList.remove("show");
  setTimeout(() => {
    document.querySelector(".contenedorReloj").classList.remove("show");
  }, 200);
}

//perfil
const openPerfile = document.querySelectorAll(".openPerfil");
const closePerfil = document.getElementById("Hogar");
const closePerfilFlecha = document.querySelectorAll(".salirPerfil");

const perfilContainer = document.querySelector(".Perfile");
const cantidadTkasPerfile = document.querySelector(".cantidadTasksPerfile");
const contenAdd = document.querySelector(".subir_tarea");

function openPerfil() {
  perfilContainer.classList.add("show");
  contenAdd.classList.remove("show");
  Overview.classList.remove("show");
  ScrollBody.disableBodyScroll();

  cantidadTkasPerfile.classList.remove("active");
  void cantidadTkasPerfile.offsetWidth;
  cantidadTkasPerfile.classList.add("active");

  history.pushState({ perfil: true }, "", "#perfil");

  //Manager
  OverlayManager.push("perfil", closePerfilView);
}

function closePerfilView() {
  ScrollBody.enableBodyScroll();
  perfilContainer.classList.remove("show");
}

openPerfile.forEach((per) => {
  per.addEventListener("click", openPerfil);
});

closePerfil.addEventListener("click", () => {
  history.back();
});

closePerfilFlecha.forEach((btn) => {
  btn.addEventListener("click", () => {
    history.back();
  });
});

const layout = document.querySelector(".loyoutPerfile");
const header = document.querySelector(".header_perfil_scroll");

layout.addEventListener("scroll", () => {
  header.classList.toggle("show", layout.scrollTop > 40);
});

//============================================

const modalOpcionesClickFoto = document.querySelector(
  ".modalOpcionesClickImagePerfil",
);
const openModalOpcionesClickFoto = document.querySelector(".fotoPerfil img");
const contenidoModal = document.querySelector(".contenidoVisualizarOpciones");

openModalOpcionesClickFoto.addEventListener("click", (e) => {
  e.stopPropagation();
  modalOpcionesClickFoto.classList.add("show");
});

// CERRAR AL CLICK FUERA
document.addEventListener("click", (e) => {
  if (
    modalOpcionesClickFoto.classList.contains("show") &&
    !contenidoModal.contains(e.target) &&
    !openModalOpcionesClickFoto.contains(e.target)
  ) {
    modalOpcionesClickFoto.classList.remove("show");
  }
});

const openVisualizarFotoUser = document.querySelector(
  ".openVisualizarFotoUser",
);
const btnCerrarLightBox = document.querySelector(".btnCerrarLightBox");
const lightBox = document.querySelector(".LightBox");
const contenidoLightBox = document.querySelector(".cotenidoLightBox");

function openViewLightBox() {
  lightBox.classList.add("show");
  contenidoLightBox.classList.add("show");

  history.pushState({ lightBox: true }, "", "#lightBox_foto_del_perfil");

  OverlayManager.push("lightBox_photoUser", closeViewLightBox);
}

function closeViewLightBox() {
  contenidoLightBox.classList.remove("show");
  setTimeout(() => {
    lightBox.classList.remove("show");
  }, 300);
}

openVisualizarFotoUser.addEventListener("click", openViewLightBox);

btnCerrarLightBox.addEventListener("click", () => {
  history.back();
});

// editar fotos
const editorPerfil = document.querySelector(".EditarPerfilHeader");
const btnCerrarEditor = document.querySelector(".CerrarEditor_Foto");

const openEditarFotos = document.querySelectorAll(".openEditarPerfilHeader");
const contenidoEditarFotos = document.querySelector(".ContentEditar");

const inputFotoPerfil = document.getElementById("inputFotoPerfil");
const inputFotoHeader = document.getElementById("inputFotoHeader");

// Preview
const previewImg = document.querySelector(".VisualizarFotoPerfil img");
const previewHeader = document.querySelector(".previsualizarHeader");
const previewImgHeader = document.querySelector(".PreviewHeaderMain");

// Botón aceptar
const btnAceptar = document.querySelector(".ApcentarCambio");
const btnCancelarHeder = document.querySelector(".CancelarHeader");
const btnAceptarHeader = document.querySelector(".AceptarHeader");

//animaciones succes de editar
const VisualizarFotoBorder = document.querySelector(".borderActiveImg");
const btnAceptarCambiosFoto = document.querySelector(".btnAceptar button");
const BtnLoaderCambiarFoto = document.querySelector(".cajaBtnLoader");
const trasitionPreviewHeader = document.querySelector(".ImgVisualizarHeader");
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function openEditorFotos() {
  syncEditorPreviewFromProfile();
  editorPerfil.classList.add("show");
  contenidoEditarFotos.classList.add("show");

  history.pushState({ editorFotos: true }, "", "#add_Fotos_Perfil");

  OverlayManager.push("addFotosPerfil", closeEditorFotos);
}

function closeEditorFotos() {
  editorPerfil.classList.remove("show");
  contenidoEditarFotos.classList.remove("show");
  VisualizarFotoBorder.classList.remove("show");
  btnAceptarCambiosFoto.classList.remove("active");
}

function syncEditorPreviewFromProfile() {
  const cache = `?t=${Date.now()}`;
  const avatarUrl = App.profile?.avatar_url;
  const headerUrl = App.profile?.header_url;

  if (previewImg) {
    previewImg.src = avatarUrl ? `${avatarUrl}${cache}` : DEFAULT_AVATAR;
  }

  if (previewImgHeader) {
    previewImgHeader.src = headerUrl ? `${headerUrl}${cache}` : "";
  }
}

openEditarFotos.forEach((op) => {
  op.addEventListener("click", openEditorFotos);
});

btnCerrarEditor.addEventListener("click", (e) => {
  e.stopPropagation();
  e.preventDefault();

  history.back();
});

inputFotoPerfil.addEventListener("click", () => {
  inputFotoPerfil.value = "";
  selectedAvatarFile = null;
  VisualizarFotoBorder.classList.remove("show");
  btnAceptarCambiosFoto.classList.remove("active");
  syncEditorPreviewFromProfile();
});

inputFotoHeader.addEventListener("click", () => {
  inputFotoHeader.value = "";
  selectedHeaderFile = null;
  syncEditorPreviewFromProfile();
  previewHeader.classList.add("show");
  trasitionPreviewHeader.classList.add("show");
});

btnCancelarHeder.addEventListener("click", () => {
  trasitionPreviewHeader.classList.remove("show");

  setTimeout(() => {
    previewHeader.classList.remove("show");
  }, 200);
});

inputFotoPerfil.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    Toast.show("Archivo no válido", "error", {
      sound: true,
      haptic: true,
    });
    e.target.value = "";
    return;
  }

  const MAX_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    Toast.show("La imagen es muy pesada", "error");
    e.target.value = "";
    return;
  }

  const allowed = ["image/png", "image/jpeg", "image/webp"];
  if (!allowed.includes(file.type)) {
    Toast.show("Imagen no válida", "error", {
      haptic: true,
    });
    e.target.value = "";
  }

  selectedAvatarFile = file;

  const reader = new FileReader();
  reader.onload = () => {
    previewImg.src = reader.result;
  };

  reader.readAsDataURL(file);

  VisualizarFotoBorder.classList.add("show");
  btnAceptarCambiosFoto.classList.add("active");
});

let selectedAvatarFile = null;
let selectedHeaderFile = null;

inputFotoHeader.addEventListener("change", (e) => {
  previewImgHeader.classList.add("show");
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    Toast.show("Archivo no válido", "error", {
      sound: true,
      haptic: true,
    });
    e.target.value = "";
    return;
  }

  const allowed = ["image/png", "image/jpeg", "image/webp"];
  if (!allowed.includes(file.type)) {
    Toast.show("Imagen no válida", "error", {
      haptic: true,
    });
    e.target.value = "";
  }

  const MAX_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    Toast.show("La imagen es muy pesada", "error");
    e.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    previewImgHeader.src = reader.result;
  };

  reader.readAsDataURL(file);
});

btnAceptar.addEventListener("click", async () => {
  try {
    const file = inputFotoPerfil.files[0];
    if (!file) {
      Toast.show("Selecciona una imagen", "warning");
      return;
    }

    BtnLoaderCambiarFoto.classList.add("active");

    Toast.show("Subiendo foto...", "info");

    const avatarUrl = await Storage.uploadAvatar(file);

    setTimeout(() => {
      history.back();
      BtnLoaderCambiarFoto.classList.remove("active");

      Toast.show("Se actualizo la foto de perfil ", "success", {
        sound: true,
        haptic: true,
      });
    }, 1500);

    await Storage.updateAvatarUrl(avatarUrl);

    App.profile.avatar_url = avatarUrl;

    UI.renderPerfile(App.profile);
  } catch (err) {
    console.error(err);
    Toast.show("Error al subir la imagen", "error", {
      sound: true,
      haptic: true,
    });
    setTimeout(() => {
      BtnLoaderCambiarFoto.classList.remove("active");
    }, 300);
  }
});

btnAceptarHeader.addEventListener("click", async () => {
  try {
    const file = inputFotoHeader.files[0];
    if (!file) {
      Toast.show("Selecciona una imagen", "warning");
      return;
    }

    previewHeader.classList.remove("show");

    BtnLoaderCambiarFoto.classList.add("active");

    Toast.show("Subiendo header...", "info");

    const avatarUrl_header = await Storage.uploadHeader(file);

    setTimeout(() => {
      history.back();
      BtnLoaderCambiarFoto.classList.remove("active");

      Toast.show("Se cambio el header correctamente", "success", {
        sound: true,
        haptic: true,
      });
    }, 1500);

    await Storage.updateHeaderUrl(avatarUrl_header);

    App.profile.header_url = avatarUrl_header;

    UI.renderPerfile(App.profile);
  } catch (err) {
    console.error(err);
    Toast.show("Error al cambiar header", "error", {
      sound: true,
      haptic: true,
    });
    setTimeout(() => {
      BtnLoaderCambiarFoto.classList.remove("active");
    }, 300);
  }
});

//===========================================================
const actionSheet = document.querySelector(".actionSheet");
const ContentSheet = document.querySelector(".ContentSheet");
const btnOpenSheet = document.querySelector(".btnOpenSheet");
const btnCancelarAccionSheet = document.querySelector(
  ".btnCancelarAccionSheet",
);

function openBtnSheetPerfile() {
  actionSheet.classList.add("active");
  ContentSheet.classList.add("active");

  history.pushState({ btnSheet_editorFotos: true }, "", "#sheetEditor_fotos");
  OverlayManager.push("btneSheet_Editar_perfil", closebtnPerfileEditor);
}

function closebtnPerfileEditor() {
  ContentSheet.classList.remove("active");
  setTimeout(() => {
    actionSheet.classList.remove("active");
  }, 400);
}

btnOpenSheet.addEventListener("click", openBtnSheetPerfile);

btnCancelarAccionSheet.addEventListener("click", () => {
  history.back();
});

const Overview = document.querySelector(".info_tarea");
const btnOpenOverview = document.getElementById("VistaGeneral");
const btnCloseOverview = document.getElementById("Hogar");

btnOpenOverview.addEventListener("click", openOverviewTasks);

function openOverviewTasks() {
  Overview.classList.add("show");
  perfilContainer.classList.remove("show");
  contenAdd.classList.remove("show");
  ScrollBody.disableBodyScroll();

  history.pushState({ vista_general: true }, "", "#vista-general-tareas");
  OverlayManager.push("closeOverview", closeOverview);
}

function closeOverview() {
  Overview.classList.remove("show");
  ScrollBody.enableBodyScroll();
}

btnCloseOverview.addEventListener("click", () => {
  history.back();
});

//Themes
document.addEventListener("DOMContentLoaded", () => {
  const themes = document.querySelector(".content_theme");
  const animation = document.querySelector(".nav_themes");
  const openThemes = document.getElementById("openThemes");
  const closeThemes = document.querySelector(".contenedor");

  openThemes.addEventListener("click", () => {
    themes.classList.add("active");
    animation.classList.add("active");
  });

  setTimeout(() => {
    closeThemes.addEventListener("click", () => {
      themes.classList.remove("active");
    });
  }, 1000);

  closeThemes.addEventListener("click", () => {
    animation.classList.remove("active");
  });
});

window.addEventListener("offline", () => {
  Toast.showInferior(
    "En este momento no tienes conexión a internet",
    "offline",
  );
});

window.addEventListener("online", () => {
  Toast.hideInferior();
  Toast.showInferior("Conexión restablecida", "recoverWifi");
  UI.renderPerfile(this.profile);
});

const btnRender = document.querySelector(".btnCargarPagina");

btnRender.addEventListener("click", () => {
  location.reload();
});

/*Date panel */

function dateNow() {
  const fecha = new Date();

  const dia = fecha.getDate();

  const fechaTexto = fecha.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  document.getElementById("day").textContent = dia;
  document.querySelector(".DATE_HOME").textContent = `de ${fechaTexto}`;
}

dateNow();
