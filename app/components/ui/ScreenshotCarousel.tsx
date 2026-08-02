"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Icon from "@/app/components/ui/Icon";

type Screenshot = {
  src: string;
  alt: string;
};

export default function ScreenshotCarousel({
  screenshots,
  projectName,
}: {
  screenshots: readonly Screenshot[];
  projectName: string;
}) {
  const [current, setCurrent] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay || screenshots.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % screenshots.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoplay, screenshots.length]);

  if (screenshots.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrent((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1
    );
    setIsAutoplay(false);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % screenshots.length);
    setIsAutoplay(false);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    setIsAutoplay(false);
  };

  return (
    <div className="screenshot-carousel">
      {/* Main image display */}
      <div className="carousel-viewport">
        <div className="carousel-track" style={{ transform: `translateX(calc(-${current * 100}%))` }}>
          {screenshots.map((screenshot, index) => (
            <div key={index} className="carousel-slide">
              <Image
                src={screenshot.src}
                alt={screenshot.alt}
                width={540}
                height={1080}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="screenshot-image"
              />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="carousel-nav carousel-nav-prev"
              aria-label={`Previous screenshot for ${projectName}`}
            >
              <Icon name="arrow-left" size={18} />
            </button>
            <button
              onClick={goToNext}
              className="carousel-nav carousel-nav-next"
              aria-label={`Next screenshot for ${projectName}`}
            >
              <Icon name="arrow-right" size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail indicators */}
      {screenshots.length > 1 && (
        <div className="carousel-indicators">
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-indicator ${index === current ? "active" : ""}`}
              aria-label={`Go to screenshot ${index + 1}`}
              aria-current={index === current}
            >
              <Image
                src={screenshot.src}
                alt=""
                width={80}
                height={160}
                className="indicator-thumb"
              />
            </button>
          ))}
        </div>
      )}

      {/* Slide counter */}
      {screenshots.length > 1 && (
        <div className="carousel-counter" aria-live="polite">
          {current + 1} / {screenshots.length}
        </div>
      )}
    </div>
  );
}
