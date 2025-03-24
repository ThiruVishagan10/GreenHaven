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
