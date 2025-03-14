"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { PlusCircle, Edit2, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { 
  getAddresses, 
  addAddress, 
  updateAddress, 
  removeAddress, 
  setDefaultAddress,
  type Address 
} from '@/services/address';

interface AddressFormData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

const AddressesSection = () => {
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch addresses when component mounts
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.uid) return;
      
      try {
        setIsLoading(true);
        const userAddresses = await getAddresses(user.uid);
        setAddresses(userAddresses);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setError('Failed to load addresses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const resetForm = () => {
    setFormData({
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: false
    });
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.street || !formData.city || !formData.state || !formData.postalCode || !formData.country) {
      setError('All fields are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user?.uid) return;

    setIsSubmitting(true);
    try {
      const addressData: Address = {
        ...formData,
        isDefault: editingIndex !== null 
          ? addresses[editingIndex].isDefault 
          : addresses.length === 0
      };

      if (editingIndex !== null) {
        await updateAddress(user.uid, editingIndex, addressData);
      } else {
        await addAddress(user.uid, addressData);
      }

      const updatedAddresses = await getAddresses(user.uid);
      setAddresses(updatedAddresses);
      setIsAddingAddress(false);
      setEditingIndex(null);
      resetForm();
    } catch (error) {
      console.error('Error saving address:', error);
      setError('Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (index: number) => {
    const address = addresses[index];
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setEditingIndex(index);
    setIsAddingAddress(true);
    setError(null);
  };

  const handleDelete = async (index: number) => {
    if (!user?.uid) return;

    const addressToDelete = addresses[index];
    if (addressToDelete.isDefault) {
      if (!window.confirm('This is your default address. Are you sure you want to remove it?')) {
        return;
      }
    } else if (!window.confirm('Are you sure you want to remove this address?')) {
      return;
    }

    try {
      await removeAddress(user.uid, index);
      const updatedAddresses = await getAddresses(user.uid);
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error('Error removing address:', error);
      setError('Failed to remove address. Please try again.');
    }
  };

  const handleSetDefault = async (index: number) => {
    if (!user?.uid) return;

    try {
      await setDefaultAddress(user.uid, index);
      const updatedAddresses = await getAddresses(user.uid);
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error('Error setting default address:', error);
      setError('Failed to set default address. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsAddingAddress(false);
    setEditingIndex(null);
    resetForm();
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please login to manage your addresses.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
        {!isAddingAddress && (
          <button
            onClick={() => setIsAddingAddress(true)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Address
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      {isAddingAddress && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingIndex !== null ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {addresses.length === 0 && !isAddingAddress ? (
          <p className="text-gray-500 text-center py-4">No addresses saved yet.</p>
        ) : (
          addresses.map((address, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{address.street}</p>
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-gray-600">{address.country}</p>
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(index)}
                      className="text-gray-600 hover:text-green-600"
                      title="Set as default"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressesSection;
