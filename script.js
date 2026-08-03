// ---------------------------------------------------------------------
// Nav scroll state + mobile drawer
// ---------------------------------------------------------------------
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navDrawer = document.getElementById("navDrawer");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 12);
}, { passive: true });

function closeDrawer() {
  navDrawer.classList.remove("open");
}

navToggle?.addEventListener("click", () => {
  navDrawer.classList.toggle("open");
});

navDrawer?.addEventListener("click", (e) => {
  if (e.target === navDrawer) closeDrawer();
});

document.querySelectorAll("[data-nav]").forEach((link) => {
  link.addEventListener("click", closeDrawer);
});

// ---------------------------------------------------------------------
// Dropdowns (CV language picker + nav section groups)
// ---------------------------------------------------------------------
const dropdownClosers = [];

function setupDropdown(toggle, menu) {
  if (!toggle || !menu) return;

  function close() {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.classList.remove("open");
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !menu.classList.contains("open");
    dropdownClosers.forEach((closeOther) => closeOther());
    if (willOpen) {
      menu.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.classList.add("open");
    }
  });

  dropdownClosers.push(close);
}

const cvToggle = document.getElementById("cvToggle");
const cvMenu = document.getElementById("cvMenu");
setupDropdown(cvToggle, cvMenu);

document.querySelectorAll(".nav-dropdown").forEach((group) => {
  setupDropdown(group.querySelector(".nav-dropdown-toggle"), group.querySelector(".nav-dropdown-menu"));
});

document.addEventListener("click", (e) => {
  const insideDropdown = e.target.closest(".nav-dropdown, .cv-dropdown");
  if (!insideDropdown) dropdownClosers.forEach((close) => close());
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") dropdownClosers.forEach((close) => close());
});

document.querySelectorAll(".nav-dropdown-menu a[data-nav]").forEach((link) => {
  link.addEventListener("click", () => dropdownClosers.forEach((close) => close()));
});

// ---------------------------------------------------------------------
// Active nav link on scroll
// ---------------------------------------------------------------------
const sections = ["sobre-mi", "experiencia", "resultados", "casos", "educacion", "herramientas-ia", "contacto"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navLinks = document.querySelectorAll('.nav-links a[data-nav]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((l) => l.classList.remove("active"));
      document.querySelectorAll(".nav-dropdown-toggle").forEach((t) => t.classList.remove("active"));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      active?.classList.add("active");
      const parentToggle = active?.closest(".nav-dropdown")?.querySelector(".nav-dropdown-toggle");
      parentToggle?.classList.add("active");
    }
  });
}, { rootMargin: "-40% 0px -50% 0px" });

sections.forEach((s) => sectionObserver.observe(s));

// ---------------------------------------------------------------------
// Reveal on scroll
// ---------------------------------------------------------------------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------------------------------------------------------------------
// Count-up numbers
// ---------------------------------------------------------------------
function animateCount(el) {
  const target = parseFloat(el.getAttribute("data-count"));
  const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
  const duration = 1400;
  const start = performance.now();

  function locale() {
    return typeof currentLang !== "undefined" && currentLang === "en" ? "en-US" : "es-AR";
  }

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString(locale());
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = decimals > 0
        ? target.toFixed(decimals)
        : Math.round(target).toLocaleString(locale());
      el.classList.add("counted");
    }
  }
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

// ---------------------------------------------------------------------
// Bar chart fill animation
// ---------------------------------------------------------------------
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const row = entry.target;
      const value = parseFloat(row.getAttribute("data-value"));
      const max = 1.8; // headroom above the highest cost-per-result value
      const fill = row.querySelector(".bar-fill");
      requestAnimationFrame(() => {
        fill.style.width = `${Math.min((value / max) * 100, 100)}%`;
      });
      barObserver.unobserve(row);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll(".bar-row[data-value]").forEach((row) => barObserver.observe(row));

// ---------------------------------------------------------------------
// Copy email to clipboard (mailto: silently does nothing on machines
// with no default mail client configured — common on Windows)
// ---------------------------------------------------------------------
const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.querySelectorAll(".js-copy-email").forEach((link) => {
  link.addEventListener("click", async (e) => {
    const email = link.getAttribute("data-email");
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      return;
    }
    const lang = typeof currentLang !== "undefined" ? currentLang : "es";
    const message = lang === "en"
      ? `Copied to clipboard: ${email}`
      : `Copiado al portapapeles: ${email}`;
    showToast(message);
  });
});
