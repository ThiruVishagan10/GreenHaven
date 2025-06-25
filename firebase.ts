


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAmiyRwqOEwqpA7eHcInrc9gpwVtswqhrI",
//   authDomain: "green-haven-1e535.firebaseapp.com",
//   projectId: "green-haven-1e535",
//   storageBucket: "green-haven-1e535.firebasestorage.app",
//   messagingSenderId: "1002600039745",
//   appId: "1:1002600039745:web:06826a0608921c3e24cdc0",
//   measurementId: "G-MPV80X1EZD"
// };
const firebaseConfig = {

  apiKey: "AIzaSyBLftB1Nk6Xja56-WIVheq7n2L7hZtbjUg",

  authDomain: "vels-nursury.firebaseapp.com",

  projectId: "vels-nursury",

  storageBucket: "vels-nursury.firebasestorage.app",

  messagingSenderId: "890696696013",

  appId: "1:890696696013:web:3f4d4c85b06639df282984",

  measurementId: "G-F4DTNMB0NK"

};





// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = isSupported().then((yes)=> yes ? getAnalytics(app) : null );
export const auth = getAuth(app);

export const db = getFirestore()