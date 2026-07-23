"use client";
import { lusitana } from "@/app/ui/fonts";

export default function AcmeLogo() {
  const playSound = () => {
    const audio = new Audio("/bellSound.mp3");
    audio
      .play()
      .then(() => console.log("Sound played successfully!"))
      .catch((error) => console.error("Error playing sound:", error));
  };

  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <p className="text-[20px]">Local Service Advertisement</p>
      <div className="flex justify-center items-center w-20 h-15 group">
        <div className="text-5xl transform origin-top transition-transform duration-200 group-hover:animate-[ring_1s_ease-in-out_infinite]">
          <img
            className="h-16 w-16 object-contain cursor-pointer group-hover:scale-110"
            src="/bell1.png"
            alt="Notification Bell"
            onMouseEnter={playSound}
          />
        </div>
      </div>
    </div>
  );
}
