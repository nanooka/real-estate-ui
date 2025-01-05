import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useLoaderData, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { formatWithSpaces } from "../../lib/formatPrice";
import { IoIosSend } from "react-icons/io";

function SinglePage() {
  const post = useLoaderData();
  const { currentUser } = useContext(AuthContext);
  const [saved, setSaved] = useState(post?.isSaved || false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  // console.log(post);
  console.log(post);

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
      // Create a chat or send a message
      const chatResponse = await apiRequest.post("/chats", {
        receiverId: post.userId, // Receiver is the post owner
      });

      const chatId = chatResponse.data.id;

      await apiRequest.post(`/messages/${chatId}`, {
        text: message,
      });

      alert("Message sent!");
      setMessage("");
      setShowChat(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                {/* <div className="price">$ {post.price}</div> */}
              </div>
              <div className="user">
                <img src={post.user.avatar || "/noavatar.jpg"} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          {/* <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tentant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                <p>{post.postDetail.pet}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div> */}
          <div className="price">$ {formatWithSpaces(post.price)}</div>
          <p className="title">Sizes</p>
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
          {/* <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>
                  {post.postDetail.bus > 999
                    ? post.postDetail.bus / 1000 + "km"
                    : post.postDetail.bus + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>
                  {post.postDetail.restaurant > 999
                    ? post.postDetail.restaurant / 1000 + "km"
                    : post.postDetail.restaurant + "m"}{" "}
                  away
                </p>
              </div>
            </div>
          </div> */}
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button onClick={handleOpenChat}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{ backgroundColor: saved ? "#fece51" : "white" }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place is Saved" : "Save the Place"}
            </button>
          </div>
          {showChat && (
            <div className="chatPopup">
              <div>
                <div className="popupContentTop">
                  <h3>Send a Message</h3>
                  <button onClick={() => setShowChat(false)}>X</button>
                </div>
                <div className="popupContentBottom">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                  />
                  {/* <button className="sendButton" onClick={handleSendMessage}> */}
                  <IoIosSend
                    onClick={handleSendMessage}
                    className="sendButton"
                    style={{
                      color: message ? "teal" : "#ccc",
                      cursor: message && "pointer",
                    }}
                  />
                  {/* </button> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
