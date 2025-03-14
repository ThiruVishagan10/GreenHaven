"use client";

import React, { useState, useEffect } from 'react';
import { UserAuth } from '@/lib/context/AuthContent';
import { auth, db } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { 
  User, 
  LogOut, 
  UserCircle, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Settings,
  ChevronRight,
  Loader2
} from 'lucide-react';
import ProfileSection from '../ui/Components/userProfile/ProfileSection';
import OrdersSection from '../ui/Components/userProfile/OrderSection';
import FavoritesSection from '../ui/Components/userProfile/FavoritesSection';
import AddressesSection from '../ui/Components/userProfile/AddressesSection';
import SettingsSection from '../ui/Components/userProfile/SettingsSection';

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

  const getUserDisplayImage = () => {
    if (!profile) return <UserCircle size={96} className="w-24 h-24 text-gray-400" />;
    
    if (profile.photoURL) {
      return (
        <img
          src={profile.photoURL}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      );
    }
    
    return <UserCircle size={96} className="w-24 h-24 text-gray-400" />;
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
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'orders':
        return <OrdersSection />;
      case 'favorites':
        return <FavoritesSection />;
      case 'addresses':
        return <AddressesSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow p-6">
              {/* User Info */}
              <div className="flex flex-col items-center mb-6 pb-6 border-b">
                {getUserDisplayImage()}
                <h2 className="mt-4 text-xl font-semibold">
                  {profile?.displayName || 'No name set'}
                </h2>
                <p className="text-gray-600">{profile?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-green-50 text-green-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
