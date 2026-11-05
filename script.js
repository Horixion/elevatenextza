
// ==========================================
// ELEVATENEXTZA - MAIN JAVASCRIPT
// ==========================================


// ==========================================
// 1. MOBILE NAVIGATION
// ==========================================

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


// ==========================================
// 2. AUTOMATIC FOOTER YEAR
// ==========================================

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}


// ==========================================
// 3. FORMSPREE CONTACT FORM
// ==========================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const formStatus = document.getElementById("formStatus");
  const submitButton = document.getElementById("submitButton");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const originalButtonText = submitButton
      ? submitButton.innerHTML
      : "";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending enquiry...";
    }

    if (formStatus) {
      formStatus.textContent =
        "Please wait while your enquiry is being sent.";
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
        if (formStatus) {
          formStatus.textContent =
            "Something went wrong. Please try again or email us directly.";
        }
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent =
          "We couldn't send your enquiry. Please check your internet connection or email us directly.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    }
  });
}


// ==========================================
// 4. ELEVATENEXT AI CONFIGURATION
// ==========================================

const ELEVATE_AI_URL =
  "https://elevatenext-ai.sibonkosi646.workers.dev";

const chatHistory = [];

let chatBusy = false;


// ==========================================
// 5. CHATBOT ELEMENTS
// ==========================================

const chatButton = document.getElementById("elevateChatButton");
const chatWindow = document.getElementById("elevateChatWindow");
const chatClose = document.getElementById("elevateChatClose");
const chatMessages = document.getElementById("elevateChatMessages");
const chatForm = document.getElementById("elevateChatForm");
const chatInput = document.getElementById("elevateChatInput");
const chatSend = document.getElementById("elevateChatSend");


// ==========================================
// 6. CHECK CHATBOT HTML EXISTS
// ==========================================

const chatbotReady =
  chatButton &&
  chatWindow &&
  chatClose &&
  chatMessages &&
  chatForm &&
  chatInput &&
  chatSend;

if (!chatbotReady) {
  console.error(
    "ElevateNext AI: One or more chatbot HTML elements are missing."
  );
}


// ==========================================
// 7. DISPLAY CHAT MESSAGES
// ==========================================

function addChatMessage(message, sender, extraClass = "") {
  const messageElement = document.createElement("div");

  messageElement.className =
    "elevate-chat-message " + sender + " " + extraClass;

  // Use textContent so messages cannot inject HTML.
  messageElement.textContent = message;

  chatMessages.appendChild(messageElement);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  return messageElement;
}


// ==========================================
// 8. OPEN CHATBOT
// ==========================================

function openElevateChat() {
  if (!chatbotReady) return;

  chatWindow.classList.add("open");
  chatWindow.setAttribute("aria-hidden", "false");
  chatButton.setAttribute("aria-expanded", "true");

  if (chatMessages.children.length === 0) {
    addChatMessage(
      "Hello! Welcome to ElevateNextZA. I'm your AI assistant. Ask me anything about our websites, services or pricing.",
      "bot"
    );
  }

  chatInput.focus();
}


// ==========================================
// 9. CLOSE CHATBOT
// ==========================================

function closeElevateChat() {
  if (!chatbotReady) return;

  chatWindow.classList.remove("open");
  chatWindow.setAttribute("aria-hidden", "true");
  chatButton.setAttribute("aria-expanded", "false");

  chatButton.focus();
}


// ==========================================
// 10. CHAT BUTTON EVENTS
// ==========================================

if (chatbotReady) {
  chatButton.addEventListener("click", () => {
    if (chatWindow.classList.contains("open")) {
      closeElevateChat();
    } else {
      openElevateChat();
    }
  });

  chatClose.addEventListener("click", closeElevateChat);
}


// ==========================================
// 11. SEND MESSAGE TO CLOUDFLARE AI
// ==========================================

async function sendElevateMessage(message) {
  if (!chatbotReady || chatBusy) return;

  const cleanMessage = message.trim();

  if (!cleanMessage) return;

  chatBusy = true;

  addChatMessage(cleanMessage, "user");

  chatInput.value = "";
  chatSend.disabled = true;

  const loadingMessage = addChatMessage(
    "ElevateNext AI is thinking...",
    "bot",
    "loading"
  );

  chatHistory.push({
    role: "user",
    content: cleanMessage
  });

  try {
    const response = await fetch(ELEVATE_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: chatHistory.slice(-8)
      })
    });

    const data = await response.json();

    loadingMessage.remove();

    if (!response.ok) {
      throw new Error(
        data.error || "The AI service is unavailable."
      );
    }

    if (!data.reply || typeof data.reply !== "string") {
      throw new Error("The AI returned an invalid response.");
    }

    chatHistory.push({
      role: "assistant",
      content: data.reply
    });

    addChatMessage(data.reply, "bot");

  } catch (error) {
    // Remove the unanswered user message from conversation history.
    chatHistory.pop();

    loadingMessage.remove();

    addChatMessage(
      "I'm having trouble connecting right now. Please try again shortly, or contact us at Sibonkosi646@gmail.com.",
      "bot"
    );

    console.error("ElevateNext AI error:", error);

  } finally {
    chatBusy = false;
    chatSend.disabled = false;
    chatInput.focus();
  }
}


// ==========================================
// 12. CHAT FORM SUBMISSION
// ==========================================

if (chatbotReady) {
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (chatBusy) return;

    const message = chatInput.value;

    if (!message.trim()) return;

    sendElevateMessage(message);
  });
}


// ==========================================
// 13. QUICK QUESTION BUTTONS
// ==========================================

if (chatbotReady) {
  document
    .querySelectorAll(".elevate-chat-quick button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        sendElevateMessage(button.dataset.question);
      });
    });
}


// ==========================================
// 14. KEYBOARD ACCESSIBILITY
// ==========================================

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    chatbotReady &&
    chatWindow.classList.contains("open")
  ) {
    closeElevateChat();
  }
});
