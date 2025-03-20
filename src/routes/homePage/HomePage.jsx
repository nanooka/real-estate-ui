import { Suspense } from "react";
import "./homePage.scss";
import { Await, useLoaderData } from "react-router-dom";
import Card from "../../components/card/Card";
import Filter from "../../components/filter/Filter";
import CardSkeleton from "../../components/cardSkeleton/CardSkeleton";

export default function HomePage() {
  const data = useLoaderData();

  const skeletonCount = 4;

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
        <Suspense
          fallback={
            <div className="skeletonWrapper">
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          }
        >
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
