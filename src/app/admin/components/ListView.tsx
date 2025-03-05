// app/admin/components/ListView.tsx
"use client"

import Image from "next/image";
import { formatDistanceToNow } from 'date-fns';
import { useState } from "react";
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  mainImage?: string;
  additionalImages?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ListViewProps {
  products: Product[];
  onDelete?: () => void;
}

function ListView({ products, onDelete }: ListViewProps) {
    const [imageError, setImageError] = useState<{[key: string]: boolean}>({});
    const [isDeleting, setIsDeleting] = useState<{[key: string]: boolean}>({});

    const router = useRouter();


    const handleImageError = (productId: string) => {
        setImageError(prev => ({
            ...prev,
            [productId]: true
        }));
    };

    // Delete handler
    const handleDelete = async (id: string, productName: string) => {
        // Show confirmation alert with product name
        if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
            return;
        }

        setIsDeleting(prev => ({ ...prev, [id]: true }));
        
        try {
            const productRef = doc(db, 'products', id);
            await deleteDoc(productRef);
            
            // Show success alert
            alert('Product deleted successfully');
            
            // Refresh the products list
            if (onDelete) {
                onDelete();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            // Show error alert
            alert('Failed to delete product. Please try again.');
        } finally {
            setIsDeleting(prev => ({ ...prev, [id]: false }));
        }
    };



    const ImageComponent = ({ src, alt, productId }: { src: string, alt: string, productId: string }) => {
        if (imageError[productId]) {
            return (
                <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-xs text-gray-500">No image</span>
                </div>
            );
        }

        return (
            <div className="relative h-16 w-16">
                <Image
                    src={src}
                    alt={alt}
                    width={64}
                    height={64}
                    className="object-cover rounded-md"
                    onError={() => handleImageError(productId)}
                    unoptimized
                />
            </div>
        );
    };

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">No products found</p>
            </div>
        );
    }

    const handleUpdate = async(id: string) => {
        router.push(`/admin/CreateProduct?id=${id}`);
        
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                {product.mainImage ? (
                                    <ImageComponent
                                        src={product.mainImage}
                                        alt={product.name}
                                        productId={product.id}
                                    />
                                ) : (
                                    <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                                        <span className="text-xs text-gray-500">No image</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-500">
                                    {product.category}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    ${parseFloat(product.price).toFixed(2)}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                    {product.description}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-500">
                                    {product.createdAt ? (
                                        formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })
                                    ) : (
                                        'N/A'
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                <button
                                        onClick={() => handleUpdate(product.id)}
                                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                   
                                    <button
                                        onClick={() => handleDelete(product.id, product.name)}
                                        disabled={isDeleting[product.id]}
                                        className={`text-red-600 hover:text-red-900 text-sm font-medium 
                                            ${isDeleting[product.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isDeleting[product.id] ? 'Deleting...' : 'Delete'}
                                    </button>
                                    
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}



export default ListView;
