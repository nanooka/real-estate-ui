import { Suspense } from "react";
import "./homePage.scss";
import { Await, useLoaderData } from "react-router-dom";
import Card from "../../components/card/Card";
import Filter from "../../components/filter/Filter";
import CardSkeleton from "../../components/cardSkeleton/CardSkeleton";
import Spinner from "../../components/spinner/Spinner";
import { useState, useEffect } from "react";
import Map from "../../components/map/Map";

export default function HomePage() {
  const data = useLoaderData();
  const [showLoadingMessage, setShowLoadingMessage] = useState(true);

  const skeletonCount = 4;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingMessage(false);
    }, 5000);

    return () => clearTimeout(timer);
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

      {/* <div className="wrapper">
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
      </div> */}

      <div className="mainContainer">
        <div className="listContainer">
          {/* <div className="wrapper"> */}
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
                postResponse.data.length === 0 ? (
                  <p className="noResults">
                    We couldn&apos;t find any properties based on your current
                    criteria.
                  </p>
                ) : (
                  postResponse.data.map((post) => (
                    <Card key={post.id} item={post} />
                  ))
                )
              }
            </Await>
          </Suspense>
          {/* </div> */}
        </div>
        <div className="mapContainer">
          <Suspense fallback={<Spinner />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <Map items={postResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
