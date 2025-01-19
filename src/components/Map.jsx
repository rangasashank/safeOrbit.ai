import React, { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const Map = ({ disasters }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY, // Your API key
  });

  const center = useMemo(() => ({ lat: 49.2827, lng: -123.1207 }), []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      zoom={10}
      center={center}
    >
      {disasters.map((disaster) => (
        <Marker
          key={disaster.id}
          position={{
            lat: disaster.latitude,
            lng: disaster.longitude,
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;
