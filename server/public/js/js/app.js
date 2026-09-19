const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");

function addMessage(sender, text) {
  const message = document.createElement("div");
  message.className = "message";

  const strong = document.createElement("strong");
  strong.textContent = sender;

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  message.appendChild(strong);
  message.appendChild(paragraph);

  messages.appendChild(message);

  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();

  if (!message) {
    return;
  }

  addMessage("أنت", message);

  input.value = "";
  input.disabled = true;

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
      data.reply || "حدث خطأ أثناء معالجة الرسالة."
    );

  } catch (error) {

    addMessage(
      "MOHHA",
      "تعذر الاتصال بالخادم حاليًا."
    );

  } finally {
    input.disabled = false;
    input.focus();
  }
});
