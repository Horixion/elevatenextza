
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    });
  });
}

// Automatically update the footer year
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Formspree contact form
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitButton = document.getElementById("submitButton");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const originalButtonText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.textContent = "Sending enquiry...";

    if (formStatus) {
      formStatus.textContent = "Please wait while your enquiry is being sent.";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        contactForm.reset();

        if (formStatus) {
          formStatus.textContent =
            "Thank you! Your enquiry has been sent successfully. We'll be in touch soon.";
        }
      } else {
        const result = await response.json();

        if (formStatus) {
          formStatus.textContent =
            result.errors && result.errors.length > 0
              ? result.errors.map((error) => error.message).join(" ")
              : "Something went wrong. Please try again or email us directly.";
        }
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent =
          "We couldn't send your enquiry. Please check your internet connection or email us directly.";
      }
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });
}
