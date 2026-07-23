"use client";
import { useState } from "react";
import classNames from "classnames";

interface StarRatingProps {
  min?: number;
  max?: number;
  value: number;
}

function StarRating({ min = 0, max = 5, value }: StarRatingProps) {
  const [rating, setRating] = useState(value);
  const [hover, setHover] = useState(min);

  return (
    <div className="py-4 transition-all">
      {[...Array(max)].map((star, index) => {
        const ratingValue = index + 1;
        const isRated = hover >= ratingValue || rating >= ratingValue; // Evaluate separately
        return (
          <span
            key={index}
            data-value={ratingValue}
            className={classNames(
              "fas fa-star text-2xl cursor-pointer transition-colors duration-300",
              {
                "text-gray-500": !isRated, // Use isRated for the conditional
                "text-green-500": isRated, // Use isRated for the conditional
              }
            )}
            onClick={() => setRating(ratingValue)}
            onMouseOver={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(min)}
          />
        );
      })}
    </div>
  );
}

export default StarRating;
