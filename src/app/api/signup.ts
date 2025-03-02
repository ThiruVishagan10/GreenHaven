import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const handleSignup = async (email:string, password:string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      await fetch("/api/setAuthCookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      return true;

    } catch (error) {
      console.error("Signup Error:", error);
      return false;
    }
  };

