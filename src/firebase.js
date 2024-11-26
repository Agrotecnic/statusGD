import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA9kxKwLEdgRUwZNuR7yu7_j_4MUjTrCfg",
    authDomain: "status-gd.firebaseapp.com",
    projectId: "status-gd",
    storageBucket: "status-gd.firebasestorage.app",
    messagingSenderId: "956818896523",
    appId: "1:956818896523:web:81509b052009fddb22468e",
    measurementId: "G-ZS16WZWMPG"
  };

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);