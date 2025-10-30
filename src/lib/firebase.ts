
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAqHzYWNk8bQzuuW-p4_yx-k5V9CACOODw",
  authDomain: "studio-1244240057-98258.firebaseapp.com",
  projectId: "studio-1244240057-98258",
  storageBucket: "studio-1244240057-98258.appspot.com",
  messagingSenderId: "1014617366805",
  appId: "1:1014617366805:web:247cb3fb01e0397b86491c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
