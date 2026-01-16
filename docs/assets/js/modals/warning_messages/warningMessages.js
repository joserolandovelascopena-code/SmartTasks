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
  mensagePush(title, msg, type = "delete", options = {}) {
    if (!el) return;

    const { sound = false, haptic = false } = options;

    ti.textContent = title;
    textInfo.textContent = msg;
    icon.className =
      type === "delete"
        ? "fa-regular fa-trash-can"
        : "fa-solid fa-triangle-exclamation";

    if (sound) {
      Sound.play(type);
    }

    if (haptic) {
      Haptic.vibrate(type);
    }

    el.classList.add("active");
    cont.classList.add("show");
  },
};

document.addEventListener("click", (e) => {
  const option = e.target.closest(".optEjecucion");
  if (!option) return;

  const selected = option.dataset.callwindow;
  windowEjecute(selected);
});

function windowEjecute(option) {
  if (!option) {
    Toast.show("Esta opción aún no tiene acción asignada");
    return;
  }

  switch (option) {
    case "eliminar_foto_perfil":
      WarnningMessage.mensagePush(
        "¿Eliminar foto de perfil?",
        "Tu foto actual será borrada y volverás al avatar por defecto.",
        "delete",
        { sound: true, haptic: true }
      );
      break;

    case "eliminar_foto_header":
      WarnningMessage.mensagePush(
        "¿Eliminar header?",
        "El header actual será borrado y volverás al fondo por defecto.",
        "delete",
        { sound: true, haptic: true }
      );
      break;

    default:
      Toast.show("Acción no reconocida");
  }
}

const btnCancelar = document.querySelector(".cerrarMensageSystem");

btnCancelar?.addEventListener("click", () => {
  el.classList.remove("active");
  cont.classList.remove("show");
});
