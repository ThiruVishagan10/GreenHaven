// lib/firestore/admin/read.tsx
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';

interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export const getAdmins = async (): Promise<Admin[]> => {
  try {
    const adminsRef = collection(db, 'admins');
    const snapshot = await getDocs(adminsRef);
    
    if (snapshot.empty) {
      console.log('No admins found');
      return [];
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Admin));
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw new Error('Failed to fetch admins');
  }
};

// Function to check if a user is an admin
export const checkIsAdmin = async (email: string): Promise<boolean> => {
  try {
    const admins = await getAdmins();
    return admins.some(admin => 
      admin.email.toLowerCase() === email.toLowerCase()
    );
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
