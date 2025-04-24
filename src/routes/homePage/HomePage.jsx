import { Suspense } from "react";
import "./homePage.scss";
import { Await, useLoaderData } from "react-router-dom";
import Card from "../../components/card/Card";
import Filter from "../../components/filter/Filter";
import CardSkeleton from "../../components/cardSkeleton/CardSkeleton";
import Spinner from "../../components/spinner/Spinner";
import { useState, useEffect, useRef } from "react";
import Map from "../../components/map/Map";
import apiRequest from "../../lib/apiRequest";

export default function HomePage() {
  const data = useLoaderData();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showLoadingMessage, setShowLoadingMessage] = useState(true);
  const loaderRef = useRef(null);
  const observer = useRef(null);

  const skeletonCount = 4;

  // Load initial data from loader
  useEffect(() => {
    data.postResponse.then((res) => {
      setPosts(res.data.items);
      setHasMore(res.data.hasMore);
      setPage(2); // next page
    });
  }, [data]);

  // Infinite scroll effect
  useEffect(() => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMorePosts();
      }
    });

    if (loaderRef.current) {
      observer.current.observe(loaderRef.current);
    }

    return () => observer.current?.disconnect();
  }, [loaderRef.current, hasMore, loading]);

  const fetchMorePosts = async () => {
    setLoading(true);
    try {
      const res = await apiRequest.get(`/posts?page=${page}&limit=6`);

      // Filter out duplicates by ID
      setPosts((prev) => {
        const newPosts = res.data.items.filter(
          (newPost) => !prev.some((existing) => existing.id === newPost.id)
        );
        return [...prev, ...newPosts];
      });

      setHasMore(res.data.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to fetch more posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowLoadingMessage(false), 5000);
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

      <div className="mainContainer">
        <div className="listContainer">
          {!loading && posts.length === 0 ? (
            <p className="noResults">
              We couldn&apos;t find any properties based on your current
              criteria.
            </p>
          ) : (
            posts?.map((post) => <Card key={post.id} item={post} />)
          )}

          {loading && (
            <div className="skeletonWrapper">
              {Array.from({ length: skeletonCount })?.map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          )}
          <div ref={loaderRef} style={{ height: "1px" }}></div>
          {!hasMore && (
            <p className="noMore">🎉 You&apos;ve reached the end!</p>
          )}
        </div>

        <div className="mapContainer">
          <Suspense fallback={<Spinner />}>
            <Await resolve={data.postResponse}>
              {(postResponse) => <Map items={postResponse.data.items} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
