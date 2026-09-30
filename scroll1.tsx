import { useEffect, useRef, useState } from "react";

export default function PageScroll() {
  const [currentPage, setCurrentPage] = useState(0);
  const isScrolling = useRef(false);

  const pages = ["Page 1", "Page 2", "Page 3", "Page 4"];

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Prevent multiple pages from changing from one wheel gesture
      if (isScrolling.current) return;

      isScrolling.current = true;

      setCurrentPage((prev) => {
        if (e.deltaY > 0) {
          // Scroll down
          return Math.min(prev + 1, pages.length - 1);
        } else {
          // Scroll up
          return Math.max(prev - 1, 0);
        }
      });

      // Lock scrolling temporarily
      setTimeout(() => {
        isScrolling.current = false;
      }, 700);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [pages.length]);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          transform: `translateY(-${currentPage * 100}vh)`,
          transition: "transform 700ms ease",
        }}
      >
        {pages.map((page, index) => (
          <div
            key={index}
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "50px",
            }}
          >
            {page}
          </div>
        ))}
      </div>
    </div>
  );
}
