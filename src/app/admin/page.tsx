// app/admin/page.tsx
"use client"

import { useProducts } from "@/lib/firestore/createProduct/read";
import { CircularProgress } from "@nextui-org/react";

export default function AdminPage() {
  const { data: products, error, isLoading } = useProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="text-gray-500">Total Products</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-12">
              <CircularProgress size="sm" />
            </div>
          ) : error ? (
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
      </div>

      {/* Recent Products List */}
      <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Recent Products</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <CircularProgress />
          </div>
        ) : error ? (
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Show only the 5 most recent products */}
                {products.slice(0, 5).map((product) => (
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
