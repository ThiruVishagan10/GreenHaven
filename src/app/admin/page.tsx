"use client"

import { getProducts } from "../../lib/firestore/createProduct/read";
import { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";
import { ShoppingBag } from 'lucide-react';
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  offeredPrice: string;
  specialOffers: string[];
  description: string;
  mainImage: string;
  additionalImages: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productResponse = await getProducts();
        if (productResponse.success) {
          setProducts(productResponse.data);
        } else {
          setError(productResponse.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Products Card */}
        <Card className="bg-white">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Products</h2>
                <p className="text-gray-600">Total: {products.length}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-green-500" />
            </div>
            <Link 
              href="/admin/product"
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              View All Products →
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Products</h2>
        <Card>
          <CardBody>
            <div className="space-y-4">
              {/* Recent Products */}
              <div>
                <div className="space-y-2">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12">
                          {product.mainImage ? (
                            <img 
                              src={product.mainImage} 
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-gray-500">{product.category}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-green-600 font-medium">₹{parseFloat(product.offeredPrice).toFixed(2)}</span>
                        <span className="text-sm text-gray-500 line-through">₹{parseFloat(product.price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/CreateProduct">
            <Card className="bg-white hover:bg-gray-50 cursor-pointer">
              <CardBody>
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="h-6 w-6 text-green-500" />
                  <div>
                    <h3 className="font-medium">Add New Product</h3>
                    <p className="text-sm text-gray-500">Create a new product listing</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
          
          <Link href="/admin/product">
            <Card className="bg-white hover:bg-gray-50 cursor-pointer">
              <CardBody>
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="h-6 w-6 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Manage Products</h3>
                    <p className="text-sm text-gray-500">View and edit all products</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
