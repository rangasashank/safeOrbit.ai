import { getDistance } from "geolib";

export const filterDisastersByRadius = (disasters, userLocation, radius = 100) => {
  return disasters.filter((disaster) => {
    const distance = getDistance(
      { latitude: userLocation.latitude, longitude: userLocation.longitude },
      { latitude: disaster.latitude, longitude: disaster.longitude }
    );

    // Convert distance to kilometers and compare with the radius
    return distance / 1000 <= radius;
  });
};
