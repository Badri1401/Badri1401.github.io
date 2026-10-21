// Theme toggle: follows the system until the visitor picks, then remembers the pick.
const root = document.documentElement;
const btn = document.getElementById("theme");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
const current = () => root.dataset.theme || (systemDark.matches ? "dark" : "light");
const label = () => btn.setAttribute("aria-label", current() === "dark" ? "Switch to light mode" : "Switch to dark mode");

btn.addEventListener("click", () => {
  const next = current() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
  label();
  // Keep the browser chrome in step with a manual choice, not only the system setting.
  document.querySelectorAll("meta[name=theme-color]").forEach((m) => { m.content = next === "dark" ? "#17150f" : "#efe8da"; });
});
systemDark.addEventListener("change", label);
label();

// Hairline under the header once the page scrolls.
const header = document.getElementById("top");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Explainer videos: every paper figure and project poster opens one shared player.
const player = document.getElementById("player");
if (player) {
  const video = player.querySelector("video");
  const title = player.querySelector("#player-title");
  const chapterBar = player.querySelector(".chapters");
  let opener = null;
  let chapters = [];
  const close = () => player.close();
  // Chapter start times (seconds) per video, written by videos/chapters.mts at render time.
  let chapterData = null;
  const loadChapters = () => chapterData || (chapterData = fetch("assets/video/explainers/chapters.json").then((r) => (r.ok ? r.json() : {})).catch(() => ({})));
  const markChapter = () => {
    const t = video.currentTime;
    let on = 0;
    chapters.forEach((c, i) => { if (t >= c.t - 0.05) on = i; });
    chapterBar.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-current", i === on ? "true" : "false"));
  };
  video.addEventListener("timeupdate", markChapter);
  // Arrow keys skip 5 s anywhere in the dialog; the native controls already handle them when the video has focus.
  player.addEventListener("keydown", (e) => {
    if (e.target === video || !(e.key === "ArrowLeft" || e.key === "ArrowRight")) return;
    if (!Number.isFinite(video.duration)) return;
    e.preventDefault();
    video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + (e.key === "ArrowRight" ? 5 : -5)));
  });
  document.querySelectorAll("button.play[data-video]").forEach((b) => {
    // Name each button by its paper or project, keeping the visible text in the name.
    b.setAttribute("aria-label", `${b.dataset.title} — ${b.textContent.trim().replace(/\s+/g, " ")}`);
    b.addEventListener("click", () => {
      opener = b;
      const id = b.dataset.video;
      title.textContent = b.dataset.title || "Explainer";
      video.poster = `assets/img/posters/${id}.jpg`;
      video.src = `assets/video/explainers/${id}.mp4`;
      chapters = [];
      chapterBar.replaceChildren();
      loadChapters().then((all) => {
        if (opener !== b || !all[id]) return;
        chapters = all[id];
        chapters.forEach((c) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = c.chapter;
          btn.addEventListener("click", () => { video.currentTime = c.t; video.play().catch(() => {}); });
          chapterBar.append(btn);
        });
        markChapter();
      });
      if (typeof player.showModal === "function") player.showModal();
      else player.setAttribute("open", "");
      video.play().catch(() => {}); // autoplay can be refused; the controls stay available
    });
  });
  player.querySelector(".player-close").addEventListener("click", close);
  // A click on the backdrop (outside the dialog box) closes it.
  player.addEventListener("click", (e) => { if (e.target === player) close(); });
  player.addEventListener("close", () => {
    video.pause();
    video.removeAttribute("src");
    video.load();
    if (opener) opener.focus();
  });
}

// Contact form -> Google Form, which emails each response to the owner.
// Fill these from the form's pre-filled link (see the README in the website folder).
// Until then, the form falls back to opening the visitor's mail app with the message filled in.
const GOOGLE_FORM = {
  action: "https://docs.google.com/forms/d/e/1FAIpQLSd58djMGAgamTmwkrdYqBGkrdiXt6VBSCh8Ha54oElfEviXyQ/formResponse",
  fields: { name: "entry.1807016139", email: "entry.1591217718", affiliation: "entry.503592693", message: "entry.1024593466" },
};
const MAIL = "badrikanath.praharaj@gmail.com";

const form = document.getElementById("contact-form");
if (form) {
  const status = form.querySelector(".status");
  const send = form.querySelector("button");
  const say = (msg, ok) => { status.textContent = msg; status.classList.toggle("ok", !!ok); };

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (data.website) return; // honeypot: bots fill hidden fields
    const bad = { name: !data.name.trim(), email: !/^\S+@\S+\.\S+$/.test(data.email), message: !data.message.trim() };
    for (const [k, v] of Object.entries(bad)) form.elements[k].setAttribute("aria-invalid", v);
    const first = Object.keys(bad).find((k) => bad[k]);
    if (first) {
      say("Please add your name, a valid email and a message.");
      form.elements[first].focus();
      return;
    }

    if (!GOOGLE_FORM.action) {
      const body = `${data.message}\n\n${data.name}${data.affiliation ? ", " + data.affiliation : ""}\n${data.email}`;
      window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent("Website: message from " + data.name)}&body=${encodeURIComponent(body)}`;
      say("Opening your mail app with the message filled in.", true);
      return;
    }

    const params = new URLSearchParams();
    for (const [key, entry] of Object.entries(GOOGLE_FORM.fields)) if (entry) params.append(entry, data[key] || "");
    send.disabled = true;
    say("Sending…");
    try {
      // Google Forms doesn't send CORS headers, so the reply is opaque: a resolved fetch means it was delivered.
      await fetch(GOOGLE_FORM.action, { method: "POST", mode: "no-cors", body: params });
      form.reset();
      say("Thanks, your message is on its way.", true);
    } catch (e) {
      say(`That didn't go through. Please email ${MAIL} instead.`);
    } finally {
      send.disabled = false;
    }
  });
}

// Depth: a small tilt toward the pointer, and photos that drift inside their
// frames as the page scrolls. Off for reduced motion; tilt only on devices with a real hover pointer.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".portrait picture, .lens picture, .fig, .card").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--ry", `${((x - 0.5) * 6).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${((0.5 - y) * 6).toFixed(2)}deg`);
      });
      el.addEventListener("pointerleave", () => ["--rx", "--ry"].forEach((k) => el.style.removeProperty(k)));
    });
  }
  const drifting = new Set();
  const io = new IntersectionObserver((entries) => entries.forEach((en) => (en.isIntersecting ? drifting.add(en.target) : drifting.delete(en.target))));
  document.querySelectorAll(".portrait picture, .lens picture").forEach((el) => io.observe(el));
  let queued = false;
  const drift = () => {
    queued = false;
    const vh = window.innerHeight;
    drifting.forEach((el) => {
      const r = el.getBoundingClientRect();
      const t = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 (above) .. 1 (below)
      el.style.setProperty("--py", `${(Math.max(-1, Math.min(1, t)) * r.height * 0.03).toFixed(1)}px`);
    });
  };
  const onDrift = () => { if (!queued) { queued = true; requestAnimationFrame(drift); } };
  window.addEventListener("scroll", onDrift, { passive: true });
  window.addEventListener("resize", onDrift);
  drift();
}
