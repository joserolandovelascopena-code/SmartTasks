//warningMessagesjs
import { Sound } from "../../toastManager/sound.js";
import { Haptic } from "../../toastManager/haptic.js";
import { Toast } from "../../toastManager/toast.js";

const el = document.querySelector(".WarningMessagesSystem");
const cont = document.querySelector(".contenidoMensaje");
const ti = document.querySelector(".title_message_advertencia");
const textInfo = document.querySelector(".info_mensage");
const icon = document.querySelector(".iconoWarning");

export const WarnningMessage = {
  mensagePush(title, msg, type = "warning", options = {}) {
    if (!el) return;

    const { sound = false, haptic = false } = options;

    ti.textContent = title;
    textInfo.textContent = msg;
    icon.className =
      type === "warning"
        ? "fa-regular fa-trash-can"
        : "fa-solid fa-triangle-exclamation";

    if (sound) Sound.play(type);
    if (haptic) Haptic.vibrate(type);

    el.classList.add("active");
    cont.classList.add("show");
  },
};

const MESSAGE_MAP = {
  eliminar_foto_perfil: {
    title: "¿Eliminar foto de perfil?",
    msg: "Tu foto actual será borrada y volverás al avatar por defecto.",
    type: "warning",
    action: "DELETE_AVATAR",
  },
  eliminar_foto_header: {
    title: "¿Eliminar header?",
    msg: "El header actual será borrado y volverás al fondo por defecto.",
    type: "warning",
    action: "DELETE_HEADER",
  },
};

document.addEventListener("click", (e) => {
  const option = e.target.closest(".optEjecucion");
  if (!option) return;

  const key = option.dataset.callwindow;
  const config = MESSAGE_MAP[key];

  if (!config) {
    Toast.show("Esta opción aún no tiene acción asignada");
    return;
  }

  WarnningMessage.mensagePush(config.title, config.msg, config.type, {
    sound: true,
    haptic: true,
  });

  el.dataset.pendingAction = config.action;
});

const btnAceptar = document.querySelector(".eliminarObleto");

btnAceptar?.addEventListener("click", () => {
  const action = el.dataset.pendingAction;
  if (!action) return;

  document.dispatchEvent(
    new CustomEvent("warning:confirm", {
      detail: { action },
    })
  );

  closeWarning();
  delete el.dataset.pendingAction;
});

function closeWarning() {
  el.classList.remove("active");
  cont.classList.remove("show");
}

const btnCancelar = document.querySelector(".cerrarMensageSystem");

btnCancelar?.addEventListener("click", () => {
  cont.classList.remove("show");
  setTimeout(() => {
    el.classList.remove("active");
  }, 300);
});
