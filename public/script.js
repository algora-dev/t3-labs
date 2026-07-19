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
const formSubmitBtn = contactForm?.querySelector(".form-submit");

contactForm?.addEventListener("submit", async (event) => {
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

  // Disable button and show loading state
  if (formSubmitBtn) {
    formSubmitBtn.disabled = true;
    formSubmitBtn.style.opacity = "0.6";
    const originalText = formSubmitBtn.innerHTML;
    formSubmitBtn.innerHTML = "Sending...";
  }

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, businessType, website, message }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    // Success
    contactForm.style.display = "none";
    if (formSuccess) {
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } catch (err) {
    alert(err.message || "Something went wrong. Please email us directly at insights@t3labs.co.uk");
    // Re-enable button
    if (formSubmitBtn) {
      formSubmitBtn.disabled = false;
      formSubmitBtn.style.opacity = "1";
      formSubmitBtn.innerHTML = 'Send message <span>&rarr;</span>';
    }
  }
});
