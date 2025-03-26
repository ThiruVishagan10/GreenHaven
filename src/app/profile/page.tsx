
"use client";

import React, { useState, useEffect } from 'react';
import { UserAuth } from '@/lib/context/AuthContent';
import { auth, db } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { 
  User, 
  LogOut, 
  UserCircle, 
  ShoppingBag, 
  Heart, 
  MapPin,
  ChevronRight,
  Loader2
} from 'lucide-react';
<<<<<<< HEAD
import ProfileSection from '@/components/Components/userProfile/ProfileSection';  
import OrdersSection from '@/components/Components/userProfile/OrderSection';
import FavoritesSection from '@/components/Components/userProfile/FavoritesSection';
import AddressesSection from '@/components/Components/userProfile/AddressesSection';
=======
import ProfileSection from '@/components/Components/userProfile/ProfileSection';
import OrdersSection from '@/components/Components/userProfile/OrderSection';
import FavoritesSection from '@/components/Components/userProfile/FavoritesSection';
import AddressesSection from '@/components/Components/userProfile/AddressesSection';

>>>>>>> 1d19b187e8cfcd7391d42ffa8cbce74dcd3ba0d6

interface UserProfile {
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  addresses?: {
    id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    isDefault: boolean;
  }[];
}

const ProfilePage = () => {
  const router = useRouter();
  const { user } = UserAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        setIsLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          alert('User profile not found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  const handleUpdateProfile = async (data: { displayName: string; phoneNumber: string }) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'favorites', label: 'Favorites', icon: <Heart size={20} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSection 
            displayName={profile?.displayName || null}
            email={profile?.email || null}
            photoURL={profile?.photoURL || null}
            phoneNumber={profile?.phoneNumber || null}
             addresses={profile?.addresses || []}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'orders':
        return <OrdersSection />;
      case 'favorites':
        return <FavoritesSection />;
      case 'addresses':
        return <AddressesSection />;
      default:
        return (
          <ProfileSection 
            displayName={profile?.displayName || null}
            email={profile?.email || null}
            photoURL={profile?.photoURL || null}
            phoneNumber={profile?.phoneNumber || null}
            onUpdateProfile={handleUpdateProfile}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-80">
            <div className="bg-white rounded-lg shadow-sm">
              {/* User Info */}
              <div className="flex flex-col items-center p-6 border-b">
                <div className="relative">
                  {profile?.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserCircle size={96} className="w-24 h-24 text-gray-400" />
                  )}
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">
                  {profile?.displayName || 'No name set'}
                </h2>
                <p className="text-sm text-gray-500">{profile?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-md transition-colors
                      ${activeTab === item.id
                        ? 'bg-green-50 text-green-600'
                        : 'hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {React.cloneElement(item.icon, {
                        className: activeTab === item.id ? 'text-green-600' : 'text-gray-500'
                      })}
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ChevronRight 
                      size={18} 
                      className={activeTab === item.id ? 'text-green-600' : 'text-gray-400'} 
                    />
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-md transition-colors mt-2"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
