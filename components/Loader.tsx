"use client";
import { useEffect, useState } from "react";

interface LoaderProps {
  isLoading: boolean; // Prop to control the loader visibility
}

function Loader({ isLoading }: LoaderProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Start fade-out transition when isLoading becomes false
      const timeoutId = setTimeout(() => setFadeOut(true), 1000); // 1-second fade-out duration
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);

  if (!isLoading && fadeOut) {
    // Completely hide the loader after fade-out
    return null;
  }

  return (
    <div
      className={`loader fixed top-0 left-0 h-full w-full z-50 bg-white flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${
        !isLoading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex items-center">
        {/* Animated Bell Icon */}
        <div className="text-6xl transform origin-top animate-ring">
          <img
            className="h-16 w-16 object-contain cursor-pointer transition-transform duration-200 hover:scale-110"
            src="/bell1.png"
            alt="Notification Bell"
          />
        </div>
        <div className="ml-4 text-2xl font-semibold text-gray-700">
          Loading...
        </div>
      </div>
    </div>
  );
}

export default Loader;
