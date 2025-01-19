import React, { useEffect, useState } from "react";
import useUserLocation from "../hooks/useUserLocation"; // Custom hook to get user location
import { updateDisasters } from "../services/disasterService";
import Map from "../components/Map";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig"; // Adjust the path to your Firebase config
import Chat from "./Chat";

 // Replace with your API key

function Dashboard() {
  const { location, error } = useUserLocation();
  const [disasters, setDisasters] = useState(() => {
    // Load disasters from localStorage on initial render
    const storedDisasters = localStorage.getItem("disasters");
    return storedDisasters ? JSON.parse(storedDisasters) : [];
  });
  const [showSidebar, setShowSidebar] = useState(true);

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
        if (location) {
          localStorage.removeItem("disasters");
          setDisasters([]);
          await updateDisasters(
            location.latitude,
            location.longitude,
            process.env.AMBEE_API_KEY,
            process.env.VITE_GOOGLE_MAPS_API_KEY
          );
          await fetchUpdatedDisasters();
          localStorage.setItem("disasters", JSON.stringify(disasters));
        }
      } catch (error) {
        console.error("Error updating disasters:", error);
      }
    };

    fetchAndUpdateDisasters();
  }, [location]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-100 shadow p-4">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-gray-700 hover:text-gray-900 p-2 border rounded-lg mb-4"
        >
          {showSidebar ? "Hide Recent Disasters" : "Unhide Recent Disasters"}
        </button>
        <h1 className="text-3xl font-bold text-gray-700 text-center">
          Disaster Dashboard
        </h1>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-1/3 bg-gray-50 p-4 height-3/4">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 height-3/4">
              Recent Disasters
            </h2>
            <ul className="space-y-4 height-3/4">
              {disasters.slice(0, 5).map((disaster) => (
                <li
                  key={disaster.id}
                  className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition"
                >
                  <h3 className="text-lg font-bold text-gray-700">
                    {disaster.type.split(":")[0]}
                  </h3>
                  <p className="text-gray-600">{disaster.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Map Section */}
        <div
          className={`relative flex-1 h-full ${
            showSidebar ? "w-2/3" : "w-full"
          }`}
        >
          {/* Map */}
          <Map disasters={disasters} className="absolute inset-0 " />

          {/* Chat Overlay */}
          <div className="absolute bottom-4 right-4 z-10">
            <Chat disasters={disasters} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
