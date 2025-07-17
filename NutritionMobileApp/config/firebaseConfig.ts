import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWLc544iQO9vATCvuEdkyIVwaocfmbDhQ",
  authDomain: "appfitness-76580.firebaseapp.com",
  projectId: "appfitness-76580",
  storageBucket: "appfitness-76580.firebasestorage.app",
  messagingSenderId: "129584338664",
  appId: "1:129584338664:web:cfcef45981f71952d31b5d",
  measurementId: "G-JMQG9LCMRD"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(firebaseApp);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(firebaseApp);