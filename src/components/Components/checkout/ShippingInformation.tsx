"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { UserAuth } from "@/lib/context/AuthContent";
import { db } from "../../../../firebase";
import { useRouter } from 'next/navigation';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

interface UserData {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  addresses: Address[];
}

const ShippingInformation = () => {
  const { user } = UserAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (!user?.uid) {
          setLoading(false);
          return;
        }

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
          setUserData(data);
          
          // Find and set default address
          const defaultAddr = data.addresses?.find(addr => addr.isDefault);
          setDefaultAddress(defaultAddr || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [user]);

  const handleEditClick = () => {
    router.push('/profile'); // Adjust this path to match your profile page route
  };

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md w-full">
        <p className="text-gray-600">Please sign in to continue.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-gray-900 font-semibold">
          Shipping Information
        </h2>
        <button
          onClick={handleEditClick}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
          Edit in Profile
        </button>
      </div>

      <div className="space-y-4">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <p className="p-3 bg-gray-50 rounded-md">
              {userData?.displayName || "Not provided"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <p className="p-3 bg-gray-50 rounded-md">
              {userData?.phoneNumber || "Not provided"}
            </p>
          </div>
        </div>

        {/* Default Address Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Default Shipping Address</label>
          {defaultAddress ? (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="space-y-1">
                <p className="font-medium">{defaultAddress.street}</p>
                <p className="text-sm text-gray-600">
                  {defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-md text-gray-500">
              No default address set. Please add an address in your profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingInformation;
