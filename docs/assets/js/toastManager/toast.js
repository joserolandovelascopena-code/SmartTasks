import { Sound } from "./sound.js";
import { Haptic } from "./haptic.js";

export const Toast = {
  el: null,
  text: null,
  icon: null,
  elSeond: null,
  iconSecond: null,
  textSecond: null,
  timer: null,

  init() {
    this.el = document.querySelector(".contentMsg");
    this.text = document.getElementById("msgSystem");
    this.icon = document.querySelector(".iconoSucces");
    this.elSeond = document.querySelector(".contentMsgInferior");
    this.textSecond = document.getElementById("msgSystemSecond");
    this.iconSecond = document.querySelector(".iconoSuccesInferior");
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

  showInferior(msg, type = "success", options = {}) {
    if (!this.elSeond) return;

    const { sound = false, haptic = false } = options;
    const time = type === "deleElement" ? 10000 : 400;

    this.textSecond.textContent = msg;

    if (type === "error") {
      this.iconSecond.className = "fa fa-xmark";
    } else if (type === "deleElement") {
      this.iconSecond.className = "far fa-trash-can";
    } else {
      this.iconSecond.className = "fa fa-check";
    }

    if (sound) Sound.play(type);
    if (haptic) Haptic.vibrate(type);

    clearTimeout(this.timer);
    this.elSeond.classList.add("show");

    this.timer = setTimeout(() => {
      this.elSeond.classList.remove("show");
    }, time);
  },
};
