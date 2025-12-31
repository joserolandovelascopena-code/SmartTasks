export const Sound = {
  success: null,
  error: null,

  init() {
    this.success = new Audio("/toastManager/sunsSystem/succes.mp3");
    this.error   = new Audio("/toastManager/sunsSystem/errorMsg.wav");
  },

  play(type = "success") {
    const audio = type === "error" ? this.error : this.success;
    if (!audio) return;

    audio.volume = 0.2;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
};
