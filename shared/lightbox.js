/**
 * Screenshot lightbox. Thumbs are <a class="lb-shot" href="full.png">.
 * Without JS the link opens the image in a new tab.
 */
(function () {
  "use strict";

  var items = [];
  var index = 0;
  var overlay;
  var imgEl;
  var lastFocus = null;

  function collect() {
    items = Array.prototype.slice.call(document.querySelectorAll("a.lb-shot"));
  }

  function ensure() {
    if (overlay) {
      return;
    }
    overlay = document.createElement("div");
    overlay.className = "lb-overlay";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Screenshot");
    overlay.innerHTML =
      '<button type="button" class="lb-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lb-prev" aria-label="Previous">&#8249;</button>' +
      '<img class="lb-full" alt="" />' +
      '<button type="button" class="lb-next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(overlay);
    imgEl = overlay.querySelector(".lb-full");

    overlay.querySelector(".lb-close").addEventListener("click", close);
    overlay.querySelector(".lb-prev").addEventListener("click", function (e) {
      e.stopPropagation();
      show(index - 1);
    });
    overlay.querySelector(".lb-next").addEventListener("click", function (e) {
      e.stopPropagation();
      show(index + 1);
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        close();
      }
    });
    imgEl.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  function show(i) {
    if (!items.length) {
      return;
    }
    index = (i + items.length) % items.length;
    var a = items[index];
    var thumb = a.querySelector("img");
    imgEl.src = a.getAttribute("href");
    imgEl.alt = thumb ? thumb.alt : "";
    overlay.classList.toggle("lb-single", items.length < 2);
    overlay.hidden = false;
    document.body.classList.add("lb-open");
    overlay.querySelector(".lb-close").focus();
  }

  function openAt(i) {
    ensure();
    lastFocus = document.activeElement;
    show(i);
  }

  function close() {
    if (!overlay || overlay.hidden) {
      return;
    }
    overlay.hidden = true;
    imgEl.removeAttribute("src");
    document.body.classList.remove("lb-open");
    if (lastFocus && lastFocus.focus) {
      lastFocus.focus();
    }
  }

  function onKey(e) {
    if (!overlay || overlay.hidden) {
      return;
    }
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowLeft") {
      show(index - 1);
    } else if (e.key === "ArrowRight") {
      show(index + 1);
    }
  }

  function init() {
    collect();
    if (!items.length) {
      return;
    }
    items.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) {
          return;
        }
        e.preventDefault();
        openAt(i);
      });
    });
    document.addEventListener("keydown", onKey);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
