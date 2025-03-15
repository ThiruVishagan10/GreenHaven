
// "use client";

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Calendar, 
//   Edit2, 
//   Loader2,
//   Camera
// } from 'lucide-react';
// import { UserAuth } from '@/lib/context/AuthContent';
// import { 
//   doc, 
//   updateDoc,
//   getDoc 
// } from 'firebase/firestore';
// import { db } from '../../../../../firebase';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// interface UserProfile {
//   displayName: string;
//   email: string;
//   phoneNumber: string;
//   photoURL: string;
//   dateJoined: string;
//   addresses?: {
//     id: string;
//     name: string;
//     street: string;
//     city: string;
//     state: string;
//     postalCode: string;
//     phone: string;
//     isDefault: boolean;
//   }[];
// }


// export default function ProfileSection() {
//   const router = useRouter();
//   const { user, loading: authLoading } = UserAuth();
  
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isUploadingImage, setIsUploadingImage] = useState(false);
  
//   const [editForm, setEditForm] = useState({
//     displayName: '',
//     phoneNumber: '',
//     address: ''
//   });

//   useEffect(() => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     const fetchUserProfile = async () => {
//       try {
//         setIsLoading(true);
//         const userDoc = await getDoc(doc(db, 'users', user.uid));
        
//         if (userDoc.exists()) {
//           const userData = userDoc.data() as UserProfile;
//           setProfile(userData);
//           setEditForm({
//             displayName: userData.displayName || '',
//             phoneNumber: userData.phoneNumber || '',
//             address: userData.addresses?.find(addr => addr.isDefault)?.street || ''
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching user profile:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [user, router]);

//   const handleEditToggle = () => {
//     if (isEditing) {
//       // Reset form when canceling edit
//       setEditForm({
//         displayName: profile?.displayName || '',
//         phoneNumber: profile?.phoneNumber || '',
//         address: profile?.addresses?.find(addr => addr.isDefault)?.street || ''
//       });
//     }
//     setIsEditing(!isEditing);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     try {
//       setIsSaving(true);
//       const userRef = doc(db, 'users', user.uid);
      
//       await updateDoc(userRef, {
//         ...editForm,
//         updatedAt: new Date().toISOString()
//       });

//       setProfile(prev => ({
//         ...prev!,
//         ...editForm
//       }));

//       setIsEditing(false);
//     } catch (error) {
//       console.error('Error updating profile:', error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   async function uploadImage(file: File): Promise<string> {
//     if (!file) {
//       throw new Error('No file provided');
//     }
  
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', 'my-uploads'); // Changed to match your working preset name
//     formData.append('cloud_name', 'djvma8ajq');
  
//     try {
//       const response = await fetch('https://api.cloudinary.com/v1_1/djvma8ajq/image/upload', {
//         method: 'POST',
//         body: formData,
//         // Add headers to handle CORS
//         headers: {
//           'Accept': 'application/json',
//         },
//       });
  
//       // Log the raw response for debugging
//       console.log('Raw Response:', response);
  
//       // Check if the response is ok
//       if (!response.ok) {
//         const errorData = await response.text();
//         console.error('Upload failed with status:', response.status);
//         console.error('Error response:', errorData);
//         throw new Error(`Upload failed: ${response.status} ${errorData}`);
//       }
  
//       const data = await response.json();
//       console.log('Upload response data:', data);
  
//       if (!data.secure_url) {
//         throw new Error('No secure URL in response');
//       }
  
//       return data.secure_url;
//     } catch (error) {
//       console.error('Detailed upload error:', error);
//       throw error;
//     }
//   }
  
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!user || !e.target.files || !e.target.files[0]) return;
  
//     try {
//       setIsUploadingImage(true);
//       const file = e.target.files[0];
      
//       // Log file details for debugging
//       console.log('File details:', {
//         name: file.name,
//         type: file.type,
//         size: file.size
//       });
  
//       // Validate file type and size
//       if (!file.type.startsWith('image/')) {
//         alert('Please upload an image file');
//         return;
//       }
  
//       if (file.size > 5 * 1024 * 1024) { // 5MB limit
//         alert('Image size should be less than 5MB');
//         return;
//       }
  
//       // Upload to Cloudinary
//       const photoURL = await uploadImage(file);
//       console.log('Upload successful, URL:', photoURL);
  
