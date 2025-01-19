import React, { useState } from "react";
import { db } from "../services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function ReportDisaster() {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "disasters"), {
        type,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timestamp: serverTimestamp(),
      });
      alert("Disaster reported successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Report a Disaster</h1>
      <input
        type="text"
        placeholder="Type (e.g., Flood)"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded"
      ></textarea>
      <input
        type="number"
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="number"
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}

export default ReportDisaster;
