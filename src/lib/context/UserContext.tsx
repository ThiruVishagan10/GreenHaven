"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface User {
  uid: string;
  email: string | null;
  fullName: string;
  photoURL: string | null;
  phoneNumber: string | null;
  address?: Address | {};
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: userData.fullName || firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL,
              phoneNumber: userData.phoneNumber || firebaseUser.phoneNumber,
              address: userData.address || {},
            });
          } else {
            // Create new user document if it doesn't exist
            const newUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL,
              phoneNumber: firebaseUser.phoneNumber,
              address: {},
              createdAt: new Date().toISOString(),
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateProfile = async (data: Partial<User>) => {
    if (!user?.uid) throw new Error('No authenticated user');

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...data,
        };
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
