import { Sound } from "./sound.js";
import { Haptic } from "./haptic.js";

export const Toast = {
  el: null,
  text: null,
  icon: null,
  timer: null,

  init() {
    this.el = document.querySelector(".contentMsg");
    this.text = document.getElementById("msgSystem");
    this.icon = document.querySelector(".iconoSucces");
  },

  show(msg, type = "success", options = {}) {
    if (!this.el) return;

    const { sound = false, haptic = false, time = 4000 } = options;

    this.text.textContent = msg;
    this.icon.className = type === "error" ? "fa fa-xmark" : "fa fa-check";

    if (sound) {
      Sound.play(type);
    }

    if (haptic) {
      Haptic.vibrate(type);
    }

    clearTimeout(this.timer);
    this.el.classList.add("show");

    this.timer = setTimeout(() => {
      this.el.classList.remove("show");
    }, time);
  },
};
