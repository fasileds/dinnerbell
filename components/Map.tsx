import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import Spiner from "./Spiner";
const Map: React.FC = () => {
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [route, setRoute] = useState<google.maps.LatLngLiteral[]>([]);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const mapContainerStyle = {
    height: "100%",
    width: "100%",
  };
  const restaurantLocation = { lat: 9.0347, lng: 38.7474 };
  const userIcon = "/path/to/your/red-user-icon.png";
  const restaurantIcon = "/path/to/your/red-restaurant-icon.png";
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCoords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(userCoords);
            getRoute(userCoords, restaurantLocation);
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
  }, []);

  const getRoute = async (
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral
  ) => {
    if (window.google && window.google.maps) {
      const directionsService = new window.google.maps.DirectionsService();
      try {
        const result = await directionsService.route({
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        });

        if (result.routes.length > 0) {
          const path = result.routes[0].overview_path.map((point) => ({
            lat: point.lat(),
            lng: point.lng(),
          }));

          setRoute(path);
        } else {
          console.error("No routes found.");
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    }
  };

  const onLoad = () => {
    setMapLoaded(true);
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyATZoJUVhfXsOuBNzzrfk7X_tB-mzVL6X4"
      onLoad={onLoad}
    >
      <div className="relative w-full h-80 md:h-96">
        {mapLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userLocation || restaurantLocation}
            zoom={12}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: userIcon,
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                label={{
                  text: "You are here",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              />
            )}

            <Marker
              position={restaurantLocation}
              icon={{
                url: restaurantIcon,
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              label={{
                text: "Restaurant A",
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            />

            {route.length > 0 && (
              <Polyline
                path={route}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 1,
                  strokeWeight: 4,
                  geodesic: true,
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Spiner />
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default Map;
