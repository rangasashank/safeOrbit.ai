import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

function Map({ disasters }) {
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
    const [userLocation, setUserLocation] = useState(null);
      
        useEffect(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
              },
              (error) => {
                console.error("Error fetching location:", error);
              }
            );
          }
        }, []);
        const defaultCenter = userLocation || { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco
  return (

    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={6}>
        {disasters.map((disaster) => (
          <Marker
            key={disaster.id}
            position={{ lat: disaster.latitude, lng: disaster.longitude }}
            title={disaster.type.split(":")[0]}
            label={disaster.type.split(":")[0]}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}


export default Map;
