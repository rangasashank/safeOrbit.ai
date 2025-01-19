import { fetchDisastersFromAmbee } from "./disasterAPI";
import { saveDisastersToFirestore } from "./firestoreService";

// Main function to fetch disasters and store them in Firestore
export const updateDisasters = async (latitude, longitude, apiKey, googleApiKey) => {
  try {
    // Fetch disaster data from Ambee
    const disasters = await fetchDisastersFromAmbee(latitude, longitude, apiKey, googleApiKey);

    // Save disasters to Firestore
    await saveDisastersToFirestore(disasters);

    console.log("Disasters updated successfully!");
  } catch (error) {
    console.error("Error updating disasters:", error);
  }
};