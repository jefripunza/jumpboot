let socket;
try {
  socket = io("https://websocket.jefripunza.repl.co/chat");
} catch (error) {
  userNotificationNegative("server disconnect, please refresh...");
}
const socket_event = {
  error: "error",
  connect: "connect",
  user_ip: "user ip",
  join: "chat join",
  out: "chat out",
  message: "chat message",
};
const sendMessageOnServer = (message) => {
  socket.emit(socket_event.message, {
    id: socket.id,
    message,
  });
};

const lorem_ipsum =
  "Lorem ipsum dolor sit amet. Praesentium magnam consectetur vel in deserunt aspernatur est reprehenderit sunt hic. Nulla tempora soluta ea et odio, unde doloremque repellendus iure, iste.";

function replaceURLWithHTMLLinks(text) {
  const exp =
    /(\b(http|ftp|https):\/\/([\w-]+\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?)/gi;
  return text.replace(exp, `<a href="$1" target="_blank">$3</a>`);
}

const delay = async (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

let audio;
const play = (mp3_path, volume = 0.2) => {
  audio = new Audio(mp3_path);
  audio.volume = volume;
  audio.play();
};
const notification = {
  normal: () => {
    play("http://localhost:5500/assets/sound/get-message.mp3");
  },
  mention: () => {
    play("http://localhost:5500/assets/sound/get-mention-message.mp3");
  },
};

// ---------------------------------------------------------------------------------

const addContribution = (user) => {
  const chip = document.createElement("div");
  chip.className = "chip";
  chip.style.cursor = "pointer";
  chip.onclick = () => {
    // redirect to github
    window.open(`https://github.com/${user.url}`, "_blank").focus();
  };
  const content = document.createElement("div");
  content.className = "chip-content";
  content.innerText = user.name;
  chip.appendChild(content);
  document.getElementById("chip-list").appendChild(chip);
};

// ---------------------------------------------------------------------------------

const addDetailFolder = (detail_folder) => {
  const div = document.createElement("div");
  div.className = "w3-container";
  const h5 = document.createElement("h5");
  h5.className = "w3-opacity";
  const b = document.createElement("b");
  b.innerText = detail_folder.title;
  h5.appendChild(b);
  div.appendChild(h5);
  const p = document.createElement("p");
  p.innerHTML =
    detail_folder.content === "lorem_ipsum"
      ? lorem_ipsum
      : detail_folder.content;
  div.appendChild(p);
  const hr = document.createElement("hr");
  div.appendChild(hr);
  document.getElementById("detail-folder-list").appendChild(div);
};

// ---------------------------------------------------------------------------------

const userNotificationPositive = (message) => {
  const user = document.createElement("div");
  user.className = "chat-join";
  user.innerHTML = message;
  document.getElementById("chat-list").appendChild(user);
};
const userNotificationNegative = (message) => {
  const user = document.createElement("div");
  user.className = "chat-leave";
  user.innerHTML = message;
  document.getElementById("chat-list").appendChild(user);
};

// ---------------------------------------------------------------------------------

const newChat = (user, isOpponent = false) => {
  const chat = document.createElement("div");
  if (isOpponent) {
    chat.className = "chat";
    const user_ip = document.createElement("div");
    user_ip.className = "chat-ip";
    user_ip.innerText = user.ip;
    chat.appendChild(user_ip);
    const message = document.createElement("text");
    message.innerText = user.message;
    chat.appendChild(message);
    // play sound
    if (String(user.message).includes(`${my_ip}`)) {
      notification.mention();
    } else {
      notification.normal();
    }
  } else {
    chat.className = "chat chat-me";
    chat.innerHTML = replaceURLWithHTMLLinks(user.message);
  }
  document.getElementById("chat-list").appendChild(chat);
  clearChatValue();
};
const getChatValue = () => {
  return document.getElementById("chat-message").value;
};
let autoScroll = true;
const clearChatValue = () => {
  document.getElementById("chat-message").value = "";
  if (autoScroll) {
    scrollToBottom();
  }
};

let timeout_scroll;
const scrollToBottom = () => {
  clearTimeout(timeout_scroll);
  timeout_scroll = setTimeout(() => {
    const chatList = document.getElementById("chat-list");
    chatList.scrollTo({
      left: 0,
      top: chatList.scrollHeight,
      behavior: "smooth",
    });
  }, 100);
};

// ---------------------------------------------------------------------------------
// --> main content

let my_ip;
window.onload = async () => {
  // list all contribution
  contribution.forEach((user) => {
    addContribution(user);
  });

  // list all detail folder
  detail_folder.forEach((detail) => {
    addDetailFolder(detail);
  });

  // ----------------------------------------------------------------------------
  // --> event form chat
  document.getElementById("chat-message").addEventListener("keypress", (e) => {
    // If the user presses the "Enter" key on the keyboard
    if (e.key === "Enter") {
      // Cancel the default action, if needed
      e.preventDefault();
      if (String(e.target.value).length > 0) {
        sendMessageOnServer(e.target.value);
        newChat({ message: e.target.value });
      }
    }
  });
  document.getElementById("auto-scroll").addEventListener("change", (e) => {
    const { checked } = e.target;
    autoScroll = checked;
  });
  document.getElementById("chat-button").addEventListener("click", (e) => {
    const value = getChatValue();
    if (String(value).length > 0) {
      sendMessageOnServer(value);
      newChat({ message: value });
    }
  });

  // ----------------------------------------------------------------------------
  // --> event websocket
  socket.on(socket_event.user_ip, (ip) => {
    // console.log({ ip });
    my_ip = ip;
  });
  socket.on(socket_event.error, () => {
    userNotificationNegative("server disconnect...");
  });
  socket.on(socket_event.connect, () => {
    // console.log({ socket });
    userNotificationPositive("you're join on chat now!");
  });
  socket.on(socket_event.join, (ip) => {
    userNotificationPositive(`${ip} join on chat!`);
  });
  socket.on(socket_event.out, (ip) => {
    userNotificationNegative(`${ip} leave on chat!`);
  });
  socket.on(socket_event.message, (user) => {
    // console.log({ user });
    if (socket.id === user.id) {
      newChat({ message: user.message });
    } else {
      newChat(user, true);
    }
  });
};
