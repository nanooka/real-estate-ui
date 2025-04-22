import { useEffect, useState } from "react";
import "./slider.scss";
import { RiCloseLargeLine } from "react-icons/ri";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import Skeleton from "react-loading-skeleton";

export default function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [direction, setDirection] = useState(null);

  const changeSlide = (direction) => {
    setDirection(direction);

    if (direction === "left") {
      if (imageIndex === 0) {
        setImageIndex(images.length - 1);
      } else {
        setImageIndex(imageIndex - 1);
      }
    } else {
      if (imageIndex === images.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }
  };

  useEffect(() => {
    if (imageIndex !== null) {
      document.body.style.overflowY = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "ArrowLeft") {
          changeSlide("left");
        } else if (e.key === "ArrowRight") {
          changeSlide("right");
        } else if (e.key === "Escape") {
          setImageIndex(null);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflowY = "auto";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageIndex]);

  useEffect(() => {
    // Reset direction after animation duration (400ms)
    const timer = setTimeout(() => {
      setDirection(null);
    }, 400);

    return () => clearTimeout(timer); // Clean up timeout
  }, [direction]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const threshold = 50;

    if (distance > threshold) {
      changeSlide("right");
    } else if (distance < -threshold) {
      changeSlide("left");
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className="slider">
      {imageIndex !== null && (
        <div
          className="fullSlider"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="arrow" onClick={() => changeSlide("left")}>
            <MdOutlineKeyboardArrowLeft className="arrowIcon" />
          </div>
          <div className={`imgContainer ${direction}`}>
            <img src={images[imageIndex]} alt="" />
          </div>
          <div className="arrow" onClick={() => changeSlide("right")}>
            <MdOutlineKeyboardArrowRight className="arrowIcon" />
          </div>
          <div className="close" onClick={() => setImageIndex(null)}>
            <RiCloseLargeLine />
          </div>
        </div>
      )}
      <div className="bigImage">
        {loading && <Skeleton height="100%" />}
        <img
          src={images[0]}
          alt=""
          onClick={() => setImageIndex(0)}
          onLoad={() => setLoading(false)}
          style={{ display: loading ? "none" : "block" }}
        />
      </div>
      <div className="smallImages">
        {images
          .slice(1, 4)
          .map((image, index) =>
            loading ? (
              <Skeleton key={index} height={100} />
            ) : (
              <img
                src={image}
                alt=""
                key={index}
                onClick={() => setImageIndex(index + 1)}
                onLoad={() => setLoading(false)}
                style={{ display: loading ? "none" : "block" }}
              />
            )
          )}

        {images.length > 4 && (
          <div className="extraImages" onClick={() => setImageIndex(3)}>
            +{images.length - 4} more
          </div>
        )}
      </div>
    </div>
  );
}
