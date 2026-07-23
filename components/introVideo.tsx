"use client";
import React, { useState } from "react";

export default function IntroVideo() {
  const [showVideo, setShowVideo] = useState(true);

  const handleSkip = () => {
    setShowVideo(false);
  };
  return (
    showVideo && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md">
        <div className="relative w-[320px] h-[570px]">
          <div className="absolute top-2 left-2 z-10 transform origin-top animate-ring">
            <img
              className="h-12 w-12 object-contain cursor-pointer transition-transform duration-300 hover:scale-110"
              src="/bell1.png"
              alt="Notification Bell"
            />
          </div>
          <iframe
            className="w-full h-full rounded-xl shadow-lg"
            src="https://www.youtube.com/embed/XF4P6ufppGE?autoplay=1&controls=0&modestbranding=1&showinfo=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <button
          className="absolute top-6 right-6 bg-red-600 text-white px-5 py-2 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 hover:bg-red-700 focus:outline-none"
          onClick={handleSkip}
        >
          Skip
        </button>
      </div>
    )
  );
}
