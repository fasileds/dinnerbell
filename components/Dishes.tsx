"use client";
import { useLandingContext } from "@/app/context/LandingContext";
import Dish from "./Dish";
import Loader from "./Loader";

function Dishes() {
  const { videos, userId } = useLandingContext();
  return (
    <section
      id="dishes"
      className="py-12 transition-all duration-300 bg-gray-100 "
    >
      <div className="container mx-auto text-center px-4">
        <h3 className="text-green-600 text-lg font-semibold mb-2">
          Our Dishes
        </h3>
        <h1 className="text-5xl font-bold text-gray-800 mb-8">
          Popular Dishes
        </h1>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 cursor-pointer">
          {videos.length === 0 ? (
            <Loader isLoading={true} />
          ) : (
            videos.map((item) => (
              <div key={item.id}>
                <Dish
                  customerId={item?.user?.customerId ?? null}
                  userId={userId ?? ""}
                  id={item.id}
                  videoUrl={item.videoUrl}
                  description={item.description}
                  price={item.price}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Dishes;
