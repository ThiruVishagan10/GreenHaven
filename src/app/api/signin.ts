

import {  signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase";

export const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      await fetch("/api/setAuthCookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      return true;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
        return false;
    }
  };