import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Map from "../components/Map";

function Dashboard() {
  const [disasters, setDisasters] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  // useEffect(() => {
  //   const fetchDisasters = async () => {
  //     const querySnapshot = await getDocs(collection(db, "disasters"));
  //     const data = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setDisasters(data);
  //   };

  //   fetchDisasters();
  // }, []);

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
        <h1 className="text-3xl font-bold text-gray-700 text-center">Disaster Dashboard</h1>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-1/3 bg-gray-50 p-4 overflow-auto">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Recent Disasters</h2>
            <ul className="space-y-4">
              {disasters.slice(0, 5).map((disaster) => (
                <li
                  key={disaster.id}
                  className="p-4 bg-white shadow rounded-lg hover:bg-gray-100 transition"
                >
                  <h3 className="text-lg font-bold text-gray-700">{disaster.type}</h3>
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
