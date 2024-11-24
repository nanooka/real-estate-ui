import { Suspense } from "react";
import "./homePage.scss";
import { Await, useLoaderData } from "react-router-dom";
import Card from "../../components/card/Card";
import NewFilter from "../../components/newFilter/NewFilter";

export default function HomePage() {
  const data = useLoaderData();
  console.log(data);

  return (
    <div className="homePage">
      <div className="coverContainer">
        <img src="/cover.jpg" alt="" />
        <h1>Find Your Dream House</h1>
        <div className="filterContainer">
          <NewFilter />
        </div>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <Await
          resolve={data.postResponse}
          errorElement={<p>Error loading posts</p>}
        >
          {(postResponse) =>
            postResponse.data.map((post) => <Card key={post.id} item={post} />)
          }
        </Await>
      </Suspense>
    </div>
  );
}
