import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Card from "../../components/card/Card";
import "./user.scss";
import apiRequest from "../../lib/apiRequest";
import { Link } from "react-router-dom";
import { IoCallOutline } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";
import { IoIosSend } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import { RiCloseLargeLine } from "react-icons/ri";
import CardSkeleton from "../../components/cardSkeleton/CardSkeleton";

export default function User() {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(location.state?.user || null);
  const [posts, setPosts] = useState(location.state?.user.posts || []);
  const [loading, setLoading] = useState(!location.state);
  const [message, setMessage] = useState("");
  const { currentUser, token } = useContext(AuthContext);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!location.state) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const res = await apiRequest.get(`/users/search/${userId}`);
          setUser(res.data);
          setPosts(res.data.posts);
        } catch (err) {
          console.error("Failed to fetch user", err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId, location.state]);

  if (loading)
    return (
      <div className="skeletonWrapper">
        {Array.from({ length: 2 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    try {
      setMessage("");
      setShowChat(false);
      const chatResponse = await apiRequest.post(
        "/chats",
        {
          receiverId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("chatResponse", chatResponse.data);

      const chatId = chatResponse.data.id;

      await apiRequest.post(
        `/messages/${chatId}`,
        { text: message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    }
  };

  const handleOpenChat = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/user/${userId}` } });
      return;
    }
    setShowChat(true);
  };

  return (
    <div className="userPage">
      <div className="userPageHeader">
        <div className="userInfo">
          <img src={user.avatar || "/noavatar.jpg"} alt="" />
          <div>
            <p>{user.username}</p>
            <span>total posts - {user.posts.length}</span>
          </div>
        </div>
        <div className="phoneNumber">
          <Link to={`tel:${user.phone}`}>
            <IoCallOutline size={24} color="var(--primary-color)" />
            <span>{user.phone}</span>
          </Link>
        </div>

        <div className="messageDiv">
          <button onClick={handleOpenChat}>
            <BiMessageDetail size={24} color="var(--primary-color)" />
            <span>Send a Message</span>
          </button>
          {showChat && (
            <div className="chatPopup">
              <div>
                {/* <div className="popupContentTop">
                  <h3>Send a Message</h3> */}
                <button
                  className="closeButton"
                  onClick={() => {
                    setShowChat(false);
                    setMessage("");
                  }}
                >
                  <RiCloseLargeLine />
                </button>
                {/* </div> */}
                <form
                  className="popupContentBottom"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <textarea
                    autoFocus
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <IoIosSend
                    onClick={handleSendMessage}
                    className="sendButton"
                    style={{
                      visibility: message ? "visible" : "hidden",
                    }}
                  />
                </form>
              </div>
            </div>
          )}
          {/* <div>
            <form
              className="popupContentBottom"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <textarea
                autoFocus
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <IoIosSend
                onClick={handleSendMessage}
                className="sendButton"
                style={{
                  visibility: message ? "visible" : "hidden",
                }}
              />
            </form>
          </div> */}
        </div>
      </div>

      <h2>
        Listings by <span className="username">{user?.username}</span>
      </h2>

      <div className="user-posts">
        {posts.map((post) => (
          <Card key={post.id} item={post} />
        ))}
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
}
