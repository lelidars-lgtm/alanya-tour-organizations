/**
 * ALANYA TOUR ORGANIZATIONS — WEB PROTECTION LAYER
 * Version: 2026-08-23-v5
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
  const cssHref = "/assets/protection/ato-web-protection.css?v=20260823";
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
    if (!isEditable(e.target)) e.preventDefault();
  }, { capture: true });

  document.addEventListener("cut", (e) => {
    if (!isEditable(e.target)) e.preventDefault();
  }, { capture: true });

  document.addEventListener("dragstart", (e) => {
    if (e.target?.closest?.("img, picture")) e.preventDefault();
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

  // Very faint viewport watermark. It appears in normal screenshots without
  // changing or recompressing any existing image file.
  const addWatermark = () => {
    if (document.getElementById("ato-screen-watermark")) return;
    const mark = document.createElement("div");
    mark.id = "ato-screen-watermark";
    mark.setAttribute("aria-hidden", "true");
    document.body.appendChild(mark);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addWatermark, { once: true });
  } else {
    addWatermark();
  }
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
