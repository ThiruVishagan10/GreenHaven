"use client";

import { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import { UserAuth } from '@/lib/context/AuthContent';
import { Loader2, Plus, MapPin, Edit2, Trash2 } from 'lucide-react';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

interface AddressFormData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

const initialFormData: AddressFormData = {
  street: '',
  city: '',
  state: '',
  postalCode: '',
};

export default function AddressesSection() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const { user } = UserAuth();

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setAddresses(userDoc.data().addresses || []);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        alert('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      let updatedAddresses: Address[];

      if (editingId) {
        // Update existing address
        updatedAddresses = addresses.map(addr => 
          addr.id === editingId 
            ? { ...formData, id: editingId, isDefault: addr.isDefault }
            : addr
        );
      } else {
        // Add new address
        const newAddress: Address = {
          ...formData,
          id: Date.now().toString(),
          isDefault: addresses.length === 0 // Make default if first address
        };
        updatedAddresses = [...addresses, newAddress];
      }

      await updateDoc(userRef, { addresses: updatedAddresses });
      setAddresses(updatedAddresses);
      resetForm();
      alert(editingId ? 'Address updated' : 'Address added');
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address');
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
    });
    setEditingId(address.id);
    setIsAddingNew(true);
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this address?')) return;

    try {
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses
      });
      setAddresses(updatedAddresses);
      alert('Address deleted');
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;

    try {
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses
      });
      setAddresses(updatedAddresses);
      alert('Default address updated');
    } catch (error) {
      console.error('Error updating default address:', error);
      alert('Failed to update default address');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setIsAddingNew(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Delivery Addresses</h3>
        {!isAddingNew && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            <Plus size={20} />
            Add New Address
          </button>
        )}
      </div>

      {isAddingNew && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Street Address</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white p-4 rounded-lg shadow-sm relative"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  {address.isDefault && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded mb-2 inline-block">
                      Default
                    </span>
                  )}
                  <p className="text-sm text-gray-600">
                    {address.street}, {address.city}, {address.state} {address.postalCode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="p-1 text-gray-600 hover:text-green-600"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="p-1 text-gray-600 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {!address.isDefault && (
              <button
                onClick={() => handleSetDefault(address.id)}
                className="mt-2 text-sm text-green-600 hover:text-green-700"
              >
                Set as default
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
