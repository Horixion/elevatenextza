
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
  const submitButton =
    document.getElementById("submitButton") ||
    contactForm.querySelector('[type="submit"]');

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const originalButtonText = submitButton
      ? submitButton.innerHTML
      : "";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending enquiry...";
    }

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
        if (formStatus) {
          formStatus.textContent =
            "Something went wrong. Please try again or email us directly.";
        }
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent =
          "We couldn't send your enquiry. Please check your internet connection.";
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
// 5. CHATBOT DESIGN
// ==========================================

const chatbotStyles = document.createElement("style");

chatbotStyles.textContent = `

  .elevate-chat-button {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    border: none;
    border-radius: 50px;
    padding: 15px 21px;
    background: #b8f35a;
    color: #101820;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    transition: transform 0.2s ease;
  }

  .elevate-chat-button:hover {
    transform: translateY(-3px);
  }

  .elevate-chat-window {
    position: fixed;
    right: 24px;
    bottom: 90px;
    z-index: 9999;
    width: 360px;
    max-width: calc(100vw - 32px);
    height: 490px;
    max-height: calc(100vh - 120px);
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 12px 50px rgba(0,0,0,0.22);
    display: none;
    flex-direction: column;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    border: 1px solid #e7e9eb;
  }

  .elevate-chat-window.open {
    display: flex;
  }

  .elevate-chat-header {
    background: #101820;
    color: #ffffff;
    padding: 19px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .elevate-chat-header h3 {
    margin: 0;
    font-size: 16px;
    color: #ffffff;
  }

  .elevate-chat-header p {
    margin: 5px 0 0;
    font-size: 11px;
    color: #b8f35a;
  }

  .elevate-chat-close {
    border: none;
    background: transparent;
    color: #ffffff;
    font-size: 24px;
    cursor: pointer;
  }

  .elevate-chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #f7f8f6;
  }

  .elevate-chat-message {
    padding: 12px 14px;
    border-radius: 13px;
    font-size: 13px;
    line-height: 1.6;
    max-width: 88%;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }

  .elevate-chat-message.bot {
    background: #ffffff;
    color: #101820;
    align-self: flex-start;
    border: 1px solid #e9ebed;
  }

  .elevate-chat-message.user {
    background: #101820;
    color: #ffffff;
    align-self: flex-end;
  }

  .elevate-chat-message.loading {
    color: #727b83;
    font-style: italic;
  }

  .elevate-chat-quick {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
    padding: 12px 14px 0;
    background: #ffffff;
  }

  .elevate-chat-quick button {
    border: 1px solid #dfe3e5;
    background: #ffffff;
    color: #101820;
    border-radius: 20px;
    padding: 7px 10px;
    font-size: 11px;
    cursor: pointer;
  }

  .elevate-chat-quick button:hover {
    background: #f0f5e8;
    border-color: #b8f35a;
  }

  .elevate-chat-form {
    display: flex;
    gap: 8px;
    padding: 13px;
    background: #ffffff;
    border-top: 1px solid #e9ebed;
  }

  .elevate-chat-input {
    flex: 1;
    min-width: 0;
    border: 1px solid #dfe3e5;
    border-radius: 25px;
    padding: 12px 14px;
    outline: none;
    font-family: inherit;
    font-size: 13px;
  }

  .elevate-chat-input:focus {
    border-color: #9acb43;
  }

  .elevate-chat-send {
    border: none;
    background: #b8f35a;
    color: #101820;
    border-radius: 50%;
    width: 43px;
    height: 43px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    flex-shrink: 0;
  }

  .elevate-chat-send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .elevate-chat-footer {
    text-align: center;
    font-size: 10px;
    color: #8a9299;
    padding: 0 10px 10px;
    background: #ffffff;
  }

  @media (max-width: 480px) {
    .elevate-chat-button {
      right: 15px;
      bottom: 15px;
    }

    .elevate-chat-window {
      right: 10px;
      bottom: 75px;
      width: calc(100vw - 20px);
      max-width: none;
      height: min(490px, calc(100dvh - 100px));
    }
  }

`;

document.head.appendChild(chatbotStyles);


// ==========================================
// 6. CREATE CHATBOT HTML
// ==========================================

const chatbotContainer = document.createElement("div");

