import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCwsbUzSuOy-ChGUgXdnp3LUn58Bb50mpE",
  authDomain: "auth-thesis-65f59.firebaseapp.com",
  projectId: "auth-thesis-65f59",
  storageBucket: "auth-thesis-65f59.appspot.com",
  messagingSenderId: "671387748427",
  appId: "1:671387748427:web:6a76201519fafdb9dd25ce",
  measurementId: "G-LQKC5218Q7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export default app;