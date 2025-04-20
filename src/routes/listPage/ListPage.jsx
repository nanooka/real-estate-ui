import "./listPage.scss";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import CardSkeleton from "../../components/cardSkeleton/CardSkeleton";
import Spinner from "../../components/spinner/Spinner";

export default function ListPage() {
  const data = useLoaderData();
  const skeletonCount = 4;

  return (
    <div className="listPage">
      <div className="listContainer">
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
        </div>
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
  );
}
