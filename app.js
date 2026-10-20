
const robot = document.getElementById("robot");
const commandInput = document.getElementById("command");
const response = document.getElementById("response");
const language = document.getElementById("language");

const translations = {
  "en-US": {
    hello: "Hello! I am BLUE, your digital AI assistant, powered by NICO.",
    wave: "Hello! Nice to meet you.",
    dance: "Starting dance mode!",
    sleep: "Entering sleep mode.",
    wake: "I am awake and ready.",
    help: "Try: hello, wave, dance, sleep, wake, look left, look right, or call me followed by your name.",
    thanks: "You are welcome! I am here to help.",
    time: () => "The current time is " + new Date().toLocaleTimeString()
  },
  "hi-IN": {
    hello: "नमस्ते! मैं BLUE हूँ, NICO का डिजिटल AI सहायक।",
    wave: "नमस्ते! आपसे मिलकर अच्छा लगा।",
    dance: "डांस मोड शुरू हो रहा है!",
    sleep: "मैं स्लीप मोड में जा रहा हूँ।",
    wake: "मैं तैयार हूँ।",
    help: "कहें: hello, dance, sleep, wake, look left या help।",
    thanks: "आपका स्वागत है! मैं आपकी मदद के लिए हूँ।",
    time: () => "अभी समय है " + new Date().toLocaleTimeString("hi-IN")
  },
  "pa-IN": {
    hello: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ BLUE ਹਾਂ, NICO ਦਾ AI ਸਹਾਇਕ।",
    wave: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਹਾਨੂੰ ਮਿਲ ਕੇ ਖੁਸ਼ੀ ਹੋਈ।",
    dance: "ਡਾਂਸ ਮੋਡ ਸ਼ੁਰੂ ਹੋ ਰਿਹਾ ਹੈ!",
    sleep: "ਮੈਂ ਸਲੀਪ ਮੋਡ ਵਿੱਚ ਜਾ ਰਿਹਾ ਹਾਂ।",
    wake: "ਮੈਂ ਤਿਆਰ ਹਾਂ।",
    help: "ਕਹੋ: hello, dance, sleep, wake, look left ਜਾਂ help।",
    thanks: "ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ! ਮੈਂ ਮਦਦ ਲਈ ਹਾਂ।",
    time: () => "ਹੁਣ ਸਮਾਂ ਹੈ " + new Date().toLocaleTimeString()
  },
  "es-ES": {
    hello: "¡Hola! Soy BLUE, tu asistente digital de inteligencia artificial de NICO.",
    wave: "¡Hola! Encantado de conocerte.",
    dance: "¡Activando el modo baile!",
    sleep: "Entrando en modo de suspensión.",
    wake: "Estoy despierto y listo.",
    help: "Prueba: hello, dance, sleep, wake, look left o help.",
    thanks: "¡De nada! Estoy aquí para ayudarte.",
    time: () => "La hora actual es " + new Date().toLocaleTimeString("es-ES")
  }
};

function say(text) {
  response.textContent = text;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language.value;
    window.speechSynthesis.speak(utterance);
  }
}

function runCommand(rawCommand) {
  const cmd = rawCommand.trim().toLowerCase();
  const t = translations[language.value] || translations["en-US"];

  if (!cmd) return;

  robot.classList.remove("wave", "dance", "sleep");

  if (cmd.includes("hello") || cmd.includes("hi") ||
      cmd.includes("नमस्ते") || cmd.includes("ਸਤ ਸ੍ਰੀ ਅਕਾਲ")) {
    say(t.hello);
  } else if (cmd.includes("wave")) {
    robot.classList.add("wave");
    say(t.wave);
  } else if (cmd.includes("dance")) {
    robot.classList.add("dance");
    say(t.dance);
  } else if (cmd.includes("sleep")) {
    robot.classList.add("sleep");
    say(t.sleep);
  } else if (cmd.includes("wake")) {
    say(t.wake);
  } else if (cmd.includes("look left")) {
    robot.style.transform = "rotateY(-15deg)";
    say("Looking left.");
  } else if (cmd.includes("look right")) {
    robot.style.transform = "rotateY(15deg)";
    say("Looking right.");
  } else if (cmd.startsWith("call me ")) {
    const name = rawCommand.trim().slice(8);
    say("Nice to meet you, " + name + "! I will call you " + name + ".");
  } else if (cmd.includes("help")) {
    say(t.help);
  } else if (cmd.includes("thank")) {
    say(t.thanks);
  } else if (cmd.includes("time")) {
    say(t.time());
  } else {
    say("I heard: " + rawCommand +
        ". This demo supports basic commands. Try saying help.");
  }
}

document.getElementById("send").addEventListener("click", () => {
  runCommand(commandInput.value);
  commandInput.value = "";
});

commandInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    runCommand(commandInput.value);
    commandInput.value = "";
  }
});

document.querySelectorAll("[data-command]").forEach(button => {
  button.addEventListener("click", () => {
    runCommand(button.dataset.command);
  });
});

/* Make BLUE's head and eyes follow the mouse */

document.addEventListener("mousemove", event => {
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  const pupils = document.querySelectorAll(".pupil");
  pupils.forEach(pupil => {
    pupil.style.transform =
      `translate(${x * 7}px, ${y * 4}px)`;
  });

  if (!robot.classList.contains("dance")) {
    robot.style.transform =
      `rotateY(${x * 10}deg) rotateX(${-y * 3}deg)`;
  }
});

/* Browser voice recognition */

const voiceButton = document.getElementById("voice");
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceButton.addEventListener("click", () => {
    recognition.lang = language.value;
    voiceButton.textContent = "🎙 Listening...";
    recognition.start();
  });

  recognition.onresult = event => {
    const spokenText = event.results[0][0].transcript;
    commandInput.value = spokenText;
    runCommand(spokenText);
    voiceButton.textContent = "🎙 Start Voice Command";
  };

  recognition.onerror = () => {
    voiceButton.textContent = "🎙 Try Again";
    say("Voice recognition could not start. Check your microphone permission.");
  };

  recognition.onend = () => {
    voiceButton.textContent = "🎙 Start Voice Command";
  };
} else {
  voiceButton.addEventListener("click", () => {
    say("Voice recognition is not supported in this browser. Try a supported browser.");
  });
}
