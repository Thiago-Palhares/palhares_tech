const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress span");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const revealItems = document.querySelectorAll(".reveal");
const tiltItems = document.querySelectorAll("[data-tilt]");
const hero = document.querySelector(".hero");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelector("[data-year]").textContent = new Date().getFullYear();

function updateScrollState() {
  const scrollTop = window.scrollY;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle("scrolled", scrollTop > 24);
  progress.style.transform = `scaleX(${scrollRange > 0 ? scrollTop / scrollRange : 0})`;
}

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const shouldOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(shouldOpen));
  navigation.classList.toggle("open", shouldOpen);
  document.body.classList.toggle("menu-open", shouldOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px" },
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
  revealObserver.observe(item);
});

const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-38% 0px -52%", threshold: 0 },
);

sections.forEach((section) => sectionObserver.observe(section));

function handleHeroPointer(event) {
  const bounds = hero.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;
  hero.style.setProperty("--pointer-x", `${x}%`);
  hero.style.setProperty("--pointer-y", `${y}%`);
}

function setupTilt(element) {
  element.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion.matches || event.pointerType === "touch") return;
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    element.style.transform = `perspective(1000px) rotateX(${y * -2.2}deg) rotateY(${x * 2.2}deg)`;
  });

  element.addEventListener("pointerleave", () => {
    element.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });
}

tiltItems.forEach(setupTilt);
hero.addEventListener("pointermove", handleHeroPointer);
window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});

updateScrollState();

