import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../../components/card/Card";
import "./user.scss";
import apiRequest from "../../lib/apiRequest";
import { Link } from "react-router-dom";
import { IoCallOutline } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";

export default function User() {
  const { userId } = useParams();
  const location = useLocation();

  const [user, setUser] = useState(location.state?.user || null);
  const [posts, setPosts] = useState(location.state?.user.posts || []);
  const [loading, setLoading] = useState(!location.state);

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

  if (loading) return <p>Loading...</p>;

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
          <button>
            <BiMessageDetail size={24} color="var(--primary-color)" />
            <span>Send a Message</span>
          </button>
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
    </div>
  );
}
