const form = document.getElementById("chat-form");

const input = document.getElementById("message-input");

const messages = document.getElementById("messages");

const sendButton = document.getElementById("send-button");


function addMessage(sender, text, type) {

  const message = document.createElement("div");

  message.className = `message ${type || ""}`;


  const strong = document.createElement("strong");

  strong.textContent = sender;


  const paragraph = document.createElement("p");

  paragraph.textContent = text;


  message.appendChild(strong);

  message.appendChild(paragraph);


  messages.appendChild(message);


  messages.scrollTop = messages.scrollHeight;
}


async function sendMessage(message) {

  const response = await fetch("/api/chat", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      message
    })

  });


  if (!response.ok) {
    throw new Error("API request failed");
  }


  return response.json();
}


form.addEventListener("submit", async (event) => {

  event.preventDefault();


  const message = input.value.trim();


  if (!message) {
    return;
  }


  addMessage(
    "أنت",
    message,
    "user-message"
  );


  input.value = "";

  input.disabled = true;

  sendButton.disabled = true;

  sendButton.textContent = "جارٍ الإرسال...";


  try {

    const data = await sendMessage(message);


    addMessage(
      "MOHHA",
      data.reply || "لم تصل استجابة من MOHHA.",
      "mohha-message"
    );

  } catch (error) {

    addMessage(
      "MOHHA",
      "تعذر الاتصال بالخادم حاليًا.",
      "mohha-message"
    );

  } finally {

    input.disabled = false;

    sendButton.disabled = false;

    sendButton.textContent = "إرسال";

    input.focus();

  }

});
