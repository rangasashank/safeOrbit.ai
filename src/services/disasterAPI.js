import axios from "axios";

// API URLs
const AMBEE_FIRE_API_URL = `http://localhost:5002/api/fire/latest/by-lat-lng`;
const AMBEE_NATURAL_DISASTER_API_URL = `http://localhost:5002/api/disasters/latest/by-lat-lng`;
const GOOGLE_GEOCODING_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

// Function to get location name from latitude and longitude
const getLocationName = async (latitude, longitude, googleApiKey) => {
  try {
    const response = await axios.get(GOOGLE_GEOCODING_API_URL, {
      params: {
        latlng: `${latitude},${longitude}`,
        key: googleApiKey,
      },
    });

    // Extract location name (formatted address) from the response
    const locationName = response.data.results || "Unknown Location";
    console.log("Location name:", locationName[0].address_components[2].long_name);
    return locationName[0].address_components[2].long_name;
  } catch (error) {
    console.error("Error fetching location name:", error);
    return "Unknown Location";
  }
};

// Fetch both wildfires and natural disasters
export const fetchDisastersFromAmbee = async (latitude, longitude, ambeeApiKey, googleApiKey, limit = 10) => {
  try {
    // Fetch wildfires
    const wildfiresResponse = await axios.get(AMBEE_FIRE_API_URL, {
      headers: {
        "x-api-key": ambeeApiKey,
        "Content-type": "application/json",
      },
      params: {
        lat: latitude,
        lng: longitude,
      },
    });

    const wildfires = await Promise.all(
      wildfiresResponse.data.data.map(async (wildfire) => {
        const locationName = await getLocationName(wildfire.lat, wildfire.lng, googleApiKey);

        return {
          id: wildfire.id || Math.random().toString(36).substr(2, 9),
          type: `Wildfire: ${wildfire.fireType}`,
          description: `Intensity: ${wildfire.intensity} | Location: ${locationName}`, // Append location to description
          latitude: wildfire.lat,
          longitude: wildfire.lng,
          date: wildfire.detectedAt || new Date().toISOString(),
        };
      })
    );

    // Fetch natural disasters
    const disastersResponse = await axios.get(AMBEE_NATURAL_DISASTER_API_URL, {
      headers: {
        "x-api-key": ambeeApiKey,
        "Content-type": "application/json",
      },
      params: {
        lat: latitude,
        lng: longitude,
      },
    });

    const naturalDisasters = disastersResponse.data.result.map((disaster) => {
        return {
          id: disaster.id || Math.random().toString(36).substr(2, 9),
          type: disaster.event_type || "Natural Disaster",
          description: disaster.event_name,
          latitude: disaster.lat,
          longitude: disaster.lng,
          date: disaster.date || new Date().toISOString(),
        };
      })
    // Combine both arrays
    const allDisasters = [...wildfires, ...naturalDisasters];

    return allDisasters;
  } catch (error) {
    console.error("Error fetching disasters from Ambee API:", error);
    return [];
  }
};
