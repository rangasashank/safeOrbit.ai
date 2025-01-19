import React, { useEffect, useState } from "react";
import useUserLocation from "../hooks/useUserLocation"; // Custom hook to get user location
import { updateDisasters } from "../services/disasterService";
import Map from "../components/Map";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig"; // Adjust the path to your Firebase config

const AMBEE_API_KEY = "a924212dfa4c5d4d5f46c8cf5414d3039ea811449f17ad6725f0094993413794"; // Replace with your API key

function Dashboard() {
  const { location, error } = useUserLocation();
  const [disasters, setDisasters] = useState([]);

 const fetchUpdatedDisasters = async () => {
  try {
    // Reference the Firestore collection
    const disastersCollection = collection(db, "disasters");

    // Fetch all documents in the collection
    const querySnapshot = await getDocs(disastersCollection);

    // Map the documents to an array of objects
    const disastersData = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the document data
    }));

    // Update the disasters state
    setDisasters(disastersData);
  } catch (error) {
    console.error("Error fetching disasters from Firestore:", error);
  }
};
  

useEffect(() => {
    const fetchAndUpdateDisasters = async () => {
      try {
        if(location) {
            await updateDisasters(location.latitude, location.longitude, AMBEE_API_KEY, process.env.VITE_GOOGLE_MAPS_API_KEY);
            await fetchUpdatedDisasters();
        }
        
      } catch (error) {
        console.error("Error updating disasters:", error);
      }
    };
  
    fetchAndUpdateDisasters();
  }, [location]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Disaster Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!location && <p>Fetching your location...</p>}
      {location && (
        <div>
          <Map disasters={disasters} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {disasters.map((disaster) => (
              <div key={disaster.id} className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">{disaster.event}</h2>
                <p>{disaster.type}</p>
                <p>{disaster.description}</p> 
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
