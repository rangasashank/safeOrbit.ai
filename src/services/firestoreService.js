import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const saveDisastersToFirestore = async (disasters) => {
  const disastersCollection = collection(db, "disasters");

  try {
    for (const disaster of disasters) {
        // Create a unique identifier (e.g., based on location and type)
        const uniqueId = `${disaster.lat}-${disaster.lng}-${disaster.type}`;

        // Check if the disaster already exists
        const q = query(
          disastersCollection,
          where("latitude", "==", Number(disaster.lat)),
          where("longitude", "==", Number(disaster.lng)),
          where("type", "==", disaster.type)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // Add the disaster if it doesn't exist
          await setDoc(doc(disastersCollection, uniqueId), {
            description: disaster.description,
            latitude: Number(disaster.latitude),
            longitude: Number(disaster.longitude),
            type: disaster.type,
            date: disaster.date || new Date().toISOString(),
          });

          console.log(`Added new disaster: ${uniqueId}`);
        } else {
          console.log(`Disaster already exists: ${uniqueId}`);
        }

    }
    console.log("Disasters successfully saved to Firestore!");
  } catch (error) {
    console.error("Error saving disasters to Firestore:", error);
  }
};
