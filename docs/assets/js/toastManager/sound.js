export const Sound = {
  success: null,
  error: null,
  unlocked: false,

  init() {
    this.success = new Audio(
      "assets/js/toastManager/sunsSystem/succes.mp3"
    );
    this.error = new Audio(
      "assets/js/toastManager/sunsSystem/errorMsg.wav"
    );

    this.success.volume = 0.1;
    this.error.volume = 0.1;
  },

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
  },

  play(type = "success") {
    if (!this.unlocked) return;

    const audio = type === "error" ? this.error : this.success;
    if (!audio) return;

    audio.currentTime = 0;
    audio.play().catch(err => {
      console.warn("Audio bloqueado:", err);
    });
  }
};
