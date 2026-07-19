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

const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = contactForm.querySelector("#cf-name").value.trim();
  const email = contactForm.querySelector("#cf-email").value.trim();
  const businessType = contactForm.querySelector("#cf-btype").value.trim();
  const website = contactForm.querySelector("#cf-url").value.trim();
  const message = contactForm.querySelector("#cf-message").value.trim();

  if (!name || !email || !message) {
    const missing = [];
    if (!name) missing.push("name");
    if (!email) missing.push("email");
    if (!message) missing.push("message");
    alert("Please fill in: " + missing.join(", "));
    return;
  }

  const body = [
    "Name: " + name,
    "Email: " + email,
    businessType ? "Business type: " + businessType : "",
    website ? "Website: " + website : "",
    "",
    "Problem:",
    message,
  ].filter(Boolean).join("\n");

  const subject = encodeURIComponent("New T3 Labs enquiry from " + name);
  const encodedBody = encodeURIComponent(body);
  window.location.href = "mailto:insights@t3labs.co.uk?subject=" + subject + "&body=" + encodedBody;

  if (formSuccess) {
    formSuccess.hidden = false;
  }
});
