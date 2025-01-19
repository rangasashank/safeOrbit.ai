import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Map from "../components/Map";

function Dashboard() {
  const [disasters, setDisasters] = useState([]);

  useEffect(() => {
    const fetchDisasters = async () => {
      const querySnapshot = await getDocs(collection(db, "disasters"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDisasters(data);
    };

    fetchDisasters();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Disaster Dashboard</h1>
      <div className="mb-6">
        <Map disasters={disasters} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {disasters.map((disaster) => (
          <div key={disaster.id} className="p-4 bg-white shadow rounded">
            <h2 className="text-xl font-semibold">{disaster.type}</h2>
            <p>{disaster.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
