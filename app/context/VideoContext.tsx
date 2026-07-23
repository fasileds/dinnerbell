// VideoProvider.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import dayjs from "dayjs";
import { number } from "zod";

interface FormData {
  price: string;
  restorant: string;
  city: string;
  country: string;
  zipCode: string;
  streetAddress: string;
  color: string;
  description: string;
  address: string;
  searchRadius: Array<number>;
  budget: string;
  duration: string;
  businessHours: Array<[dayjs.Dayjs | null, dayjs.Dayjs | null]>;
  restorantId: string;
  dish: string;
  keywords: Array<string>;
  selectedPlatforms: Array<string>;
}

interface VideoContextType {
  portraitVideoData: File | null;
  setPortraitVideoData: React.Dispatch<React.SetStateAction<File | null>>;
  landscapeVideoData: File | null;
  setLandscapeVideoData: React.Dispatch<React.SetStateAction<File | null>>;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleVideoUpload: () => Promise<void>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider = ({ children }: VideoProviderProps) => {
  const [portraitVideoData, setPortraitVideoData] = useState<File | null>(null);
  const [landscapeVideoData, setLandscapeVideoData] = useState<File | null>(
    null
  );
  const [formData, setFormData] = useState<FormData>({
    price: "",
    color: "#000000",
    restorant: "",
    description: "",
    address: "",
    searchRadius: [],
    budget: "",
    duration: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    country: "",
    businessHours: [[null, null]],
    restorantId: "",
    dish: "",
    keywords: [],
    selectedPlatforms: [],
  });
  const handleVideoUpload = async () => {
    if (
      !landscapeVideoData ||
      !formData.budget ||
      !formData.duration ||
      !formData.zipCode ||
      !formData.price ||
      !formData.description ||
      !formData.restorantId ||
      !formData.dish
    ) {
      console.error("Missing required fields or video file.");
      return;
    }
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      console.error("User is not logged in.");
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return;
    }
    if (!user || !user.id) {
      console.error("User ID is missing.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("video", landscapeVideoData);
    formDataToSend.append("targetZip", formData.zipCode);
    formDataToSend.append("budget", formData.budget);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("price", parseFloat(formData.price).toString());
    formDataToSend.append("description", formData.description);
    formDataToSend.append("userId", "06220b98-f8b7-4608-8db7-728afe7dbd1b");
    formDataToSend.append("restorantId", formData.restorantId);
    formDataToSend.append("dish", formData.dish);
    formDataToSend.append(
      "selectedPlatforms",
      JSON.stringify(formData.selectedPlatforms)
    );

    try {
      const response = await fetch("/api/Video/createVideo", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Upload failed:", data.error);
      } else {
        console.log("Video uploaded and campaign created successfully:", data);
      }
    } catch (error) {
      console.error("Error uploading video or creating campaign:", error);
    }
  };

  return (
    <VideoContext.Provider
      value={{
        portraitVideoData,
        setPortraitVideoData,
        landscapeVideoData,
        setLandscapeVideoData,
        formData,
        setFormData,
        handleVideoUpload,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};
