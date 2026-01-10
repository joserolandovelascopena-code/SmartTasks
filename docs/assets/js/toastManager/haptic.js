export const Haptic = {
  enabled: true,

  vibrate(type = "success") {
    if (!this.enabled) return;
    if (!("vibrate" in navigator)) return;

    if (type === "error") {
      navigator.vibrate([30, 40, 30]);
    } else {
      navigator.vibrate(20);
    }
  },
};
