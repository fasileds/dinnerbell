import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import { useSession } from "next-auth/react";

// Define the type for coordinates
interface Coordinates {
  lat: number;
  lng: number;
}

interface User {
  id: string;
  lat: number;
  lng: number;
  email: string;
}

// The function to handle user registration
const registerUser = async (session: any, setUserData: Function) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userCoords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (session?.user?.email) {
          try {
            console.log("Request Payload:", {
              email: session.user.email,
              lat: userCoords.lat,
              lng: userCoords.lng,
            });

            const response = await axios.post<{ existingUser: User }>(
              "/api/registre",
              {
                email: session.user.email,
                lat: userCoords.lat,
                long: userCoords.lng,
              }
            );

            console.log(
              "User email and location saved successfully:",
              response.data
            );
            setUserData(response.data.existingUser);
          } catch (error) {
            console.error("Error saving user email and location:", error);
          }
        }
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

export default registerUser;
