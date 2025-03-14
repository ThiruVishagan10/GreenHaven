
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Loader2,
  Camera
} from 'lucide-react';
import { UserAuth } from '@/lib/context/AuthContent';
import { 
  doc, 
  updateDoc,
  getDoc 
} from 'firebase/firestore';
import { db } from '../../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface UserProfile {
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  dateJoined: string;
  addresses?: {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
    isDefault: boolean;
  }[];
}


export default function ProfileSection() {
  const router = useRouter();
  const { user, loading: authLoading } = UserAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [editForm, setEditForm] = useState({
    displayName: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setProfile(userData);
          setEditForm({
            displayName: userData.displayName || '',
            phoneNumber: userData.phoneNumber || '',
            address: userData.addresses?.find(addr => addr.isDefault)?.street || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, router]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when canceling edit
      setEditForm({
        displayName: profile?.displayName || '',
        phoneNumber: profile?.phoneNumber || '',
        address: profile?.addresses?.find(addr => addr.isDefault)?.street || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSaving(true);
      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        ...editForm,
        updatedAt: new Date().toISOString()
      });

      setProfile(prev => ({
        ...prev!,
        ...editForm
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  async function uploadImage(file: File): Promise<string> {
    if (!file) {
      throw new Error('No file provided');
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my-uploads'); // Changed to match your working preset name
    formData.append('cloud_name', 'djvma8ajq');
  
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/djvma8ajq/image/upload', {
        method: 'POST',
        body: formData,
        // Add headers to handle CORS
        headers: {
          'Accept': 'application/json',
        },
      });
  
      // Log the raw response for debugging
      console.log('Raw Response:', response);
  
      // Check if the response is ok
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
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;
  
    try {
      setIsUploadingImage(true);
      const file = e.target.files[0];
      
      // Log file details for debugging
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
  
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
  
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
  
      // Upload to Cloudinary
      const photoURL = await uploadImage(file);
      console.log('Upload successful, URL:', photoURL);
  
      if (!photoURL) {
        throw new Error('No URL returned from upload');
      }
  
      // Update user profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { 
        photoURL,
        updatedAt: new Date().toISOString()
      });
  
      setProfile(prev => ({
        ...prev!,
        photoURL
      }));
  
      alert('Profile picture updated');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'Failed to update profile picture');
    } finally {
      setIsUploadingImage(false);
    }
  };
  

  const getDefaultAddress = (profile: UserProfile) => {
    if (!profile.addresses || profile.addresses.length === 0) {
      return null;
    }
    
    const defaultAddress = profile.addresses.find(addr => addr.isDefault);
    return defaultAddress || profile.addresses[0]; // Fallback to first address if no default
  };


  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Profile Information</h2>
          <button
            onClick={handleEditToggle}
            disabled={isSaving}
            className="flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            <Edit2 className="h-4 w-4" />
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                {profile.photoURL ? (
                  <Image
                    src={profile.photoURL}
                    alt={profile.displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-green-600 rounded-full text-white cursor-pointer hover:bg-green-700 transition-colors">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Click the camera icon to update your profile picture
            </p>
          </div>

          {/* Profile Details Section */}
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={editForm.displayName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editForm.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{profile.displayName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">
                      {profile.phoneNumber || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
  <MapPin className="h-5 w-5 text-green-600" />
  <div>
    <p className="text-sm text-gray-500">Default Address</p>
    {(() => {
      const defaultAddress = getDefaultAddress(profile);
      if (!defaultAddress) {
        return <p className="font-medium">Not provided</p>;
      }
      return (
        <div>
          <p className="font-medium">{defaultAddress.name}</p>
          <p className="text-sm text-gray-600">
            {defaultAddress.street}, {defaultAddress.city},
          </p>
          <p className="text-sm text-gray-600">
            {defaultAddress.state} {defaultAddress.postalCode}
          </p>
          <p className="text-sm text-gray-600">{defaultAddress.phone}</p>
        </div>
      );
    })()}
  </div>
</div>



              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
