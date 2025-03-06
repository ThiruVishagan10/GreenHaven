// lib/context/AdminAuth.tsx
"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { UserAuth } from './AuthContent';
import { getAdmins } from '../firestore/admin/read';

interface AdminAuthContextType {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdmin: false,
  isLoading: true,
  error: null,
});

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = UserAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      setError(null);

      if (!user?.email) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const admins = await getAdmins();
        const isUserAdmin = admins.some(admin => 
          admin.email.toLowerCase() === user.email?.toLowerCase()
        );
        setIsAdmin(isUserAdmin);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError('Failed to verify admin status');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return (
    <AdminAuthContext.Provider value={{ isAdmin, isLoading, error }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
