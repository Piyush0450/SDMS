// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQodvRNBht25lhhKI1zme7j_UeaNu0v6k",
    authDomain: "sdms-ecd62.firebaseapp.com",
    projectId: "sdms-ecd62",
    storageBucket: "sdms-ecd62.firebasestorage.app",
    messagingSenderId: "414266873823",
    appId: "1:414266873823:web:163fb0870447c421ce966a",
    measurementId: "G-B1R4FNHFNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
