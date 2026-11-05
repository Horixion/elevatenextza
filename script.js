const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    });
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const business = String(formData.get("business") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent("Website enquiry from " + name);
    const body = encodeURIComponent(
      "Name: " + name + "\nBusiness: " + (business || "Not provided") +
      "\nService: " + service + "\n\nProject details:\n" + (message || "Not provided")
    );

    // Replace this example address with the active business email before launch.
    window.location.href = "mailto:hello@elevatenextza.co.za?subject=" + subject + "&body=" + body;

    if (formStatus) {
      formStatus.textContent = "Your email app should open with the enquiry prepared. Remember to replace the example email address before publishing.";
    }
  });
}