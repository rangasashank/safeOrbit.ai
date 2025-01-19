import React, { useEffect, useState } from "react";
import useUserLocation from "../hooks/useUserLocation"; // Custom hook to get user location
import { updateDisasters } from "../services/disasterService";
import Map from "../components/Map";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig"; // Adjust the path to your Firebase config

const AMBEE_API_KEY =
  "a924212dfa4c5d4d5f46c8cf5414d3039ea811449f17ad6725f0094993413794"; // Replace with your API key

function Dashboard() {
  const { location, error } = useUserLocation();
  const [disasters, setDisasters] = useState([]);
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
          await updateDisasters(
            location.latitude,
            location.longitude,
            AMBEE_API_KEY,
            process.env.VITE_GOOGLE_MAPS_API_KEY
          );
          await fetchUpdatedDisasters();
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
            
      <div className="flex flex-1">
                {/* Sidebar */}
                
        {showSidebar && (
          <div className="w-1/3 bg-gray-50 p-4 overflow-auto">
                        
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Recent Disasters
            </h2>
                        
            <ul className="space-y-4">
                            
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
                
        <div className={`flex-1 relative ${showSidebar ? "w-2/3" : "w-full"}`}>
                    
          <Map disasters={disasters} className="absolute inset-0" />
                  
        </div>
              
      </div>
          
    </div>
  );
}

export default Dashboard;
