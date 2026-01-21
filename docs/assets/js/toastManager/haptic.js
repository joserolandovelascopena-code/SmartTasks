export const Haptic = {
  enabled: true,

  vibrate(type = "success") {
    if (!this.enabled) return;
    if (!("vibrate" in navigator)) return;

    switch (type) {
      case "error":
        navigator.vibrate([30, 40, 30]);
        break;

      case "warning":
        navigator.vibrate([20, 30, 20]);
        break;

      case "success":
      default:
        navigator.vibrate(20);
        break;
    }
  },

  vibrateUi(type = "success") {
    if (!this.enabled) return;
    if (!("vibrate" in navigator)) return;

    switch (type) {
      case "success":
        navigator.vibrate([40, 50]);
        break;

      case "tap":
        navigator.vibrate(15);
        break;
    }
  },
};
