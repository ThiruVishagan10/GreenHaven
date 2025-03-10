// services/favorites.ts
import { 
    doc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove,
    setDoc
  } from 'firebase/firestore';
  import { db } from '../../firebase';
  
  export const getFavorites = async (userId: string): Promise<string[]> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data().favorites || [];
      }
      // If user document doesn't exist, create it
      await setDoc(doc(db, 'users', userId), { favorites: [] });
      return [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  };
  
  export const addToFavorites = async (userId: string, productId: string): Promise<boolean> => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        favorites: arrayUnion(productId)
      });
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  };
  
  export const removeFromFavorites = async (userId: string, productId: string): Promise<boolean> => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        favorites: arrayRemove(productId)
      });
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  };
  