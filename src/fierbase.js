// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFierstore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBcSK5ZrPIjDfC8o2ZttIezc3TWpkzYWA",
  authDomain: "react-first-project-184b8.firebaseapp.com",
  projectId: "react-first-project-184b8",
  storageBucket: "react-first-project-184b8.appspot.com",
  messagingSenderId: "377161458849",
  appId: "1:377161458849:web:3e63eeff64a68911693ce0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fierstore = getFierstore(app);