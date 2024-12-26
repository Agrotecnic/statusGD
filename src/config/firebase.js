// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA9kxKwLEdgRUwZNuR7yu7_j_4MUjTrCfg",
  authDomain: "status-gd.firebaseapp.com",
  databaseURL: "https://status-gd-default-rtdb.firebaseio.com",
  projectId: "status-gd",
  storageBucket: "status-gd.appspot.com",
  messagingSenderId: "956818896523",
  appId: "1:956818896523:web:81509b052009fddb22468e",
  measurementId: "G-ZS16WZWMPG"
};

let auth;
let db;

try {
  console.log('Initializing Firebase...');
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getDatabase(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { auth, db };