//       if (!photoURL) {
//         throw new Error('No URL returned from upload');
//       }
  
//       // Update user profile in Firestore
//       const userRef = doc(db, 'users', user.uid);
//       await updateDoc(userRef, { 
//         photoURL,
//         updatedAt: new Date().toISOString()
//       });
  
//       setProfile(prev => ({
//         ...prev!,
//         photoURL
//       }));
  
//       alert('Profile picture updated');
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       alert(error instanceof Error ? error.message : 'Failed to update profile picture');
//     } finally {
//       setIsUploadingImage(false);
//     }
//   };
  

//   const getDefaultAddress = (profile: UserProfile) => {
//     if (!profile.addresses || profile.addresses.length === 0) {
//       return null;
//     }
    
//     const defaultAddress = profile.addresses.find(addr => addr.isDefault);
//     return defaultAddress || profile.addresses[0]; // Fallback to first address if no default
//   };


//   if (authLoading || isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <Loader2 className="h-8 w-8 animate-spin text-green-500" />
//       </div>
//     );
//   }

//   if (!user || !profile) {
//     return null;
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="flex justify-between items-start mb-6">
//           <h2 className="text-2xl font-bold">Profile Information</h2>
//           <button
//             onClick={handleEditToggle}
//             disabled={isSaving}
//             className="flex items-center gap-2 text-green-600 hover:text-green-700"
//           >
//             <Edit2 className="h-4 w-4" />
//             {isEditing ? 'Cancel' : 'Edit'}
//           </button>
//         </div>

//         <div className="flex flex-col md:flex-row gap-8">
//           {/* Profile Image Section */}
//           <div className="flex flex-col items-center space-y-4">
//             <div className="relative">
//               <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
//                 {profile.photoURL ? (
//                   <Image
//                     src={profile.photoURL}
//                     alt={profile.displayName}
//                     fill
//                     className="object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center">
//                     <User className="h-16 w-16 text-gray-400" />
//                   </div>
//                 )}
//                 {isUploadingImage && (
//                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <Loader2 className="h-8 w-8 animate-spin text-white" />
//                   </div>
//                 )}
//               </div>
//               <label className="absolute bottom-0 right-0 p-2 bg-green-600 rounded-full text-white cursor-pointer hover:bg-green-700 transition-colors">
//                 <Camera className="h-4 w-4" />
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   disabled={isUploadingImage}
//                 />
//               </label>
//             </div>
//             <p className="text-sm text-gray-500">
//               Click the camera icon to update your profile picture
//             </p>
//           </div>

//           {/* Profile Details Section */}
//           <div className="flex-1">
//             {isEditing ? (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     name="displayName"
//                     value={editForm.displayName}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={editForm.phoneNumber}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Address
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={editForm.address}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isSaving}
//                   className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
//                 >
//                   {isSaving ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                       Saving...
//                     </div>
//                   ) : (
//                     'Save Changes'
//                   )}
//                 </button>
//               </form>
//             ) : (
//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <User className="h-5 w-5 text-green-600" />
//                   <div>
//                     <p className="text-sm text-gray-500">Full Name</p>
//                     <p className="font-medium">{profile.displayName}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Mail className="h-5 w-5 text-green-600" />
//                   <div>
//                     <p className="text-sm text-gray-500">Email</p>
//                     <p className="font-medium">{profile.email}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Phone className="h-5 w-5 text-green-600" />
//                   <div>
//                     <p className="text-sm text-gray-500">Phone Number</p>
//                     <p className="font-medium">
//                       {profile.phoneNumber || 'Not provided'}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//   <MapPin className="h-5 w-5 text-green-600" />
//   <div>
//     <p className="text-sm text-gray-500">Default Address</p>
//     {(() => {
//       const defaultAddress = getDefaultAddress(profile);
//       if (!defaultAddress) {
//         return <p className="font-medium">Not provided</p>;
//       }
//       return (
//         <div>
//           <p className="font-medium">{defaultAddress.name}</p>
//           <p className="text-sm text-gray-600">
//             {defaultAddress.street}, {defaultAddress.city},
//           </p>
//           <p className="text-sm text-gray-600">
//             {defaultAddress.state} {defaultAddress.postalCode}
//           </p>
//           <p className="text-sm text-gray-600">{defaultAddress.phone}</p>
//         </div>
//       );
//     })()}
//   </div>
// </div>



