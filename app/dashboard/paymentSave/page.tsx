"use client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import { MdSkipNext } from "react-icons/md";

interface Coordinates {
  lat: number;
  lng: number;
}

interface SavePaymentInfoResponse {
  sessionId?: string; // Use optional for clientSecret
  error?: string;
}

const PaymentSave = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userCoords);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleClickSkip = () => {
    router.push("/dashboard");
  };

  const handleClickContinue = async () => {
    if (session?.user?.email) {
      try {
        const response = await axios.post<SavePaymentInfoResponse>(
          "/api/create-checkout-session",
          {
            email: session.user.email,
          }
        );

        // Check if the response contains a sessionId
        if (response.data.sessionId) {
          const stripe = await loadStripe(
            process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
          );

          // Ensure stripe is not null before calling redirectToCheckout
          if (stripe) {
            const { error } = await stripe.redirectToCheckout({
              sessionId: response.data.sessionId, // Use sessionId here
            });

            if (error) {
              console.error("Error redirecting to Stripe:", error);
            }
          } else {
            console.error("Stripe.js failed to load.");
          }
        } else {
          console.error("No sessionId returned:", response.data.error);
        }
      } catch (error) {
        console.error("Error saving payment info:", error);
      }
    }
  };

  useEffect(() => {
    if (session?.user?.email && userLocation) {
      const saveUserEmailAndLocation = async () => {
        try {
          const response = await axios.post("/api/registre", {
            email: session.user?.email,
            lat: userLocation.lat,
            long: userLocation.lng,
          });
          console.log(
            "User email and location saved successfully:",
            response.data
          );
        } catch (error) {
          console.error("Error saving user email and location:", error);
        }
      };
      saveUserEmailAndLocation();
    }
  }, [session?.user?.email, userLocation]);

  return (
    <div
      id="payment-modal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Would you like to save your payment information?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Saving your payment details helps speed up future transactions.
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleClickSkip}
            className="flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-400 transition-all duration-200"
          >
            <MdSkipNext className="mr-2" size={18} />
            Skip
          </button>

          <button
            onClick={handleClickContinue}
            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200"
          >
            <FaCreditCard className="mr-2" size={18} />
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSave;
