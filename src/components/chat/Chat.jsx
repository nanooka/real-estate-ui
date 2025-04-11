import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { IoIosSend } from "react-icons/io";
import { RiCloseLargeLine } from "react-icons/ri";

export default function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const [chatsState, setChatsState] = useState(chats);
  const { currentUser, token } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(false);

  console.log("chatsstate", chatsState);
  // console.log(currentUser);

  const messageEndRef = useRef();

  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest(`/chats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
        res.data.seenBy.push(currentUser.id);
      }
      setChat({ ...res.data, receiver });

      setChatsState((prevChats) =>
        prevChats.map((c) =>
          c.id === id ? { ...c, seenBy: [...c.seenBy, currentUser.id] } : c
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      const res = await apiRequest.post(
        `/messages/${chat.id}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();

      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });

      // setChatsState((prevChats) =>
      //   prevChats.map((c) =>
      //     c.id === chat.id ? { ...c, lastMessage: res.data.text } : c
      //   )
      // );
      setChatsState((prevChats) =>
        prevChats.map((c) => (c.id === chat.id ? c : c))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put(`/chat/read/${chat.id}`);
      } catch (err) {
        console.log(err);
      }
    };
    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [chat, socket]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chatsState?.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "var(--bg-message)"
                  : "rgba(44, 139, 139, 0.4)",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <div className="userInfo">
              <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
              <span>{c.receiver.username}</span>
            </div>
            {/* <div className="lastMessage">
              <span>
                {c.lastMessage[1] == c.receiver.id
                  ? c.receiver.username + ":"
                  : "you: "}
              </span>
              <p>{c.lastMessage[0]}</p>
            </div> */}
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              <RiCloseLargeLine />
            </span>
          </div>
          <div className="center">
            {chat.messages.map((message) => (
              <div
                key={message.id}
                className="chatMessage"
                style={{
                  // width: "auto",
                  // padding: "4px",
                  // borderRadius: "10px",
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
              >
                <p
                  key={message.id}
                  style={{
                    alignSelf:
                      message.userId === currentUser.id
                        ? "flex-end"
                        : "flex-start",
                    textAlign:
                      message.userId === currentUser.id ? "right" : "left",
                    backgroundColor:
                      message.userId === currentUser.id
                        ? "var(--primary-color)"
                        : "var(--border)",
                    color: message.userId === currentUser.id && "white",
                  }}
                >
                  {message.text}
                </p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea
              name="text"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.target.form.requestSubmit();
                }
              }}
            ></textarea>
            <button type="submit" disabled={isLoading}>
              <IoIosSend size={24} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
