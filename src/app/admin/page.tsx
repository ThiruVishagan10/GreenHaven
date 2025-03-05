// app/admin/page.tsx
"use client"

import { useProducts } from "@/lib/firestore/createProduct/read";
import { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import { getAdmins } from "@/lib/firestore/admin/read";
import { useAdminAuth } from "@/lib/context/AdminAuth";
import AdminOnly from "@/components/AdminOnly";
import { UserAuth } from "@/lib/context/AuthContent";

interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export default function AdminPage() {
  const { user } = UserAuth();
  const { isAdmin } = useAdminAuth();
  const { data: products, error: productError, isLoading: productsLoading } = useProducts();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const adminData = await getAdmins();
        setAdmins(adminData);
      } catch (error) {
        setAdminError('Failed to fetch admins');
        console.error('Error fetching admins:', error);
      } finally {
        setIsLoadingAdmins(false);
      }
    };

    if (isAdmin) {
      fetchAdmins();
    }
  }, [isAdmin]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Please log in to continue</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Products Stats */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="text-gray-500">Total Products</h3>
          {productsLoading ? (
            <div className="flex justify-center items-center h-12">
              <CircularProgress size="sm" />
            </div>
          ) : productError ? (
            <p className="text-red-500">Error loading products</p>
          ) : (
            <>
              <p className="text-2xl font-bold">{products?.length || 0}</p>
              <span className="text-sm text-blue-500">
                Available Products
              </span>
            </>
          )}
        </div>

        {/* Admin-only Stats */}
        <AdminOnly>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="text-gray-500">Total Admins</h3>
            {isLoadingAdmins ? (
              <div className="flex justify-center items-center h-12">
                <CircularProgress size="sm" />
              </div>
            ) : adminError ? (
              <p className="text-red-500">Error loading admins</p>
            ) : (
              <>
                <p className="text-2xl font-bold">{admins?.length || 0}</p>
                <span className="text-sm text-blue-500">
                  Registered Admins
                </span>
              </>
            )}
          </div>
        </AdminOnly>
      </div>

      {/* Admin-only Section */}
      <AdminOnly>
        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Admin List</h2>
          {isLoadingAdmins ? (
            <div className="flex justify-center items-center h-32">
              <CircularProgress />
            </div>
          ) : adminError ? (
            <div className="text-red-500 text-center py-4">
              {adminError}
            </div>
          ) : !admins?.length ? (
            <div className="text-center py-4 text-gray-500">
              No admins available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added On
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {admin.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {admin.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {admin.createdAt 
                            ? new Date(admin.createdAt).toLocaleDateString()
                            : 'N/A'
                          }
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminOnly>

      {/* Products List - Visible to all users */}
      <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Recent Products</h2>
        {productsLoading ? (
          <div className="flex justify-center items-center h-32">
            <CircularProgress />
          </div>
        ) : productError ? (
          <div className="text-red-500 text-center py-4">
            Error loading products
          </div>
        ) : !products?.length ? (
          <div className="text-center py-4 text-gray-500">
            No products available
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  {/* Admin-only actions */}
                  <AdminOnly>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </AdminOnly>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.mainImage ? (
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${parseFloat(product.price).toFixed(2)}
                      </div>
                    </td>
                    {/* Admin-only actions */}
                    <AdminOnly>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </AdminOnly>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
