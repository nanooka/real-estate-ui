import { Suspense } from "react";
import "./homePage.scss";
import { Await, useLoaderData } from "react-router-dom";
import Card from "../../components/card/Card";
import Filter from "../../components/filter/Filter";

export default function HomePage() {
  const data = useLoaderData();
  console.log("homePage", data);

  return (
    <div className="homePage">
      <div className="coverContainer">
        <img src="/cover.jpg" alt="" />
        <h1>Find Your Dream House</h1>
        <div className="filterContainer">
          <Filter />
        </div>
      </div>
      <div className="wrapper">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading posts</p>}
          >
            {(postResponse) =>
              postResponse.data.map((post) => (
                <Card key={post.id} item={post} />
              ))
            }
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
