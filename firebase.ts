// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5G22BCjc98eG87QWM7jL-cZcF-kzlti4",
  authDomain: "vels-garden.firebaseapp.com",
  projectId: "vels-garden",
  storageBucket: "vels-garden.firebasestorage.app",
  messagingSenderId: "730122166741",
  appId: "1:730122166741:web:4bc22d8410b3cc60e8dd5c",
  measurementId: "G-6LKQ7N15J2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, app };