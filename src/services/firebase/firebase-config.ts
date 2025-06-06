// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_UCtDo9gY1qSl9Uqld4UeujYmcrKH5GM",
  authDomain: "parcial3-39bce.firebaseapp.com",
  projectId: "parcial3-39bce",
  storageBucket: "parcial3-39bce.firebasestorage.app",
  messagingSenderId: "621212690003",
  appId: "1:621212690003:web:e5e466f5f7de5fac9548a6",
  measurementId: "G-6T3HC5Y9P9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);