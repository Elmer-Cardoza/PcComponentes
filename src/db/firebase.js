import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyABtjYG4lnXHu-A7S0xDUZOTRuNLF9GhJU",
    authDomain: "ecomerce-pccomponentes.firebaseapp.com",
    projectId: "ecomerce-pccomponentes",
    storageBucket: "ecomerce-pccomponentes.appspot.com",
    messagingSenderId: "458363860314",
    appId: "1:458363860314:web:8602dd994d16e698a46f63",
    measurementId: "G-9W3RNS27DY"
    };

initializeApp(firebaseConfig);
const auth= getAuth(); 
const db = getFirestore(); 
const storage = getStorage();

export {auth, db, storage};