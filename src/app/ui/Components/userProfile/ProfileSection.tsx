"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import AddressesSection from './AddressesSection';
import { User, Edit2, PlusCircle, Home, Loader2 } from 'lucide-react';
import { getDefaultAddress, type Address } from '@/services/address';

const ProfileSection = () => {
  const { user } = useUser();
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch default address when component mounts
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      if (!user?.uid) return;

      try {
        setIsLoading(true);
        const address = await getDefaultAddress(user.uid);
        setDefaultAddress(address);
      } catch (err) {
        console.error('Error fetching default address:', err);
        setError('Failed to load default address');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefaultAddress();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">Please login to view your profile.</p>
      </div>
    );
  }

  const handleDefaultAddressChange = (address: Address | null) => {
    setDefaultAddress(address);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
      
      <div className="space-y-8">
        {/* Profile Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-6">
            {/* User Info Section */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.fullName || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.fullName || 'User'}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Default Address Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Default Shipping Address
              </h3>
              {isLoading ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  {error}
                </div>
              ) : defaultAddress ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">{defaultAddress.street}</p>
                  <p className="text-gray-600">
                    {defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}
                  </p>
                  <p className="text-gray-600">{defaultAddress.country}</p>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500">No default address set</p>
                </div>
              )}
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-gray-900">{user.displayName || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-gray-900">{user.phoneNumber || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Created</label>
                <p className="mt-1 text-gray-900">
                  {user.metadata?.creationTime 
                    ? new Date(user.metadata.creationTime).toLocaleDateString() 
                    : 'Not available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Section
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Manage Addresses</h2>
          <AddressesSection onDefaultAddressChange={handleDefaultAddressChange} />
        </div> */}

        {/* Settings Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive email updates about your account</p>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50">
                Setup 2FA
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="text-sm font-medium text-red-600">Delete Account</h3>
                <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
              </div>
              <button 
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    // Handle account deletion
                  }
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
