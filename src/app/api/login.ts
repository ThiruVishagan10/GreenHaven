

import { auth } from "../../../firebase";
import { signInWithEmailAndPassword,  } from "firebase/auth";



export const handleLogin = async (email:string, password:string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      await fetch("/api/setAuthCookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

 