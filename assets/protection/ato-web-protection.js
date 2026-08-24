/**
 * ALANYA TOUR ORGANIZATIONS — WEB PROTECTION LAYER
 * Version: 2026-08-24-v8-fixed
 * Add-only module: existing page code is not replaced.
 */
(() => {
  "use strict";

  const PATH = location.pathname.toLowerCase();
  const LIMITED =
    PATH.includes("/booking-manager/") ||
    PATH.endsWith("/e-ticket.html") ||
    PATH === "/e-ticket.html" ||
    PATH.includes("/admin/");

  const sameOriginFrame = () => {
    if (window.top === window.self) return true;
    try {
      return window.top.location.origin === window.self.location.origin;
    } catch (_) {
      return false;
    }
  };

  // Frame-busting fallback. The primary control is CSP frame-ancestors + X-Frame-Options.
  if (!sameOriginFrame()) {
    try {
      document.documentElement.innerHTML = "";
    } catch (_) {}
    return;
  }

  // Load the separate stylesheet. No CSS needs to be inserted into existing pages.
  const cssHref = "/assets/protection/ato-web-protection.css?v=20260824v8fixed";
  if (!document.querySelector('link[data-ato-protection-css]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssHref;
    link.dataset.atoProtectionCss = "1";
    document.head.appendChild(link);
  }

  // Booking Manager / e-ticket must stay operational and printable.
  if (LIMITED) {
    document.documentElement.classList.add("ato-protected-limited");
    return;
  }

  document.documentElement.classList.add("ato-protected-public");

  // =====================================================================
  // ATO V8 — TOTAL PUBLIC LOCK
  // Runs on every protected public page and catches dynamically added text.
  // =====================================================================

  const atoIsEditable = (target) => {
    const el = target && target.nodeType === 1 ? target : target?.parentElement;
    if (!el) return false;
    return !!el.closest(
      'input, textarea, select, option, [contenteditable="true"], .ato-allow-select'
    );
  };

  const atoStop = (event) => {
    if (atoIsEditable(event.target)) return;
    event.preventDefault();
    try { event.stopImmediatePropagation(); } catch (_) {}
    try { event.stopPropagation(); } catch (_) {}
  };

  // Browser UI copy/select/save/print/context actions.
  [
    "copy",
    "cut",
    "contextmenu",
    "selectstart",
    "dragstart",
    "beforecopy"
  ].forEach((type) => {
    document.addEventListener(type, atoStop, {
      capture: true,
      passive: false
    });
    window.addEventListener(type, atoStop, {
      capture: true,
      passive: false
    });
  });

  // Collapse any unexpected selection immediately.
  document.addEventListener("selectionchange", () => {
    const active = document.activeElement;
    if (atoIsEditable(active)) return;
    const sel = window.getSelection?.();
    if (sel && !sel.isCollapsed) {
      try { sel.removeAllRanges(); } catch (_) {}
    }
  }, true);

  // Disable common browser keyboard copy/export/view-source/devtools shortcuts
  // on PUBLIC pages only. This is deterrence, not a cryptographic boundary.
  document.addEventListener("keydown", (event) => {
    if (atoIsEditable(event.target)) return;

    const key = String(event.key || "").toLowerCase();
    const mod = event.ctrlKey || event.metaKey;

    const blockedModKeys = new Set([
      "a", "c", "x", "s", "p", "u"
    ]);

    const blockedDevTools =
      key === "f12" ||
      (mod && event.shiftKey && ["i", "j", "c"].includes(key));

    if ((mod && blockedModKeys.has(key)) || blockedDevTools) {
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
    }
  }, { capture: true, passive: false });

  // Make all current/future media non-draggable at DOM level.
  const atoHardenMedia = (root = document) => {
    root.querySelectorAll?.("img, picture, video, canvas, svg, source").forEach((el) => {
      try { el.setAttribute("draggable", "false"); } catch (_) {}
      try { el.addEventListener("dragstart", atoStop, { capture: true, passive: false }); } catch (_) {}
    });
  };

  atoHardenMedia();

  const atoObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes || []) {
        if (node.nodeType !== 1) continue;
        if (node.matches?.("img, picture, video, canvas, svg, source")) {
          try { node.setAttribute("draggable", "false"); } catch (_) {}
        }
        atoHardenMedia(node);
      }
    }
  });

  atoObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // Clear selection after pointer/touch release as an extra mobile/desktop guard.
  ["mouseup", "touchend", "pointerup"].forEach((type) => {
    document.addEventListener(type, (event) => {
      if (atoIsEditable(event.target)) return;
      const sel = window.getSelection?.();
      if (sel && !sel.isCollapsed) {
        try { sel.removeAllRanges(); } catch (_) {}
      }
    }, { capture: true, passive: true });
  });



  // V6 CRITICAL COPY LOCK: inline fallback so copy protection does not depend
  // on the external stylesheet winning the cascade.
  if (!document.getElementById("ato-copy-lock-critical")) {
    const critical = document.createElement("style");
    critical.id = "ato-copy-lock-critical";
    critical.textContent = `
      html.ato-protected-public,html.ato-protected-public body,
      html.ato-protected-public body *{
        -webkit-user-select:none!important;
        -moz-user-select:none!important;
        user-select:none!important;
        -webkit-touch-callout:none!important
      }
      html.ato-protected-public input,
      html.ato-protected-public textarea,
      html.ato-protected-public select,
      html.ato-protected-public [contenteditable="true"],
      html.ato-protected-public .ato-allow-select,
      html.ato-protected-public .ato-allow-select *{
        -webkit-user-select:text!important;
        -moz-user-select:text!important;
        user-select:text!important;
        -webkit-touch-callout:default!important
      }`;
    document.head.appendChild(critical);
  }


  const isEditable = (node) => {
    if (!node || node.nodeType !== 1) return false;
    return !!node.closest(
      'input, textarea, select, [contenteditable="true"], .ato-allow-select'
    );
  };

  const protectImage = (img) => {
    if (!img || img.nodeType !== 1) return;
    img.setAttribute("draggable", "false");
    img.addEventListener("dragstart", (e) => e.preventDefault(), { passive: false });
  };

  const protectImages = (root = document) => {
    root.querySelectorAll?.("img").forEach(protectImage);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => protectImages());
  } else {
    protectImages();
  }

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches?.("img")) protectImage(node);
        protectImages(node);
      }
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener("contextmenu", (e) => {
    if (!isEditable(e.target)) e.preventDefault();
  }, { capture: true });

  document.addEventListener("copy", (e) => {
    if (isEditable(e.target)) return;
    e.preventDefault();
    try { e.stopImmediatePropagation(); } catch (_) {}
    try { e.clipboardData?.setData("text/plain", ""); } catch (_) {}
    try { e.clipboardData?.setData("text/html", ""); } catch (_) {}
  }, { capture: true });

  document.addEventListener("cut", (e) => {
    if (isEditable(e.target)) return;
    e.preventDefault();
    try { e.stopImmediatePropagation(); } catch (_) {}
    try { e.clipboardData?.setData("text/plain", ""); } catch (_) {}
  }, { capture: true });

  document.addEventListener("dragstart", (e) => {
    if (e.target?.closest?.("img, picture")) e.preventDefault();
  }, { capture: true });


  // V6: stop text selection before the browser can expose Copy.
  document.addEventListener("selectstart", (e) => {
    if (!isEditable(e.target)) e.preventDefault();
  }, { capture: true, passive: false });

  // beforecopy is supported by some Chromium/WebKit builds.
  document.addEventListener("beforecopy", (e) => {
    if (!isEditable(e.target)) e.preventDefault();
  }, { capture: true });

  // If a browser/site script still creates a selection, collapse it immediately.
  document.addEventListener("selectionchange", () => {
    const active = document.activeElement;
    if (isEditable(active)) return;
    const sel = window.getSelection?.();
    if (sel && !sel.isCollapsed) {
      try { sel.removeAllRanges(); } catch (_) {}
    }
  }, { capture: true });

  // Block Select All / Copy / Cut / Save / Print on public pages.
  document.addEventListener("keydown", (e) => {
    if (isEditable(e.target)) return;
    const mod = e.ctrlKey || e.metaKey;
    const key = String(e.key || "").toLowerCase();
    if (mod && ["a", "c", "x", "s", "p"].includes(key)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, { capture: true });


  document.addEventListener("keydown", (e) => {
    if (isEditable(e.target)) return;
    const mod = e.ctrlKey || e.metaKey;
    const key = String(e.key || "").toLowerCase();

    if (mod && ["c", "s", "p"].includes(key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { capture: true });
})();
/* AUTO-FUTURE MEDIA GUARD
   Applies to future images and download links added after this module was installed. */
(() => {
  const imageExt = /\.(?:jpe?g|png|webp|avif|gif)(?:[?#].*)?$/i;

  document.addEventListener("click", (e) => {
    const a = e.target?.closest?.("a[download], a[href]");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (a.hasAttribute("download") && imageExt.test(href)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { capture: true });
})();
/* ATO MEDIA PROTECTION V5 --------------------------------------------------
   Live pages keep the ultra-faint full-screen forensic overlay for screenshots.
   Download links for public photos are rerouted to the separately generated
   full-image watermarked copy under /_ato-download/.
   Direct extraction of a browser-delivered preview cannot be made impossible;
   originals are therefore excluded from the deployment output for future media. */
(() => {
  const PHOTO_RE = /\.(?:jpe?g|png|webp|avif)(?:[?#].*)?$/i;
  const isProtectedPath = (u) => u.pathname.startsWith("/_ato-download/");
  const toDownloadUrl = (href) => {
    try {
      const u = new URL(href, location.href);
      if (u.origin !== location.origin || !PHOTO_RE.test(u.pathname) || isProtectedPath(u)) return null;
      return "/_ato-download" + u.pathname;
    } catch (_) { return null; }
  };

  document.addEventListener("click", (e) => {
    const a = e.target?.closest?.("a[href]");
    if (!a) return;
    const force = a.hasAttribute("download") || a.dataset.atoDownload === "protected";
    if (!force) return;
    const target = toDownloadUrl(a.href);
    if (!target) return;
    e.preventDefault(); e.stopPropagation();
    // Navigate directly to the protected asset. Vercel serves /_ato-download/*
    // with Content-Disposition: attachment, avoiding interference from older
    // client-side download blockers.
    window.location.assign(target);
  }, {capture:true});

  window.ATOProtectedDownload = (imageUrl) => {
    const target = toDownloadUrl(imageUrl);
    if (!target) return false;
    window.location.assign(target); return true;
  };
})();
