import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyARKyzdwc2fgeTpwkqTrOKIB0qpRNz_n4c",
  authDomain: "pokedle-online.firebaseapp.com",
  projectId: "pokedle-online",
  storageBucket: "pokedle-online.appspot.com",
  messagingSenderId: "646061032717",
  appId: "1:646061032717:web:ec60998529d152730a5c44",
  measurementId: "G-P79DBQDTC8",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
getAnalytics(app);
