import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";

interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
}

export const handleSignUp = async ({ email, password, fullName }: SignUpParams) => {
  if (!email || !password || !fullName) {
    throw new Error("Please fill in all required fields");
  }

  try {
    // Create the user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Here you could add additional user data to your database
    // For example, storing the fullName in Firestore or another database
    // await addDoc(collection(db, "users"), {
    //   uid: user.uid,
    //   fullName,
    //   email,
    //   createdAt: new Date(),
    // });

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        fullName
      }
    };

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An error occurred during sign up");
  }
};
