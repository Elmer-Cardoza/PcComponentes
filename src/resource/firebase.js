// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABtjYG4lnXHu-A7S0xDUZOTRuNLF9GhJU",
  authDomain: "ecomerce-pccomponentes.firebaseapp.com",
  projectId: "ecomerce-pccomponentes",
  storageBucket: "ecomerce-pccomponentes.appspot.com",
  messagingSenderId: "458363860314",
  appId: "1:458363860314:web:8602dd994d16e698a46f63",
  measurementId: "G-9W3RNS27DY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);