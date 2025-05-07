// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdU47pqdi88N8WStog0bjkk5519iQYYR4",
  authDomain: "d-login-34998.firebaseapp.com",
  projectId: "d-login-34998",
  storageBucket: "d-login-34998.firebasestorage.app",
  messagingSenderId: "497245914298",
  appId: "1:497245914298:web:da2f5bd9c71004058cae83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebasedb = getFirestore(app);

