import React, { useState } from "react";
import useUserLocation from "../hooks/useUserLocation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function ReportDisaster() {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [severity, setSeverity] = useState(null);
  const { location } = useUserLocation();

  // Initialize Google Generative AI client
  const genAI = new GoogleGenerativeAI("AIzaSyAEHOvzNKlkuG-Dk2VvJib_pQN1t8Eu3kI");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert("Please upload a photo of the disaster.");
      return;
    }

    try {
      // Convert the image file to a base64 string
      const photoBase64 = await toBase64(photo);

      // Prepare the image for Gemini
      const imagePart = {
        inlineData: {
          data: photoBase64.split(",")[1], // Remove the prefix (e.g., "data:image/jpeg;base64,")
          mimeType: photo.type, // e.g., "image/jpeg"
        },
      };

      // Prepare the prompt
      const prompt = `Analyze the following data and provide a severity score. Also, there can be images that don't have any natural disaster you need identify it . The output should be one of: Severity:None (if image provided shows no natural disaster even though description says), Severity: Low, Severity: Medium, or Severity: High.
      
      DATA:
      Type: ${type}
      Description: ${description}
      Location: Latitude ${location.latitude}, Longitude ${location.longitude}`;

      // Send the request to Gemini
      const result = await model.generateContent([prompt, imagePart]);

      // Extract and handle the response
      const severityResponse = result.response.text();
      console.log("Severity response:", severityResponse);
      setSeverity(severityResponse.split("\n")[0]);

      // Add the disaster report to Firestore
      
        await addDoc(collection(db, "disasters"), {
          type,
          description: `${description} | ${severityResponse}`, // Append severity to description
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          date: serverTimestamp(),
        });
     

      alert(`Disaster reported successfully! ${severityResponse}`);
      setType("");
      setDescription("");
      setPhoto(null);
    } catch (error) {
      console.error("Error reporting disaster:", error);
      alert("An error occurred while reporting the disaster. Please try again.");
    }
  };

  // Helper function to convert file to base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="block w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {severity && (
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-lg font-bold">Severity Analysis</h2>
          <p>{severity}</p>
        </div>
      )}
    </div>
  );
}

export default ReportDisaster;
