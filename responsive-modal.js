"use strict";

/* =========================================================
   GOOKIE — VISIBLE VIEWPORT HEIGHT HELPER

   Android/iOS browser toolbars can change the visible height while scrolling.
   This updates --gookie-vh without touching existing modal functions.
========================================================= */

(() => {
  const root = document.documentElement;

  function updateVisibleViewportHeight() {
    const height =
      window.visualViewport?.height ||
      window.innerHeight ||
      document.documentElement.clientHeight;

    if (Number.isFinite(height) && height > 0) {
      root.style.setProperty("--gookie-vh", `${Math.round(height)}px`);
    }
  }

  updateVisibleViewportHeight();

  window.addEventListener("resize", updateVisibleViewportHeight, {
    passive: true,
  });

  window.addEventListener("orientationchange", () => {
    window.setTimeout(updateVisibleViewportHeight, 80);
    window.setTimeout(updateVisibleViewportHeight, 320);
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener(
      "resize",
      updateVisibleViewportHeight,
      { passive: true }
    );
  }
})();
