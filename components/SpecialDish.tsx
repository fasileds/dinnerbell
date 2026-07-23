import { useEffect, useState } from "react";
import { FaClock, FaStar } from "react-icons/fa";
import PaymentModal from "./PaymentModal";
import { Button } from "antd";
import { logEvent, initGA } from "@/app/lib/ga";
import { trackTikTokEvent } from "@/app/lib/tiktok";
import Loader from "./Loader";
import PaymentModalOrder from "./PaymentModalOrder";

interface SpecialDishProps {
  videoUrl: string;
  description: string;
  price: number;
  id: string;
  location: string;
  customerId: string;
  restorant: Object;
}

function SpecialDish({
  location,
  id,
  videoUrl,
  description,
  price,
  customerId,
  restorant,
}: SpecialDishProps) {
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [distance, setDistance] = useState<string>("");
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  useEffect(() => {
    initGA();
  }, []);
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBcDllP99y8tv3dSxsqoWL27kL7iB20oBE&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleMapsLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      setGoogleMapsLoaded(true);
    }
  }, []);
  useEffect(() => {
    if (navigator.geolocation && restorant) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const { streetAddress, city, state, zipCode } = restorant as any;
        const destinationAddress = `${streetAddress}, ${city}, ${state}, ${zipCode}`;
        const formattedAddress = destinationAddress.replace(/ /g, "+");
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [{ lat: userLat, lng: userLng }],
            destinations: [formattedAddress],
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === "OK") {
              const results = response?.rows[0]?.elements;
              if (results && results[0]?.status === "OK") {
                setDistance(results[0].duration.text);
              } else {
                console.error("Error in results:", results);
              }
            } else {
              console.error("Error calculating distance:", status);
            }
          }
        );
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, [restorant]);

  const handleProceedToPayment = async () => {
    setPaymentModalOpen(true);
    const now = new Date();
    const formattedDate = now.toLocaleString();
    logEvent(
      `Order Now Clicked - ${formattedDate}`,
      "Order Button",
      "SpecialDish Component"
    );
    await trackTikTokEvent("InitiateCheckout", {
      content_name: description,
      value: price,
      currency: "USD",
      quantity: 1,
    });
  };

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const { streetAddress, city, state, zipCode, description } =
          restorant as any;
        const destinationAddress = `${streetAddress}, ${city}, ${state}, ${zipCode}`;
        const formattedAddress = destinationAddress.replace(/ /g, "+");

        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${formattedAddress}`,
          "_blank"
        );
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const embedUrl = `https://www.youtube.com/embed/${videoUrl}`;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 bg-white shadow-lg rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex-1 min-w-[30rem] mb-4 lg:mb-0">
        <iframe
          className="w-full h-auto rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-xl"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="flex-1 min-w-[30rem] lg:mt-0">
        <span className="flex items-center text-green-600 text-sm mb-2">
          <FaClock className="mr-2 text-lg" />
          {distance ? `${distance} from where you are` : "Loading distance..."}
        </span>
        <h3 className="text-black text-xl lg:text-3xl font-bold mb-2 transition duration-300 hover:text-green-600">
          {description}
        </h3>
        <p className="text-gray-700 text-sm lg:text-base py-2 leading-5 mb-4">
          {description}
        </p>
        <div className="flex items-center mb-4">
          <FaStar className="text-yellow-500 text-lg mr-1" />
          <FaStar className="text-yellow-500 text-lg mr-1" />
          <FaStar className="text-yellow-500 text-lg mr-1" />
          <FaStar className="text-yellow-500 text-lg mr-1" />
          <FaStar className="text-gray-400 text-lg" />
          <span className="text-gray-500 ml-2 text-xs">(4/5 Rating)</span>
        </div>
        <div className="flex gap-10 items-center">
          <Button
            className="mt-4 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold shadow-md transition duration-300 transform hover:bg-green-700 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            type="primary"
            onClick={handleProceedToPayment}
          >
            Order Now
          </Button>

          <Button
            className="mt-4 px-8 py-2 bg-green-600 text-white rounded-lg font-semibold shadow-md transition duration-300 transform hover:bg-green-700 hover:shadow-lg"
            type="primary"
            onClick={handleLocationClick}
          >
            Open On Map
          </Button>
        </div>
      </div>
      <PaymentModalOrder
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        buget={price * 100}
        id={id}
        location={location}
        customerId={customerId}
      />
    </div>
  );
}

export default SpecialDish;
