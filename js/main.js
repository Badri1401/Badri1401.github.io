/* ===========================================================
   main.js
   ---------------------------------------------------------------
   Your links live here (already filled in). Edit if they change.
   =========================================================== */
const CONFIG = {
  email:    "badrikanath.praharaj@gmail.com",
  github:   "https://github.com/Badri1401",
  scholar:  "https://scholar.google.com/citations?user=C7Sa9OwAAAAJ&hl=en",
  linkedin: "https://www.linkedin.com/in/badrikanathpraharaj/",
};

function setLink(id, href){ const el = document.getElementById(id); if(el) el.href = href; }
setLink("link-email",     "mailto:" + CONFIG.email);
setLink("link-email-f",   "mailto:" + CONFIG.email);
setLink("link-github",    CONFIG.github);
setLink("link-github-f",  CONFIG.github);
setLink("link-scholar",   CONFIG.scholar);
setLink("link-scholar-f", CONFIG.scholar);
setLink("link-linkedin",  CONFIG.linkedin);
setLink("link-linkedin-f",CONFIG.linkedin);

/* ---- year ---- */
const yr = document.getElementById("year");
if (yr) yr.textContent = new Date().getFullYear();

/* ---- nav border on scroll ---- */
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---- mobile nav ---- */
const toggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (toggle) {
  toggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );
}

/* ---- scroll reveal ---- */
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce) {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

/* ---- play videos on hover ---- */
document.querySelectorAll(".card-media video, .proj-media video").forEach(v => {
  const host = v.closest(".card, .proj") || v.parentElement;
  host.addEventListener("mouseenter", () => { v.play().catch(()=>{}); });
  host.addEventListener("mouseleave", () => { v.pause(); v.currentTime = 0; });
});

/* ---- gallery lightbox ---- */
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lightbox-img");
const gallery = document.getElementById("gallery");
if (gallery && lb) {
  gallery.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      lbImg.src = e.target.src;
      lbImg.alt = e.target.alt;
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
    }
  });
  const close = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden","true"); lbImg.src=""; };
  lb.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}
