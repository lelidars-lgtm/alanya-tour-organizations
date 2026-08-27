/**
 * ALANYA TOUR ORGANIZATIONS — CENTRAL PUBLIC SITE LOCK
 * One synchronous file for every public HTML page.
 * Version: 2026-08-24-direct-v1
 */
(() => {
  "use strict";

  if (window.__ATO_SITE_LOCK_ACTIVE__) return;
  window.__ATO_SITE_LOCK_ACTIVE__ = true;

  const style = document.createElement("style");
  style.id = "ato-site-lock-style";
  style.textContent = `
    html, body, body *, body *::before, body *::after {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
    }
    html img, html picture, html video, html canvas, html svg, html source {
      -webkit-user-drag: none !important;
      user-drag: none !important;
    }
    html input, html textarea, html select, html option,
    html [contenteditable="true"], html .ato-allow-select,
    html .ato-allow-select * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
      -webkit-touch-callout: default !important;
    }
    html body *::selection { background: transparent !important; color: inherit !important; }
    html body *::-moz-selection { background: transparent !important; color: inherit !important; }
    @media print {
      html body { visibility: hidden !important; }
      html body::before {
        content: "ALANYA TOUR ORGANIZATIONS — PRINTING DISABLED";
        visibility: visible !important;
        display: block !important;
        position: fixed !important;
        inset: 0 !important;
        padding: 48px 24px !important;
        background: #fff !important;
        color: #111 !important;
        font: 700 18px/1.5 Arial, sans-serif !important;
        text-align: center !important;
        z-index: 2147483647 !important;
      }
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  const editable = (target) => {
    const element = target && target.nodeType === 1 ? target : target?.parentElement;
    return Boolean(element?.closest?.(
      'input,textarea,select,option,[contenteditable="true"],.ato-allow-select'
    ));
  };

  const stop = (event) => {
    if (editable(event.target)) return;
    event.preventDefault();
    try { event.stopImmediatePropagation(); } catch (_) {}
    try { event.stopPropagation(); } catch (_) {}
    try { event.clipboardData?.setData("text/plain", ""); } catch (_) {}
    try { event.clipboardData?.setData("text/html", ""); } catch (_) {}
  };

  ["copy", "cut", "contextmenu", "selectstart", "dragstart", "beforecopy"]
    .forEach((type) => {
      document.addEventListener(type, stop, { capture: true, passive: false });
      window.addEventListener(type, stop, { capture: true, passive: false });
    });

  document.addEventListener("keydown", (event) => {
    if (editable(event.target)) return;
    const key = String(event.key || "").toLowerCase();
    const modifier = event.ctrlKey || event.metaKey;
    const blockedShortcut = modifier && ["a", "c", "x", "s", "p", "u"].includes(key);
    const blockedTools = key === "f12" ||
      (modifier && event.shiftKey && ["i", "j", "c"].includes(key));
    if (blockedShortcut || blockedTools) stop(event);
  }, { capture: true, passive: false });

  document.addEventListener("selectionchange", () => {
    if (editable(document.activeElement)) return;
    const selection = window.getSelection?.();
    if (selection && !selection.isCollapsed) {
      try { selection.removeAllRanges(); } catch (_) {}
    }
  }, true);

  const protectMedia = (root = document) => {
    root.querySelectorAll?.("img,picture,video,canvas,svg,source").forEach((element) => {
      try { element.setAttribute("draggable", "false"); } catch (_) {}
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => protectMedia(), { once: true });
  } else {
    protectMedia();
  }

  /* Public mobile navigation bootstrap.
     Every public page already loads this central file. Load the canonical
     header once on phones/tablets when that page has no global header yet.
     Desktop and internal manager/e-ticket pages remain unchanged. */
  const loadPublicMobileHeader = () => {
    const ua = navigator.userAgent || "";
    const mobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) ||
      (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    if (!mobileDevice || document.getElementById("atoGlobalHeaderRoot")) return;
    if (document.querySelector('script[src*="ato-global-header.js"]')) return;
    const path = (location.pathname || "/").toLowerCase();
    if (/(^|\/)(booking-manager|ato-manager|manager|admin)(\/|$)/.test(path)) return;
    if (/(e-ticket|virtual[-_]?pos|secure[-_]?payment|card[-_]?payment)/.test(path)) return;
    const headerScript = document.createElement("script");
    headerScript.src = "/assets/js/ato-global-header.js?v=20260827-public-mobile-nav-v2";
    headerScript.dataset.atoMobileNavigation = "central";
    document.head.appendChild(headerScript);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPublicMobileHeader, { once: true });
  } else {
    loadPublicMobileHeader();
  }

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes || []) {
        if (node.nodeType !== 1) continue;
        if (node.matches?.("img,picture,video,canvas,svg,source")) {
          try { node.setAttribute("draggable", "false"); } catch (_) {}
        }
        protectMedia(node);
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
