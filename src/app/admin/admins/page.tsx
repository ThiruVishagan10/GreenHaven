// app/admin/admins/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { createAdmin, updateAdmin, deleteAdmin } from '../../../lib/firestore/admin/write';
import { getAdmins } from '../../../lib/firestore/admin/read';

interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', email: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const adminData = await getAdmins();
      setAdmins(adminData);
    } catch (error) {
      setError('Failed to fetch admins');
      console.error('Error fetching admins:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newAdmin.name.trim() || !newAdmin.email.trim()) {
      setError('Name and email are required');
      return;
    }

    try {
      setIsLoading(true);
      const adminData: Admin = {
        id: crypto.randomUUID(),
        name: newAdmin.name.trim(),
        email: newAdmin.email.trim(),
        createdAt: new Date().toISOString()
      };

      await createAdmin({ data: adminData });
      setNewAdmin({ name: '', email: '' });
      fetchAdmins(); // Refresh the list
    } catch (error) {
      setError('Failed to create admin');
      console.error('Error creating admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editData.name.trim() || !editData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    try {
      setIsLoading(true);
      const adminData: Admin = {
        id,
        name: editData.name.trim(),
        email: editData.email.trim()
      };

      await updateAdmin({ data: adminData });
      setIsEditing(null);
      fetchAdmins(); // Refresh the list
    } catch (error) {
      setError('Failed to update admin');
      console.error('Error updating admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        setIsLoading(true);
        await deleteAdmin(id);
        fetchAdmins(); // Refresh the list
      } catch (error) {
        setError('Failed to delete admin');
        console.error('Error deleting admin:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startEditing = (admin: Admin) => {
    setIsEditing(admin.id);
    setEditData({ name: admin.name, email: admin.email });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admins</h1>
      </div>

      {/* Add New Admin Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Admin</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
        >
          {isLoading ? 'Adding...' : 'Add Admin'}
        </button>
      </form>

      {/* Admins List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {admins.map((admin) => (
          <div key={admin.id} className="bg-white p-6 rounded-lg shadow-md">
            {isEditing === admin.id ? (
              // Edit Form
              <div>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleUpdate(admin.id)}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Display Admin Info
              <>
                <h3 className="text-xl font-semibold mb-2">{admin.name}</h3>
                <p className="text-gray-600 mb-4">{admin.email}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => startEditing(admin)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
