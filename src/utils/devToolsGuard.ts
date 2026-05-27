const GUARD_ENABLED =
  process.env.NODE_ENV === "production" ||
  process.env.REACT_APP_DEVTOOLS_GUARD === "true";

const DEVTOOLS_SIZE_GAP = 160;

function isBlockedShortcut(event: KeyboardEvent): boolean {
  const key = event.key?.toLowerCase();
  if (key === "f12") return true;

  if (event.ctrlKey && event.shiftKey && ["i", "j", "c", "k"].includes(key)) {
    return true;
  }
  if (event.metaKey && event.altKey && ["i", "j", "c"].includes(key)) {
    return true;
  }
  if (event.ctrlKey && key === "u") return true;
  if (event.metaKey && event.altKey && key === "u") return true;

  return false;
}

export function isDevToolsGuardEnabled(): boolean {
  return GUARD_ENABLED;
}

export function installDevToolsGuard(onDetected: () => void): () => void {
  if (!GUARD_ENABLED) return () => undefined;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isBlockedShortcut(event)) {
      event.preventDefault();
      event.stopPropagation();
      onDetected();
    }
  };

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  const detectDockedDevTools = () => {
    const widthGap = window.outerWidth - window.innerWidth;
    const heightGap = window.outerHeight - window.innerHeight;
    if (widthGap > DEVTOOLS_SIZE_GAP || heightGap > DEVTOOLS_SIZE_GAP) {
      onDetected();
    }
  };

  const detectDebuggerPause = () => {
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    if (performance.now() - start > 120) {
      onDetected();
    }
  };

  document.addEventListener("keydown", handleKeyDown, true);
  document.addEventListener("contextmenu", handleContextMenu);
  window.addEventListener("resize", detectDockedDevTools);

  const intervalId = window.setInterval(() => {
    detectDockedDevTools();
    detectDebuggerPause();
  }, 1500);

  return () => {
    document.removeEventListener("keydown", handleKeyDown, true);
    document.removeEventListener("contextmenu", handleContextMenu);
    window.removeEventListener("resize", detectDockedDevTools);
    window.clearInterval(intervalId);
  };
}
