// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJLM9y64EQS1oweJhm3v758L_4CZ_fROU",
  authDomain: "hakunamatatabank-24tjss63.firebaseapp.com",
  projectId: "hakunamatatabank-24tjss63",
  storageBucket: "hakunamatatabank-24tjss63.appspot.com",
  messagingSenderId: "361963532162",
  appId: "1:361963532162:web:e555cc4288487a54f5299b",
  measurementId: "G-YP97R7T327"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);