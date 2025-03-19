import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import apiRequest from "../../lib/apiRequest";
import { formatWithSpaces } from "../../lib/formatPrice";
import { IoIosSend } from "react-icons/io";
import { IoCallOutline } from "react-icons/io5";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { RiCloseLargeLine } from "react-icons/ri";

function SinglePage() {
  const post = useLoaderData();
  const { currentUser } = useContext(AuthContext);
  const [saved, setSaved] = useState(post?.isSaved || false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/${post.id}` } });
      return;
    }

    setSaved((prev) => !prev);
    console.log(typeof post.id, typeof currentUser?.id);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleOpenChat = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/${post.id}` } });
      return;
    }
    setShowChat(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    try {
      setMessage("");
      setShowChat(false);
      const chatResponse = await apiRequest.post("/chats", {
        receiverId: post.userId,
      });

      const chatId = chatResponse.data.id;

      await apiRequest.post(`/messages/${chatId}`, {
        text: message,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    }
  };

  console.log(post.price, post.area);

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <h1>{post.title}</h1>
              <div className="sizes">
                <div className="size">
                  <img src="/size.png" alt="" />
                  <span>{post.area} m²</span>
                </div>
                <div className="size">
                  <img src="/bed.png" alt="" />
                  <span>
                    {post.bedroom > 1
                      ? post.bedroom + " beds"
                      : post.bedroom + " bed"}
                  </span>
                </div>
                <div className="size">
                  <img src="/bath.png" alt="" />
                  <span>
                    {post.bathroom > 1
                      ? post.bathroom + " bathrooms"
                      : post.bathroom + " bathroom"}
                  </span>
                </div>
              </div>
            </div>
            <div className="bottom">{post.desc}</div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <div className="top">
            <div className="price">
              <p>$ {formatWithSpaces(post.price)}</p>
              <span>
                1 m² - $ {formatWithSpaces(Math.floor(post.price / post.area))}
              </span>
            </div>
            <button onClick={handleSave} className="saveBtn">
              {saved ? (
                <FaBookmark color="teal" size={32} />
              ) : (
                <FaRegBookmark color="teal" size={32} />
              )}
            </button>
          </div>
          <div className="address">
            <img src="/pin.png" alt="" />
            <span>{post.address}</span>
          </div>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>

          <div className="user">
            <img src={post.user.avatar || "/noavatar.jpg"} alt="" />
            <div>
              <span>{post.user.username}</span>
              <span>total posts - {post.user.posts.length}</span>
            </div>
          </div>

          <div className="phoneNumber">
            <Link to={`tel:${post.user.phone}`}>
              <IoCallOutline size={24} color="teal" />
              <span>{post.user.phone}</span>
            </Link>
          </div>

          <div className="buttons">
            <button onClick={handleOpenChat}>
              <BiMessageDetail size={24} color="teal" />
              <span>Send a Message</span>
            </button>

            {showChat && (
              <div className="chatPopup">
                <div>
                  <div className="popupContentTop">
                    <h3>Send a Message</h3>
                    <button
                      onClick={() => {
                        setShowChat(false);
                        setMessage("");
                      }}
                    >
                      <RiCloseLargeLine />
                    </button>
                  </div>
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
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
}

export default SinglePage;
