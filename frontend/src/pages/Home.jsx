import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { BsPersonCheckFill } from "react-icons/bs";
import io from "socket.io-client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { IoSend } from "react-icons/io5";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const socket = io(apiUrl, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const Home = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [seenMessages, setSeenMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const addEmoji = (e) => {
    setMsg((prev) => prev + e.native);
    setShowPicker(false);
  };

  const sendMessage = () => {
    if (msg.trim()) {
      const newMsg = {
        text: msg,
        sender: user?.username || "Anonymous",
        _id: `${Date.now()}-${Math.random()}`, // Unique ID
      };
      socket.emit("sendMessage", newMsg);
      setMsg(""); // Clear input after sending
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    const handleReceive = (data) => {
      setMessages((prev) => [...prev, data]);

      // Send seen event if message is from others
      if (data.sender !== user?.username) {
        socket.emit("messageSeen", {
          messageId: data._id,
          from: data.sender,
          to: user?.username,
        });
      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [user]);

  useEffect(() => {
    socket.on("messageSeenAck", ({ messageId }) => {
      setSeenMessages((prev) => {
        if (!prev.includes(messageId)) {
          return [...prev, messageId];
        }
        return prev;
      });
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("messageSeenAck");
      socket.off("onlineUsers");
    };
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      socket.emit("userJoined", parsedUser.username);
      socket.emit("setUsername", parsedUser.username);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/users/logout`);
      localStorage.removeItem("user");
      toast.success("Logout Successful");
      navigate("/");
    } catch (err) {
      toast.error("Logout Failed");
    }
  };

  return (
    <div className="min-h-screen w-full max-w-xl mx-auto flex flex-col p-2 sm:p-4">
      <ToastContainer />
      {user ? (
        <>
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <img
              src="/images/wechat.png"
              alt="Logo"
              className="h-12 w-auto mx-auto sm:mx-0"
            />
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-blue-500">
                <BsPersonCheckFill /> {user.username}
              </h3>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600 transition text-lg"
              >
                Logout
              </button>
            </div>
          </header>

          {/* Online Users */}
          <section className="mb-6 p-4 bg-white rounded shadow w-full">
            <h4 className="font-semibold text-lg mb-2">Online Users:</h4>
            <ul className="list-disc list-inside text-blue-600 max-h-24 overflow-y-auto">
              {onlineUsers.length === 0 && (
                <li className="text-gray-500">No users online</li>
              )}
              {onlineUsers.map((user, idx) => (
                <li key={idx}>{user}</li>
              ))}
            </ul>
          </section>

          {/* Chat Section */}
          <section className="flex flex-col w-full flex-grow">
            <h2 className="text-lg font-bold text-blue-900 mb-2">Chat Room</h2>
            <div
              className="border border-blue-500 rounded-lg bg-blue-50 p-4 flex flex-col overflow-y-auto flex-grow mb-4"
              style={{ minHeight: "300px", maxHeight: "60vh" }}
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.length === 0 && (
                <p className="text-gray-500 text-center mt-auto mb-auto">
                  No messages yet.
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`my-1 flex ${
                    m.sender === user?.username
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div>
                    <strong className="block text-xs text-gray-600 font-mono tracking-wide mb-1">
                      {m.sender}
                    </strong>
                    <span
                      className={`px-4 py-3 rounded-lg block max-w-xs break-words whitespace-pre-wrap text-base ${
                        m.sender === user?.username
                          ? "bg-blue-400 text-white"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      {m.text}
                      {m.sender === user?.username &&
                        seenMessages.includes(m._id) && (
                          <span className="ml-2 text-xs text-white/70">
                            (seen)
                          </span>
                        )}
                    </span>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="relative flex gap-2 items-center w-full">
              <button
                onClick={() => setShowPicker(!showPicker)}
                type="button"
                aria-label="Toggle emoji picker"
                className="text-3xl p-3 rounded hover:bg-gray-200 transition"
              >
                😊
              </button>

              {showPicker && (
                <div className="absolute bottom-16 left-0 z-30 bg-white shadow-lg rounded p-2 w-72 max-w-full">
                  <div className="flex justify-end mb-1">
                    <button
                      onClick={() => setShowPicker(false)}
                      aria-label="Close emoji picker"
                      className="text-gray-500 hover:text-red-500 text-sm"
                    >
                      ✖️
                    </button>
                  </div>
                  <Picker data={data} onEmojiSelect={addEmoji} />
                </div>
              )}

              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                aria-label="Message input"
              />
              <button
                onClick={sendMessage}
                aria-label="Send message"
                className="text-4xl text-blue-900 hover:text-blue-700 transition p-2"
              >
                <IoSend />
              </button>
            </div>
          </section>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-20 text-lg">Loading...</p>
      )}
    </div>
  );
};

export default Home;
