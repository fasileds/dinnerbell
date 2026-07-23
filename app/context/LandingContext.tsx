"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface LandingContextType {
  userId: string | null;
  setUserId: (id: string) => void;
  videos: Video[];
  setVideos: (videos: Video[]) => void;
}

interface Video {
  id: string;
  videoUrl: string;
  description: string;
  user: { customerId: string; userId: string };
  price: number;
  restorant: object;
}

const LandingContext = createContext<LandingContextType | undefined>(undefined);

export const useLandingContext = () => {
  const context = useContext(LandingContext);
  if (!context) {
    throw new Error("useLandingContext must be used within a LandingProvider");
  }
  return context;
};

interface LandingProviderProps {
  children: ReactNode;
}

export const LandingProvider = ({ children }: LandingProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getVideos = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await axios.get<{ menuItem: Video[] }>(
          "/api/Video/getAllVideo",
          {
            params: {
              userId,
            },
          }
        );
        setVideos(res.data.menuItem);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    getVideos();
  }, [userId]);

  return (
    <LandingContext.Provider value={{ userId, setUserId, videos, setVideos }}>
      {loading ? <p>Loading...</p> : children}
    </LandingContext.Provider>
  );
};
