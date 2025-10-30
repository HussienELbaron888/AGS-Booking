'use client';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAqHzYWNk8bQzuuW-p4_yx-k5V9CACOODw",
  authDomain: "studio-1244240057-98258.firebaseapp.com",
  projectId: "studio-1244240057-98258",
  storageBucket: "studio-1244240057-98258.appspot.com",
  messagingSenderId: "1014617366805",
  appId: "1:1014617366805:web:247cb3fb01e0397b86491c"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export { app, db, auth, storage };
