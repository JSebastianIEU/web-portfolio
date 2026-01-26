/**
 * Returns cursor style object that only applies cursor:none on desktop devices with mouse.
 * On mobile/tablet, returns empty object to allow native touch interaction.
 */
export function getCursorStyle(): React.CSSProperties {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return {};
  }

  // Check if device has fine pointer (mouse) - desktop
  const hasFineMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  
  return hasFineMouse ? { cursor: "none" } : {};
}

/**
 * Returns combined cursor style with additional styles.
 * Cursor:none is only applied on desktop.
 */
export function getCursorStyleWith(additionalStyles: React.CSSProperties): React.CSSProperties {
  return {
    ...getCursorStyle(),
    ...additionalStyles,
  };
}
