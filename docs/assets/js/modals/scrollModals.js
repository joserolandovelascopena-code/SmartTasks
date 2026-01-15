//scroll main
const bodyScroll = document.body;

function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function disableBodyScroll() {
  if (!isMobile()) return;
  bodyScroll.style.overflow = "hidden";
}

function enableBodyScroll() {
  if (!isMobile()) return;
  bodyScroll.style.overflow = "auto";
}

export const ScrollBody = {
  disableBodyScroll,
  enableBodyScroll,
};
