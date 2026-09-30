import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import lottie from "lottie-web";
import "./style.css";

export default function LandPage() {
  const lottieRef = useRef(null);
  const navigate = useNavigate();
  const navigationStarted = useRef(false);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "https://lottie.host/ca4128a7-4d1f-49ad-9bc3-d8b4341927dd/ui0GelQZNb.json",
    });
  
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll <= 0) return;

      const progress = window.scrollY / maxScroll;

      const frame =
        progress * (animation.totalFrames - 1);

      animation.goToAndStop(frame, true);

      if (progress >= 0.7 ) {
        //navigationStarted.current = true;
        setTimeout(() => {
          navigate("/next");
        }, 500);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      animation.destroy();
    };
  }, [navigate]);

  return (
    <div className="div2">
      <div className="animation">

        <h1>Interactive Lottie Animation</h1>

        <div
          id="lottie-container"
          ref={lottieRef}
        />

        <button id="btn">
          Continue
        </button>

      </div>
    </div>
  );
}
