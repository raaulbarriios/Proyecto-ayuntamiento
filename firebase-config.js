// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt9VYQN-M6wl7174y-XCHwmAs9TNAQYVg",
  authDomain: "eventos-ayuntamiento.firebaseapp.com",
  databaseURL: "https://eventos-ayuntamiento-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eventos-ayuntamiento",
  storageBucket: "eventos-ayuntamiento.firebasestorage.app",
  messagingSenderId: "375769854696",
  appId: "1:375769854696:web:ff2de3016aa33bb2f24f5d",
  measurementId: "G-TQK1FTLQ39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);