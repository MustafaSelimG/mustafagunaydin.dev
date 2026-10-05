(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.getElementById("header-nav");
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.getElementById("nav-panel");
  const links = document.querySelectorAll(".nav-link[href^='#']");
  const toTop = document.getElementById("to-top");
  const year = document.getElementById("year");
  const sectionIds = ["about", "experience", "skills", "projects", "courses", "contact"];

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      setNavOpen(!nav.classList.contains("is-open"));
    });
  }

  links.forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavOpen(false);
  });

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) scrollObserver.observe(el);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    const delay = el.getAttribute("data-delay");
    if (delay) el.style.setProperty("--delay", delay + "ms");
    if (reduceMotion) {
      el.classList.add("is-in");
      return;
    }
    revealObserver.observe(el);
  });

  const topSentinel = document.createElement("div");
  topSentinel.setAttribute("aria-hidden", "true");
  topSentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;";
  document.body.prepend(topSentinel);

  const deepSentinel = document.createElement("div");
  deepSentinel.setAttribute("aria-hidden", "true");
  deepSentinel.style.cssText = "position:absolute;top:480px;left:0;width:1px;height:1px;pointer-events:none;";
  document.body.appendChild(deepSentinel);

  new IntersectionObserver(
    ([entry]) => {
      if (nav) nav.classList.toggle("is-scrolled", !entry.isIntersecting);
    },
    { threshold: 1 }
  ).observe(topSentinel);

  new IntersectionObserver(
    ([entry]) => {
      if (toTop) toTop.classList.toggle("is-visible", !entry.isIntersecting);
    },
    { threshold: 0 }
  ).observe(deepSentinel);
})();