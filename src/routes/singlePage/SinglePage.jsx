import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { formatWithSpaces } from "../../lib/formatPrice";
import { IoIosSend } from "react-icons/io";
import { IoCallOutline, IoCopyOutline } from "react-icons/io5";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { MdDone } from "react-icons/md";

function SinglePage() {
  const post = useLoaderData();
  const { currentUser } = useContext(AuthContext);
  const [saved, setSaved] = useState(post?.isSaved || false);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
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

  const handleCopy = (number) => {
    navigator.clipboard
      .writeText(number)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy number: ", err);
      });
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

      // alert("Message sent!");
      // setMessage("");
      // setShowChat(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
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
              {/* <div className="post"> */}
              <h1>{post.title}</h1>
              {/* <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div> */}
              {/* <div className="price">$ {post.price}</div> */}
              {/* </div> */}
              {/* <div className="user">
                <img src={post.user.avatar || "/noavatar.jpg"} alt="" />
                <span>{post.user.username}</span>
              </div> */}
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
          <div className="top">
            <div className="price">
              <p>$ {formatWithSpaces(post.price)}</p>
              <span>
                1 m² - $ {formatWithSpaces(Math.floor(post.price / post.area))}
              </span>
            </div>
            <button onClick={handleSave} className="saveBtn">
              {/* <img src="/save.png" alt="" /> */}
              {saved ? (
                <FaBookmark color="teal" size={32} />
              ) : (
                <FaRegBookmark color="teal" size={32} />
              )}

              {/* {saved ? "Place is Saved" : "Save the Place"} */}
              {/* {saved ? "Unsave" : "Save"} */}
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

          {/* <div
            className="phoneNumber"
            onClick={() => handleCopy(post.user.phone)}
          >
            <IoCallOutline size={24} color="teal" />
            <span>{post.user.phone}</span>
          </div> */}

          <div className="phoneNumber">
            <Link to={`tel:${post.user.phone}`}>
              <IoCallOutline size={24} color="teal" />
              <span>{post.user.phone}</span>
            </Link>
            <button
              onClick={() => handleCopy(post.user.phone)}
              className="copyButton"
            >
              <IoCopyOutline size={24} />
            </button>
            <span
              style={{
                opacity: copied ? 1 : 0,
                visibility: copied ? "visible" : "hidden",
                transition:
                  "opacity 0.5s ease-in-out, visibility 0.5s ease-in-out",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                color: "#888",
              }}
            >
              <MdDone />
              Copied!
            </span>
          </div>

          <div className="buttons">
            <button onClick={handleOpenChat}>
              {/* <img src="/chat.png" alt="" />
               */}
              <BiMessageDetail size={24} color="teal" />
              <span>Send a Message</span>
            </button>
            {/* <button
              onClick={handleSave}
              style={{ backgroundColor: saved ? "#fece51" : "white" }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Unsave" : "Save"}
            </button> */}

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
                      X
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
                          e.preventDefault(); // Prevents new line
                          handleSendMessage();
                        }
                      }}
                    />
                    {/* <button className="sendButton" onClick={handleSendMessage}> */}
                    <IoIosSend
                      onClick={handleSendMessage}
                      className="sendButton"
                      style={{
                        visibility: message ? "visible" : "hidden",
                      }}
                    />
                    {/* </button> */}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
