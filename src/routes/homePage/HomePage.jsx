import { Suspense } from "react";
import "./homePage.scss";
import { Await, useLoaderData } from "react-router-dom";
import Card from "../../components/card/Card";
import Filter from "../../components/filter/Filter";
import CardSkeleton from "../../components/cardSkeleton/CardSkeleton";
import Spinner from "../../components/spinner/Spinner";
import { useState, useEffect } from "react";

export default function HomePage() {
  const data = useLoaderData();
  const [showLoadingMessage, setShowLoadingMessage] = useState(true);

  const skeletonCount = 4;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingMessage(false);
    }, 7000); // Show message after 3 seconds

    return () => clearTimeout(timer); // Cleanup if component unmounts
  }, []);

  return (
    <div className="homePage">
      <div className="coverContainer">
        <img src="/cover.jpg" alt="" />
        <h1>Find Your Dream House</h1>
        <div className="filterContainer">
          <Suspense fallback={<Spinner />}>
            <Filter />
          </Suspense>
        </div>
      </div>

      {showLoadingMessage && (
        <div className="loadingMessage">
          <p>
            ⏳ First load may take a few extra seconds — thanks for waiting!
          </p>
        </div>
      )}

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
