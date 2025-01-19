// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDOcsz7DodKB0ukWO220JpxqFImUStG_4k",
    authDomain: "safeorbitai.firebaseapp.com",
    projectId: "safeorbitai",
    storageBucket: "safeorbitai.firebasestorage.app",
    messagingSenderId: "1001574580350",
    appId: "1:1001574580350:web:4ad4f8bb8a8d779869582f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
