
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';

interface AdminData {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface AdminProps {
  data: AdminData;
}

export const createAdmin = async ({ data }: AdminProps) => {
  try {
    if (!data.name || !data.email) {
      throw new Error('Name and email are required');
    }

    await setDoc(doc(db, 'admins', data.id), data);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
};

export const updateAdmin = async ({ data }: AdminProps) => {
  try {
    if (!data.name || !data.email) {
      throw new Error('Name and email are required');
    }

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(doc(db, 'admins', data.id), updateData);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error updating admin:', error);
    throw error;
  }
};

export const deleteAdmin = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'admins', id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
};
