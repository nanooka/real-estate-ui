import "./list.scss";
import Card from "../card/Card";
import { Link } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";

export default function List({ posts, editable = false }) {
  // const navigate = useNavigate();

  return (
    <div className="list">
      {posts.map((item) => (
        <div key={item.id} className="cardWrapper">
          <Card item={item} />
          {editable && (
            <Link
              to={`/post/update/${item.id}`}
              state={item}
              // onClick={() => navigate(`/post/update/${item.id}`)}
              className="editButton"
            >
              <BiSolidEditAlt />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
