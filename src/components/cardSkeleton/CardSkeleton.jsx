import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./cardSkeleton.scss";

export default function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <div className="imageContainer">
        <Skeleton height={200} width="100%" baseColor="var(--bg-navbar)" />
      </div>
      <div className="textContainer">
        <Skeleton width="60%" height={20} baseColor="var(--bg-navbar)" />
        <Skeleton width="40%" height={20} baseColor="var(--bg-navbar)" />
        <Skeleton width="80%" height={15} baseColor="var(--bg-navbar)" />
        <Skeleton width="50%" height={15} baseColor="var(--bg-navbar)" />
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <Skeleton width={40} height={15} baseColor="var(--bg-navbar)" />
            </div>
            <div className="feature">
              <Skeleton width={40} height={15} baseColor="var(--bg-navbar)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
