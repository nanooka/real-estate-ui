import "./profilePage.scss";
import List from "../../components/list/List";
import Chat from "../../components/chat/Chat";
import { Await, Link, useLoaderData } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import CardSkeleton from "../../components/cardSkeleton/CardSkeleton";
import Spinner from "../../components/spinner/Spinner";

export default function ProfilePage() {
  const data = useLoaderData();
  // console.log("data.postResponse.data", data.postResponse._data);

  const { currentUser } = useContext(AuthContext);
  // console.log("ProfilePage", currentUser);

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              Email: <b>{currentUser.email}</b>
            </span>
            <span>
              Phone Number: <b>{currentUser.phone}</b>
            </span>
          </div>
          <div className="title">
            <h1>My Posts</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>

          <Suspense fallback={<CardSkeleton />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts</p>}
            >
              {(postResponse) =>
                postResponse.data.userPosts.length > 0 ? (
                  <List posts={postResponse.data.userPosts} />
                ) : (
                  <p>You haven’t added any listings. Let’s get started!</p>
                )
              }
            </Await>
          </Suspense>

          <div className="title">
            <h1>Saved Posts</h1>
          </div>
          <Suspense fallback={<CardSkeleton />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts</p>}
            >
              {(postResponse) =>
                postResponse.data.savedPosts.length > 0 ? (
                  <List posts={postResponse.data.savedPosts} />
                ) : (
                  <p>Saved posts will appear here. Go explore!</p>
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<Spinner />}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
