const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const messages = document.getElementById("messages");

function addMessage(name, text) {
  const message = document.createElement("div");

  message.className = "message";

  const title = document.createElement("strong");
  title.textContent = name;

  const content = document.createElement("p");
  content.textContent = text;

  message.appendChild(title);
  message.appendChild(content);

  messages.appendChild(message);

  messages.scrollTop = messages.scrollHeight;
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  addMessage("أنت", message);

  messageInput.value = "";
  messageInput.disabled = true;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: message
      })
    });

    const data = await response.json();

    addMessage(
      "MOHHA",
      data.reply || "لم يصل رد من الخادم."
    );

  } catch (error) {

    addMessage(
      "MOHHA",
      "حدث خطأ أثناء الاتصال بالخادم."
    );

  } finally {

    messageInput.disabled = false;
    messageInput.focus();

  }
});
