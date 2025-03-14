// "use client";

// import React, { useState, useEffect } from 'react';
// import { useUser } from '../../lib/context/UserContext';
// import { auth } from '../../../firebase';
// import { signOut } from 'firebase/auth';
// import { useRouter } from 'next/navigation';
// import { User, LogOut, UserCircle } from 'lucide-react';

// const ProfilePage: React.FC = () => {
//   const router = useRouter();
//   const { user, loading, updateProfile } = useUser();
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '',
//     street: '',
//     city: '',
//     state: '',
//     zipCode: '',
//   });

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         fullName: user.fullName || '',
//         phoneNumber: user.phoneNumber || '',
//         street: user.address?.street || '',
//         city: user.address?.city || '',
//         state: user.address?.state || '',
//         zipCode: user.address?.zipCode || '',
//       });
//     }
//   }, [user]);

//   // Using the same getUserDisplayImage function from Navbar.tsx
//   const getUserDisplayImage = () => {
//     if (!user) return null;
    
//     // Check for photoURL from Google Auth
//     if (user.photoURL) {
//       return (
//         <img
//           src={user.photoURL}
//           alt="Profile"
//           className="w-24 h-24 rounded-full object-cover"
//           referrerPolicy="no-referrer" // Important for Google Photos URLs
//         />
//       );
//     }
    
//     // Default to UserCircle if no photo available
//     return <UserCircle size={96} className="w-24 h-24 text-gray-400" />;
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       router.push('/');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       await updateProfile({
//         fullName: formData.fullName,
//         phoneNumber: formData.phoneNumber,
//         address: {
//           street: formData.street,
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.zipCode,
//         },
//       });
//       setIsEditing(false);
//     } catch (error) {
//       setError('Failed to update profile. Please try again.');
//       console.error('Profile update error:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     router.push('/login');
//     return null;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Profile</h1>
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//         >
//           <LogOut size={20} />
//           Logout
//         </button>
//       </div>

//       {error && (
//         <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
//           {error}
//         </div>
//       )}

//       {!isEditing ? (
//         <div className="bg-white shadow rounded-lg p-6">
//           <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
//             <div className="relative">
//               {getUserDisplayImage()}
//             </div>
//             <div className="text-center md:text-left">
//               <h2 className="text-2xl font-bold">{user.fullName || 'No name set'}</h2>
//               <p className="text-gray-600">{user.email}</p>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="font-semibold mb-2">Contact Information</h3>
//               <p className="text-gray-700 flex items-center gap-2">
//                 <User size={20} />
//                 Phone: {user.phoneNumber || 'Not provided'}
//               </p>
//               <p className="text-gray-700 flex items-center gap-2">
//                 <User size={20} />
//                 Email: {user.email}
//               </p>
//             </div>
            
//             <div>
//               <h3 className="font-semibold mb-2">Address</h3>
//               <p className="text-gray-700">{user.address?.street || 'No address provided'}</p>
//               <p className="text-gray-700">
//                 {user.address?.city && user.address?.state ? 
//                   `${user.address.city}, ${user.address.state} ${user.address.zipCode}` : 
//                   'No address provided'}
//               </p>
//             </div>
//           </div>
          
//           <button
//             onClick={() => setIsEditing(true)}
//             className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Edit Profile
//           </button>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="col-span-full">
//               <label className="block mb-2 font-medium">Full Name</label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 required
//               />
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium">Phone Number</label>
//               <input
//                 type="tel"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               />
//             </div>
            
//             <div className="col-span-full">
//               <label className="block mb-2 font-medium">Street Address</label>
//               <input
//                 type="text"
//                 name="street"
//                 value={formData.street}
//                 onChange={(e) => setFormData({ ...formData, street: e.target.value })}
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               />
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium">City</label>
//               <input
//                 type="text"
//                 name="city"
//                 value={formData.city}
//                 onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               />
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium">State</label>
//               <input
//                 type="text"
//                 name="state"
//                 value={formData.state}
//                 onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               />
//             </div>
            
//             <div>
//               <label className="block mb-2 font-medium">ZIP Code</label>
//               <input
//                 type="text"
//                 name="zipCode"
//                 value={formData.zipCode}
//                 onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
//                 className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               />
//             </div>
//           </div>
          
//           <div className="mt-6 flex space-x-4">
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               Save Changes
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsEditing(false)}
//               className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default ProfilePage;

"use client";

import React, { useState } from 'react';
import { useUser } from '../../lib/context/UserContext';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { 
  User, 
  LogOut, 
  UserCircle, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Settings,
  ChevronRight
} from 'lucide-react';
import ProfileSection from '../ui/Components/userProfile/ProfileSection';
import OrdersSection from '../ui/Components/userProfile/OrderSection';
import AddressesSection from '../ui/Components/userProfile/AddressesSection';
import SettingsSection from '../ui/Components/userProfile/SettingsSection';
import FavoritesSection from '../ui/Components/userProfile/FavoritesSection';


const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const [activeTab, setActiveTab] = useState('profile');

  const getUserDisplayImage = () => {
    if (!user) return null;
    
    if (user.photoURL) {
      return (
        <img
          src={user.photoURL}
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
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
        return <ProfileSection user={user} />;
      case 'orders':
        return <OrdersSection />;
      case 'favorites':
        return <FavoritesSection />;
      case 'addresses':
        return <AddressesSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <ProfileSection user={user} />;
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
                <h2 className="mt-4 text-xl font-semibold">{user.fullName || 'No name set'}</h2>
                <p className="text-gray-600">{user.email}</p>
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
