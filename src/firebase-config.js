// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAZoIXjsrwRHq1yqe-3I60glG9fgcJHpWU",
    authDomain: "pccomponentes-dfefa.firebaseapp.com",
    projectId: "pccomponentes-dfefa",
    storageBucket: "pccomponentes-dfefa.appspot.com",
    messagingSenderId: "842979480789",
    appId: "1:842979480789:web:4197ca064407ec51127e5c"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
