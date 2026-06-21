/* ── Discovery call popup ── */
(function () {
  if (sessionStorage.getItem("discovery-popup-dismissed")) return;

  const CALENDLY_URL = "https://calendly.com/insights-t3labs/20-minute-meeting";

  const backdrop = document.createElement("div");
  backdrop.className = "popup-backdrop";

  const popup = document.createElement("div");
  popup.className = "popup-wrap";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "true");
  popup.setAttribute("aria-label", "Book a free discovery call");
  popup.innerHTML = `
    <div class="popup-card">
      <button class="popup-close" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <p class="popup-eyebrow">Free discovery call</p>
      <h2 class="popup-heading">Let&rsquo;s talk about your business.</h2>
      <div class="popup-rule"></div>
      <p class="popup-body">Book a free 20-minute call and we'll explore simple tech solutions to solve your biggest pain points. No pitch, no pressure - just a straight conversation about what's possible.</p>
      <a class="popup-cta" href="${CALENDLY_URL}" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        Book a free call
      </a>
      <button class="popup-not-now" aria-label="Dismiss">Not right now</button>
      <p class="popup-note">20 minutes. Free. No commitment.</p>
    </div>
  `;

  function dismiss() {
    backdrop.classList.remove("popup-visible");
    popup.classList.remove("popup-visible");
    sessionStorage.setItem("discovery-popup-dismissed", "1");
    setTimeout(() => {
      backdrop.remove();
      popup.remove();
    }, 300);
  }

  backdrop.addEventListener("click", dismiss);
  popup.querySelector(".popup-close").addEventListener("click", dismiss);
  popup.querySelector(".popup-cta").addEventListener("click", dismiss);
  popup.querySelector(".popup-not-now").addEventListener("click", dismiss);

  document.addEventListener("keydown", function onKey(e) {
    if (e.key === "Escape") { dismiss(); document.removeEventListener("keydown", onKey); }
  });

  document.body.appendChild(backdrop);
  document.body.appendChild(popup);

  setTimeout(() => {
    backdrop.classList.add("popup-visible");
    popup.classList.add("popup-visible");
  }, 10000);
}());

/* ── Nav toggle ── */
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");

navToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

/* ── Scroll reveal ── */
(function () {
  const revealEls = document.querySelectorAll(".reveal-card, .reveal-fade");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i * 120) + "ms";
    observer.observe(el);
  });
}());

/* ── Contact form ── */
(function () {
  const form = document.getElementById("contactForm");
  const successEl = document.getElementById("formSuccess");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.querySelector("#cf-name").value.trim();
    const email = form.querySelector("#cf-email").value.trim();
    const message = form.querySelector("#cf-message").value.trim();
    const btn = form.querySelector(".form-submit");

    if (!name || !email || !message) {
      const missing = [];
      if (!name) missing.push("name");
      if (!email) missing.push("email");
      if (!message) missing.push("message");
      alert("Please fill in: " + missing.join(", "));
      return;
    }

    btn.textContent = "Sending...";
    btn.disabled = true;

    try {
      const businessType = form.querySelector("#cf-btype").value.trim();
      const website = form.querySelector("#cf-url").value.trim();

      // Build a readable auto-reply body for the sender
      const autoReplyBody = [
        "Hi " + name + ",",
        "",
        "Thanks for reaching out to T3 Labs! We've received your message and will get back to you within 24 hours.",
        "",
        "Here's a copy of what you sent:",
        "──────────────────────────",
        message,
        "──────────────────────────",
        "",
        businessType ? "Business type: " + businessType : "",
        website ? "Website: " + website : "",
        "",
        "Talk soon,",
        "The T3 Labs team",
        "https://t3labs.tech",
      ].filter(Boolean).join("\n");

      const payload = {
        name,
        email,
        businessType: businessType || undefined,
        website: website || undefined,
        message,
        // Formspree built-ins
        _subject: "New enquiry from " + name + " - T3 Labs",
        _replyto: email,
        _autoresponse: autoReplyBody,
      };

      // Formspree endpoint - replace T3LABS_FORM_ID with actual ID when ready
      const res = await fetch("https://formspree.io/f/T3LABS_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Hide the entire form area, reveal success card
        form.style.display = "none";
        if (successEl) {
          successEl.hidden = false;
          successEl.removeAttribute("hidden");
          successEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Network error");
      }
    } catch (err) {
      btn.textContent = "Send message →";
      btn.disabled = false;
      alert("Something went wrong. Please email us directly at hello@t3labs.tech");
    }
  });
}());
