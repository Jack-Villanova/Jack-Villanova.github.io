const cursor = document.getElementById("cursor");
const screen = document.getElementById("screen");

// Change these paths to swap the icon used by each custom cursor state.
const cursorStates = {
  default: {
    icon: "svg/cursor-minimal.svg",
    size: 28,
    hotspot: { x: 0, y: 0 }
  },
  pointer: {
    icon: "svg/pointer.svg",
    size: 28,
    hotspot: { x: 0, y: 0 }
  },
  grab: {
    icon: "svg/hand.svg",
    size: 28,
    hotspot: { x: 8, y: 8 }
  },
  grabbing: {
    icon: "svg/hand-grab.svg",
    size: 28,
    hotspot: { x: 8, y: 8 }
  },
  click: {
    icon: "svg/cursor-click.svg",
    size: 28,
    hotspot: { x: 8, y: 4 }
  },
};

let activeCursorState = "";
let isPointerDown = false;
let clickStateUntil = 0;
let lastCursorPosition = { x: -100, y: -100 };

const interactiveSelector = [
  "a",
  "button",
  "[role='button']",
  "[data-cursor='pointer']",
  ".box"
].join(",");

const grabSelector = [
  ".card",
  ".card-stack",
  "[data-cursor='grab']"
].join(",");

const textSelector = [
  "input",
  "textarea",
  "[contenteditable='true']",
  "[data-cursor='text']"
].join(",");

function getCursorState(target) {
  if (performance.now() < clickStateUntil) return "click";
  if (isPointerDown && target?.closest(grabSelector)) return "grabbing";
  if (isPointerDown) return "click";
  if (target?.closest(textSelector)) return "text";
  if (target?.closest(grabSelector)) return "grab";
  if (target?.closest(interactiveSelector)) return "pointer";
  return "default";
}

// Preload every cursor icon. If one fails to load (404, bad path, etc.)
// we fall back to the default icon so the cursor never disappears.
Object.entries(cursorStates).forEach(([name, config]) => {
  const probe = new Image();
  probe.onerror = () => {
    console.warn(`[cursor] "${name}" icon failed to load: ${config.icon}. Falling back to default.`);
    config.icon = cursorStates.default.icon;
    config.size = cursorStates.default.size;
    config.hotspot = cursorStates.default.hotspot;
    if (activeCursorState === name) applyCursorState(name);
  };
  probe.src = config.icon;
});

function applyCursorState(state) {
  const config = cursorStates[state] || cursorStates.default;
  activeCursorState = state;
  cursor.style.setProperty("--cursor-icon", `url("${config.icon}")`);
  cursor.style.setProperty("--cursor-size", `${config.size}px`);
}

function moveCursor(x, y) {
  lastCursorPosition = { x, y };
  const config = cursorStates[activeCursorState] || cursorStates.default;
  cursor.style.transform = `translate(${x - config.hotspot.x}px, ${y - config.hotspot.y}px)`;
}

function updateCursor(e) {
  const target = document.elementFromPoint(e.clientX, e.clientY);
  const state = getCursorState(target);

  if (state !== activeCursorState) {
    applyCursorState(state);
  }

  moveCursor(e.clientX, e.clientY);
}

applyCursorState("default");

// Scale percent variable to control particle size
const scalePercent = 1; // change to 0.5, 1.5, etc.

document.addEventListener("pointermove", updateCursor);

document.addEventListener("pointerdown", e => {
  isPointerDown = true;
  updateCursor(e);
});

document.addEventListener("pointerup", e => {
  isPointerDown = false;
  clickStateUntil = performance.now() + 120;
  updateCursor(e);

  window.setTimeout(() => {
    const target = document.elementFromPoint(lastCursorPosition.x, lastCursorPosition.y);
    const state = getCursorState(target);
    applyCursorState(state);
    moveCursor(lastCursorPosition.x, lastCursorPosition.y);
  }, 120);
});

document.addEventListener("pointercancel", e => {
  isPointerDown = false;
  updateCursor(e);
});