//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// ProfileSection.tsx
"use client";

import { useState, useRef } from 'react';
import { Loader2, PencilIcon, CheckIcon, XIcon, Camera, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

interface ProfileSectionProps {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  addresses?: Address[];
  onUpdateProfile?: (data: { displayName: string; phoneNumber: string; photoURL?: string }) => Promise<void>;
}

const ProfileSection = ({ 
  displayName, 
  email, 
  photoURL, 
  phoneNumber,
  addresses,
  onUpdateProfile 
}: ProfileSectionProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    displayName: displayName || '',
    phoneNumber: phoneNumber || '',
    photoURL: photoURL || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  async function uploadImage(file: File): Promise<string> {
    if (!file) {
      throw new Error('No file provided');
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my-uploads');
    formData.append('cloud_name', 'djvma8ajq');
  
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/djvma8ajq/image/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Upload failed with status:', response.status);
        console.error('Error response:', errorData);
        throw new Error(`Upload failed: ${response.status} ${errorData}`);
      }
  
      const data = await response.json();
      console.log('Upload response data:', data);
  
      if (!data.secure_url) {
        throw new Error('No secure URL in response');
      }
  
      return data.secure_url;
    } catch (error) {
      console.error('Detailed upload error:', error);
      throw error;
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
  
    try {
      setIsUploadingImage(true);
      const file = e.target.files[0];
      
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
  
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }
  
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }
  
      const photoURL = await uploadImage(file);
      console.log('Upload successful, URL:', photoURL);
  
      if (!photoURL) {
        throw new Error('No URL returned from upload');
      }
  
      setEditedProfile(prev => ({
        ...prev,
        photoURL
      }));

      // If not in edit mode, update profile immediately
      if (!isEditing && onUpdateProfile) {
        await onUpdateProfile({
          ...editedProfile,
          photoURL
        });
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!onUpdateProfile) return;

    try {
      setIsLoading(true);
      setError(null);
      await onUpdateProfile(editedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Profile Details</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
          >
            <PencilIcon size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckIcon size={16} />
              )}
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedProfile({
                  displayName: displayName || '',
                  phoneNumber: phoneNumber || '',
                  photoURL: photoURL || ''
                });
                setError(null);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-700"
            >
              <XIcon size={16} />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Image */}
      <div className="flex justify-center">
        <div className="relative">
          <div 
            className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 cursor-pointer"
            onClick={handleImageClick}
          >
            {isUploadingImage ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : (
              <>
                {editedProfile.photoURL ? (
                  <Image
                    src={editedProfile.photoURL}
                    alt={editedProfile.displayName || 'Profile picture'}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-4xl text-gray-400">
                      {editedProfile.displayName?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          <button 
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Change profile picture"
          >
            <Camera size={16} className="text-gray-600" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            aria-label="Upload profile picture"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="displayName"
                value={editedProfile.displayName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-gray-900">{displayName || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <p className="text-gray-900">{email || 'Not available'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phoneNumber"
                value={editedProfile.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your phone number"
              />
            ) : (
              <p className="text-gray-900">{phoneNumber || 'Not set'}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Verification
            </label>
            <p className="text-gray-900">
              {email ? 'Verified' : 'Not verified'}
            </p>
          </div>

          {/* Addresses Section */}
          <div>
  <div className="flex items-center justify-between mb-2">
    <label className="block text-sm font-medium text-gray-700">
      Default Delivery Address
    </label>
    </div>
  
  {addresses && addresses.length > 0 ? (
    <>
      {addresses.find(address => address.isDefault) ? (
        <div className="p-3 border rounded-lg bg-gray-50 relative">
          {addresses
            .filter(address => address.isDefault)
            .map(address => (
              <div key={address.id} className="text-sm text-gray-900">
                <p className="font-medium">{address.street}</p>
                <p className="text-gray-600">
                  {address.city}, {address.state} {address.postalCode}
                </p>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 p-3 border rounded-lg bg-gray-50">
          <p>No default address set</p>
          
        </div>
      )}
    </>
  ) : (
    <div className="text-sm text-gray-500 p-3 border rounded-lg bg-gray-50">
      <p>No addresses added yet</p>
      </div>
  )}
</div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
