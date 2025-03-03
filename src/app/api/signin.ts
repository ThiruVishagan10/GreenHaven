import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

interface SignInParams {
  email: string;
  password: string;
}

export const handleSignIn = async ({ email, password }: SignInParams) => {
  if (!email || !password) {
    throw new Error("Please fill in all required fields");
  }

  try {
    // Sign in the user with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // You could fetch additional user data from your database here
    // For example, getting user profile data from Firestore
    // const userDoc = await getDoc(doc(db, "users", user.uid));
    // const userData = userDoc.data();

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
      }
    };

  } catch (error) {
    if (error instanceof Error) {
      // Handle specific Firebase auth errors
      switch (error.message) {
        case 'auth/user-not-found':
          throw new Error("No user found with this email address");
        case 'auth/wrong-password':
          throw new Error("Incorrect password");
        case 'auth/invalid-email':
          throw new Error("Invalid email address");
        case 'auth/user-disabled':
          throw new Error("This account has been disabled");
        default:
          throw new Error(error.message);
      }
    }
    throw new Error("An error occurred during sign in");
  }
};
