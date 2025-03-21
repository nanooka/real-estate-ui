import "./listPage.scss";
// import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import CardSkeleton from "../../components/cardSkeleton/CardSkeleton";
import Spinner from "../../components/Spinner/Spinner";

export default function ListPage() {
  const data = useLoaderData();
  // const [searchParams] = useSearchParams();

  const skeletonCount = 4;

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          {/* <Filter /> */}
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