chatbotContainer.innerHTML = `

  <button
    type="button"
    class="elevate-chat-button"
    id="elevateChatButton"
    aria-label="Open ElevateNext AI assistant"
    aria-expanded="false"
  >
    ✳ Chat with us
  </button>

  <section
    class="elevate-chat-window"
    id="elevateChatWindow"
    aria-label="ElevateNext AI chat assistant"
    aria-hidden="true"
  >

    <div class="elevate-chat-header">

      <div>
        <h3>ElevateNext AI</h3>
        <p>YOUR WEBSITE ASSISTANT</p>
      </div>

      <button
        type="button"
        class="elevate-chat-close"
        id="elevateChatClose"
        aria-label="Close chat"
      >
        ×
      </button>

    </div>

    <div
      class="elevate-chat-messages"
      id="elevateChatMessages"
      aria-live="polite"
    ></div>

    <div class="elevate-chat-quick">

      <button type="button" data-question="What services do you offer?">
        Services
      </button>

      <button type="button" data-question="What are your prices?">
        Pricing
      </button>

      <button type="button" data-question="How do I get started?">
        Get started
      </button>

    </div>

    <form class="elevate-chat-form" id="elevateChatForm">

      <input
        type="text"
        class="elevate-chat-input"
        id="elevateChatInput"
        placeholder="Ask us something..."
        autocomplete="off"
        maxlength="1200"
        aria-label="Type your message"
        required
      >

      <button
        type="submit"
        class="elevate-chat-send"
        id="elevateChatSend"
        aria-label="Send message"
      >
        ↑
      </button>

    </form>

    <div class="elevate-chat-footer">
      ElevateNextZA · BUILD. ELEVATE. GROW.
    </div>

  </section>

`;

document.body.appendChild(chatbotContainer);


// ==========================================
// 7. CHATBOT ELEMENTS
// ==========================================

const chatButton = document.getElementById("elevateChatButton");
const chatWindow = document.getElementById("elevateChatWindow");
const chatClose = document.getElementById("elevateChatClose");
const chatMessages = document.getElementById("elevateChatMessages");
const chatForm = document.getElementById("elevateChatForm");
const chatInput = document.getElementById("elevateChatInput");
const chatSend = document.getElementById("elevateChatSend");


// ==========================================
// 8. DISPLAY CHAT MESSAGES
// ==========================================

function addChatMessage(message, sender, extraClass = "") {

  const messageElement = document.createElement("div");

  messageElement.className =
    "elevate-chat-message " + sender + " " + extraClass;

  messageElement.textContent = message;

  chatMessages.appendChild(messageElement);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  return messageElement;
}


// ==========================================
// 9. OPEN CHATBOT
// ==========================================

function openElevateChat() {

  chatWindow.classList.add("open");

  chatWindow.setAttribute("aria-hidden", "false");

  chatButton.setAttribute("aria-expanded", "true");

  chatInput.focus();

  if (chatMessages.children.length === 0) {

    addChatMessage(
      "Hello! Welcome to ElevateNextZA. I'm your AI assistant. Ask me anything about our websites, services or pricing.",
      "bot"
    );

  }

}


// ==========================================
// 10. CLOSE CHATBOT
// ==========================================

function closeElevateChat() {

  chatWindow.classList.remove("open");

  chatWindow.setAttribute("aria-hidden", "true");

  chatButton.setAttribute("aria-expanded", "false");

  chatButton.focus();

}


chatButton.addEventListener("click", () => {

  if (chatWindow.classList.contains("open")) {
    closeElevateChat();
  } else {
    openElevateChat();
  }

});

chatClose.addEventListener("click", closeElevateChat);


// ==========================================
// 11. SEND MESSAGE TO REAL AI
// ==========================================

async function sendElevateMessage(message) {

  const cleanMessage = message.trim();

  if (!cleanMessage || chatBusy) return;

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
      throw new Error(data.error || "The AI service is unavailable.");
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

    // Remove the unanswered message from conversation history
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

chatForm.addEventListener("submit", (event) => {

  event.preventDefault();

  if (chatBusy) return;

  const message = chatInput.value;

  if (!message.trim()) return;

  sendElevateMessage(message);

});


// ==========================================
// 13. QUICK QUESTION BUTTONS
// ==========================================

document.querySelectorAll(".elevate-chat-quick button").forEach((button) => {

  button.addEventListener("click", () => {

    sendElevateMessage(button.dataset.question);

  });

});


// ==========================================
// 14. KEYBOARD ACCESSIBILITY
// ==========================================

document.addEventListener("keydown", (event) => {

  if (
    event.key === "Escape" &&
    chatWindow.classList.contains("open")
  ) {

    closeElevateChat();

  }

});
