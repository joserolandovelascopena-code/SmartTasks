//overlayManager.js
const overlayStack = [];

function push(type, onClose) {
  overlayStack.push({ type, onClose });
}

function pop() {
  const last = overlayStack.pop();
  if (last?.onClose) last.onClose();
}

function handlePopState() {
  if (overlayStack.length === 0) return;
  pop();
}

window.addEventListener("popstate", handlePopState);

export const OverlayManager = {
  push,
  pop,
  hasOpen() {
    return overlayStack.length > 0;
  },
};
