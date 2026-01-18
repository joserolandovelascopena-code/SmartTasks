import { App } from "../app.js";
import { Storage } from "../storage.js";
import { UI } from "../ui.js";
import { Toast } from "../toastManager/toast.js";
import { OverlayManager } from "../overlayManager/overlayManager.js";
import { ScrollBody } from "./scrollModals.js";

document.addEventListener("DOMContentLoaded", () => {
  const openAdd = document.querySelectorAll(".openAdd");
  const contenAdd = document.querySelector(".subir_tarea");

  const perfilContainer = document.querySelector(".Perfile");
  const bodycontenedor = document.querySelector(".contenedor");

  const closeAddTaks = document.getElementById("CloseAddTasks");
  const backgraudAnimation = document.querySelector(".backgraud-tasks");
  const listCheck = document.querySelector(".List_check");
  const infoTarea = document.querySelector(".info_tarea");

  function openAddTask() {
    perfilContainer.classList.remove("show");

    ScrollBody.disableBodyScroll(); // SOLO móvil

    contenAdd.classList.add("show");
    backgraudAnimation.classList.add("show");
    bodycontenedor.classList.add("show");
    listCheck.classList.add("show");
    infoTarea.classList.add("show");

    history.pushState({ addTask: true }, "", "#add-task");
    OverlayManager.push("closeAddTasks", closeAddTask);
  }

  function closeAddTask() {
    // SOLO móvil
    ScrollBody.enableBodyScroll();
    contenAdd.classList.remove("show");
    backgraudAnimation.classList.remove("show");
    bodycontenedor.classList.remove("show");
    listCheck.classList.remove("show");
    infoTarea.classList.remove("show");
  }

  openAdd.forEach((op) => {
    op.addEventListener("click", openAddTask);
  });

  closeAddTaks.addEventListener("click", () => {
    history.back();
  });
});

document.addEventListener("change", (e) => {
  if (e.target.classList.contains("check")) {
    const id = Number(e.target.dataset.id);
    App.toggleTask(id);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const repeticion_tasks = document.querySelector(".repeticion_tasks");
  const openRepeticion = document.getElementById("openOpiciones");

  openRepeticion.addEventListener("click", () => {
    repeticion_tasks.classList.toggle("show");
  });
});

//perfil
const openPerfile = document.querySelectorAll(".openPerfil");
const closePerfil = document.getElementById("Hogar");
const closePerfilFlecha = document.querySelector(".salirPerfil");

const perfilContainer = document.querySelector(".Perfile");
const cantidadTkasPerfile = document.querySelector(".cantidadTasksPerfile");
const contenAdd = document.querySelector(".subir_tarea");

function openPerfil() {
  perfilContainer.classList.add("show");
  contenAdd.classList.remove("show");
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

closePerfilFlecha.addEventListener("click", () => {
  history.back();
});

//============================================

const modalOpcionesClickFoto = document.querySelector(
  ".modalOpcionesClickImagePerfil"
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
  ".openVisualizarFotoUser"
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

function openEditorFotos() {
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

openEditarFotos.forEach((op) => {
  op.addEventListener("click", openEditorFotos);
});

btnCerrarEditor.addEventListener("click", (e) => {
  e.stopPropagation();
  e.preventDefault();

  history.back();
});

inputFotoPerfil.addEventListener("click", () => {
  VisualizarFotoBorder.classList.remove("show");
  btnAceptarCambiosFoto.classList.remove("active");
});

inputFotoHeader.addEventListener("click", () => {
  previewHeader.classList.add("show");
  trasitionPreviewHeader.classList.add("show");
});

btnCancelarHeder.addEventListener("click", () => {
  trasitionPreviewHeader.classList.remove("show");

  setTimeout(() => {
    previewHeader.classList.remove("show");
  }, 200);
});

let selectedAvatarFile = null;
let selectedHeaderFile = null;

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

  selectedAvatarFile = file;

  const reader = new FileReader();
  reader.onload = () => {
    previewImg.src = reader.result;
  };

  reader.readAsDataURL(file);

  VisualizarFotoBorder.classList.add("show");
  btnAceptarCambiosFoto.classList.add("active");
});

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
  ".btnCancelarAccionSheet"
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
    "offline"
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
