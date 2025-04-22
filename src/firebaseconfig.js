// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmaqwAi1zStXm86Ot--EOgwvhWc-PYlYU",
  authDomain: "table-tap-e7267.firebaseapp.com",
  projectId: "table-tap-e7267",
  storageBucket: "table-tap-e7267.firebasestorage.app",
  messagingSenderId: "581807349476",
  appId: "1:581807349476:web:c390b8f07e09347b93d6f1",
  measurementId: "G-9D6YVYRTQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);