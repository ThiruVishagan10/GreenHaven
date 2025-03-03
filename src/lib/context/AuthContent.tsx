import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  User,
  setPersistence,
  browserLocalPersistence,
  AuthError as FirebaseAuthError
} from "firebase/auth";
import { auth } from "../../../firebase";

interface AuthContextType {
  user: User | null;
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (err) {
        console.error("Persistence setup failed:", err);
      }
    };
    initializePersistence();
  }, []);

  const googleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      await signInWithPopup(auth, provider);
    } catch (err) {
      const authError = err as FirebaseAuthError;
      console.error("Google Sign-In Error:", authError);
      
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (err) {
      const authError = err as FirebaseAuthError;
      console.error("Sign Out Error:", authError);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error("Auth State Error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading && !user) {
    return null; // Or return a loading component
  }

  const contextValue: AuthContextType = {
    user,
    googleSignIn,
    logOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
