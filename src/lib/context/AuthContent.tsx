"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

interface UserData {
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
  authProvider: string; // To track how the user signed up
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  googleSignIn: () => Promise<void>;
  emailSignUp: (email: string, password: string, displayName: string) => Promise<void>;
  emailSignIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  googleSignIn: async () => {},
  emailSignUp: async () => {},
  emailSignIn: async () => {},
  logOut: async () => {},
  loading: true,
  error: null,
});

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to store user data in Firestore
  const storeUserData = async (user: User, authProvider: string) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const userData: UserData = {
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          createdAt: new Date(),
          authProvider: authProvider,
        };

        await setDoc(userRef, userData);
        setUserData(userData);
      } else {
        setUserData(userSnap.data() as UserData);
      }
    } catch (error) {
      console.error("Error storing user data:", error);
      setError("Failed to store user data");
    }
  };

  // Email/Password Sign Up
  const emailSignUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      if (result.user) {
        await updateProfile(result.user, {
          displayName: displayName
        });
        
        // Store additional user data in Firestore
        await storeUserData(result.user, "email");
      }
    } catch (error: any) {
      let errorMessage = "Failed to create account";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email already in use";
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign In
  const emailSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await storeUserData(result.user, "email");
      }
    } catch (error: any) {
      let errorMessage = "Failed to sign in";
      if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "Email not found";
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google SignIn
  const googleSignIn = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await storeUserData(result.user, "google");
      }
    } catch (error: any) {
      const errorMessage = "Google Sign In failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logOut = async () => {
    setError(null);
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      setError("Failed to log out");
      console.error("Logout Error:", error);
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch existing user data
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        userData, 
        googleSignIn, 
        emailSignUp, 
        emailSignIn, 
        logOut, 
        loading, 
        error 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
