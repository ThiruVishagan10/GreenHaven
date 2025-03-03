// lib/auth.js
import { auth } from "../../firebase";
import {  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

// Email & Password Sign Up
export const signUpWithEmail = async (email:string, password:string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Signup Error:", error);
  }
};

// Email & Password Sign In
export const signInWithEmail = async (email:string, password:string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error);

  }
};


// Logout
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};
