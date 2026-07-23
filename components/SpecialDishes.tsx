"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import SpecialDish from "./SpecialDish";
import { useLandingContext } from "@/app/context/LandingContext"; // Import the custom hook

type MainProps = {
  id: string;
};

interface Video {
  id: string;
  videoUrl: string;
  description: string;
  user: { customerId: string; id: string };
  price: number;
  restorant: object;
}

function SpecialDishes({ id }: MainProps) {
  const { userId, setUserId } = useLandingContext(); // Use the hook to access context
  const [loading, setLoading] = useState(true);
  const [singleVideoData, setSingleVideoData] = useState<Video | null>(null);

  useEffect(() => {
    const getSingleVideo = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Video>(`/api/Video/getSingleVideo/${id}`);
        setSingleVideoData(res.data);
        console.log("the response part is here", res.data);
      } catch (error) {
        console.error("Error fetching single video:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getSingleVideo();
    }
  }, [id]);

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  if (!singleVideoData) {
    return <p>No video found</p>;
  }

  const {
    videoUrl,
    description,
    price,
    id: videoId,
    user,
    restorant,
  } = singleVideoData;
  console.log("Single video data:", singleVideoData);
  console.log("User's Customer ID:", user?.id);
  setUserId(user?.id);
  return (
    <section
      className="w-full py-3 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-100 to-green-50"
      id="home"
    >
      <div className="relative z-10 max-w-7xl mx-auto p-8 bg-white shadow-xl rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <SpecialDish
            videoUrl={videoUrl}
            description={description}
            price={price}
            id={videoId}
            location="addis abeba"
            customerId={user?.customerId}
            restorant={singleVideoData.restorant}
          />
        </div>
      </div>
    </section>
  );
}

export default SpecialDishes;
