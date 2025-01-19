import React, { useEffect, useState } from "react";
import useUserLocation from "../hooks/useUserLocation"; // Custom hook to get user location
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig"; // Adjust the path to your Firebase config
import Map from "../components/Map";
import Chat from "./Chat";

function Dashboard() {
  const { location, error } = useUserLocation();
  const [disasters, setDisasters] = useState(() => {
    // Load disasters from localStorage on initial render
    const storedDisasters = localStorage.getItem("disasters");
    return storedDisasters ? JSON.parse(storedDisasters) : [];
  });
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false); // State to control animation trigger on app load

  const fetchUpdatedDisasters = async () => {
    try {
      const disastersCollection = collection(db, "disasters");
      const querySnapshot = await getDocs(disastersCollection);
      const disastersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDisasters(disastersData);
    } catch (error) {
      console.error("Error fetching disasters from Firestore:", error);
    }
  };

  // Trigger sidebar animation after component mounts
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Delay for smooth animation
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gray-200 shadow-lg p-4">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-black hover:text-white hover:bg-blue-500 hover:scale-110 transition transform px-4 py-2 rounded font-medium"
        >
          {showSidebar ? "Hide Recent Disasters" : "Unhide Recent Disasters"}
        </button>
        <h1 className="text-3xl text-gray-800 font-bold text-center">
          Disaster Dashboard
        </h1>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 bg-gradient-to-r from-gray-100 to-gray-200">
        {/* Sidebar */}
        {showSidebar && (
          <div
            className={`w-1/3 bg-gradient-to-b from-blue-50 to-blue-100 p-4 h-full shadow-lg 
              transform transition-transform duration-700 ${
                isLoaded ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
              }`}
          >
            <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">
              Recent Disasters
            </h2>
            <ul className="space-y-4">
              {disasters.slice(0, 5).map((disaster) => (
                <li
                  key={disaster.id}
                  className="p-4 bg-gray-100 border border-gray-300 shadow rounded-lg hover:bg-gray-50 transition"
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
          <Map disasters={disasters} className="absolute inset-0" />

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
