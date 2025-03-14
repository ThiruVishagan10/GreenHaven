import { 
    doc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove,
    setDoc
  } from 'firebase/firestore';
  import { db } from '../../firebase';
  
import { Address } from '@/types/product';
  
  // Get all addresses for a user
  export const getAddresses = async (userId: string): Promise<Address[]> => {
    if (!userId) throw new Error('User ID is required');
  
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Initialize user document if it doesn't exist
        await setDoc(userRef, {
          addresses: [],
          updatedAt: new Date().toISOString()
        });
        return [];
      }
  
      return userDoc.data().addresses || [];
    } catch (error) {
      console.error('Error getting addresses:', error);
      throw error;
    }
  };
  
  // Add a new address
  export const addAddress = async (userId: string, address: Address) => {
    if (!userId) throw new Error('User ID is required');
  
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Initialize user document with the new address
        await setDoc(userRef, {
          addresses: [address],
          updatedAt: new Date().toISOString()
        });
        return;
      }
  
      const currentAddresses = userDoc.data().addresses || [];
      
      // If this is the first address, make it default
      if (currentAddresses.length === 0) {
        address.isDefault = true;
      }
  
      await updateDoc(userRef, {
        addresses: [...currentAddresses, address],
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  };
  
  // Update an existing address
  export const updateAddress = async (userId: string, index: number, address: Address) => {
    if (!userId) throw new Error('User ID is required');
  
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }
  
      const addresses = userDoc.data().addresses || [];
      
      // Ensure index is valid
      if (index < 0 || index >= addresses.length) {
        throw new Error('Invalid address index');
      }
  
      // Preserve isDefault status if not explicitly changed
      if (typeof address.isDefault === 'undefined') {
        address.isDefault = addresses[index].isDefault;
      }
  
      addresses[index] = address;
  
      await updateDoc(userRef, {
        addresses,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  };
  
  // Remove an address
  export const removeAddress = async (userId: string, index: number) => {
    if (!userId) throw new Error('User ID is required');
  
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }
  
      const addresses = userDoc.data().addresses || [];
      
      // Ensure index is valid
      if (index < 0 || index >= addresses.length) {
        throw new Error('Invalid address index');
      }
  
      // If removing default address, make the first remaining address default
      const wasDefault = addresses[index].isDefault;
      addresses.splice(index, 1);
  
      if (wasDefault && addresses.length > 0) {
        addresses[0].isDefault = true;
      }
  
      await updateDoc(userRef, {
        addresses,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error removing address:', error);
      throw error;
    }
  };
  
  // Set an address as default
  export const setDefaultAddress = async (userId: string, index: number) => {
    if (!userId) throw new Error('User ID is required');
  
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }
  
      const addresses = userDoc.data().addresses || [];
      
      // Ensure index is valid
      if (index < 0 || index >= addresses.length) {
        throw new Error('Invalid address index');
      }
  
      // Update isDefault status for all addresses
      addresses.forEach((address: Address, i: number) => {
        address.isDefault = i === index;
      });
  
      await updateDoc(userRef, {
        addresses,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  };
  
  // Get default address
  export const getDefaultAddress = async (userId: string): Promise<Address | null> => {
    if (!userId) throw new Error('User ID is required');
  
    try {
      const addresses = await getAddresses(userId);
      return addresses.find(address => address.isDefault) || null;
    } catch (error) {
      console.error('Error getting default address:', error);
      throw error;
    }
  };
  
  // Check if address exists
  export const hasAddress = async (userId: string): Promise<boolean> => {
    if (!userId) throw new Error('User ID is required');
  
    try {
      const addresses = await getAddresses(userId);
      return addresses.length > 0;
    } catch (error) {
      console.error('Error checking addresses:', error);
      throw error;
    }
  };
  
  export type { Address };
  