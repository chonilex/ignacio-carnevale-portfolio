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
// CV language dropdown
// ---------------------------------------------------------------------
const cvToggle = document.getElementById("cvToggle");
const cvMenu = document.getElementById("cvMenu");

function closeCvMenu() {
  cvMenu?.classList.remove("open");
  cvToggle?.setAttribute("aria-expanded", "false");
}

cvToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = cvMenu.classList.toggle("open");
  cvToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (e) => {
  if (cvMenu?.classList.contains("open") && !cvMenu.contains(e.target) && e.target !== cvToggle) {
    closeCvMenu();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCvMenu();
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
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      active?.classList.add("active");
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

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString("es-AR");
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = decimals > 0
        ? target.toFixed(decimals)
        : Math.round(target).toLocaleString("es-AR");
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
