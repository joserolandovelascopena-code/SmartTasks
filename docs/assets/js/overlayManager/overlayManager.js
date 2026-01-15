//overlayManager.js
const overlayStack = [];

function push(type, onClose) {
  overlayStack.push({ type, onClose });
}

function pop() {
  if (overlayStack.length === 0) return;
  const last = overlayStack.pop();
  last?.onClose?.();
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
