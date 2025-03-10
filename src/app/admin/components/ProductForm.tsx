"use client"

import React, { useEffect, useState } from 'react'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { createNewProduct, ProductData, UpdateProduct } from '@/lib/firestore/createProduct/write';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProduct } from '@/lib/firestore/product/read_server';
import { categoryOptions } from "../../../lib/categories";

// Interfaces
interface FormData {
  name?: string;
  category?: string;
  price?: string;
  offeredPrice?: string;
  specialOffers?: string[];
  description?: string;
  mainImage?: string;
  additionalImages?: string[];
}

interface ImagePreview {
  url: string;
  file: File;
}

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

async function uploadImage(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file provided');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'my-uploads');

  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/djvma8ajq/image/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export default function ProductForm() {
  const router = useRouter();
  const [data, setData] = useState<FormData | null>(null);
  const [mainImage, setMainImage] = useState<ImagePreview | null>(null);
  const [additionalImages, setAdditionalImages] = useState<ImagePreview[]>([]);
  const [specialOffers, setSpecialOffers] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const fetchData = async() => {
    try {
      if (!id) {
        throw new Error('Product ID is missing');
      }
      const res = await getProduct({ id });
      if (!res) {
        alert("No product found");
      } else {
        setData(res);
        if (res.mainImage) {
          setMainImage({
            url: res.mainImage,
            file: new File([], '') // Empty file indicates existing image
          });
        }
        if (res.additionalImages) {
          setAdditionalImages(res.additionalImages.map((image) => ({
            url: image,
            file: new File([], '') // Empty file indicates existing image
          })));
        }
        // if (res.specialOffers) {
        //   setSpecialOffers(res.specialOffers);
        // }
      }
    } catch (error) {
      alert(error);
    }
  };
  
  useEffect(() => {
    if(id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key: string, value: string) => {
    setData((prevData) => ({
      ...(prevData ?? {}),
      [key]: value,
    }));
  };

  const handleAddSpecialOffer = () => {
    setSpecialOffers([...specialOffers, '']);
  };

  const handleSpecialOfferChange = (index: number, value: string) => {
    const newOffers = [...specialOffers];
    newOffers[index] = value;
    setSpecialOffers(newOffers);
  };

  const removeSpecialOffer = (index: number) => {
    setSpecialOffers(specialOffers.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setData(null);
    setMainImage(null);
    setAdditionalImages([]);
    setSpecialOffers([]);
    setSubmitError(null);
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      setMainImage({
        url: previewUrl,
        file: file
      });
    } catch (error) {
      console.error('Error handling main image:', error);
      alert('Failed to handle main image');
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        file: file
      }));
      setAdditionalImages(prev => [...prev, ...newPreviews]);
    } catch (error) {
      console.error('Error handling additional images:', error);
      alert('Failed to handle additional images');
    }
  };

  const removeMainImage = () => {
    if (mainImage) {
      URL.revokeObjectURL(mainImage.url);
      setMainImage(null);
    }
  };

  const removeAdditionalImage = (index: number) => {
    URL.revokeObjectURL(additionalImages[index].url);
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!data?.name || !data?.category || !data?.price || !data?.description || 
        !data?.offeredPrice) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    if (!mainImage?.file) {
      setSubmitError('Main image is required');
      return;
    }

    if (additionalImages.length === 0) {
      setSubmitError('At least one additional image is required');
      return;
    }

    try {
      setIsSubmitting(true);

      const mainImageUrl = await uploadImage(mainImage.file);
      const additionalImageUrls = await Promise.all(
        additionalImages.map(img => uploadImage(img.file))
      );

      const productData = {
        id: crypto.randomUUID(),
        name: data.name,
        category: data.category,
        price: data.price,
        offeredPrice: data.offeredPrice,
        specialOffers: specialOffers.filter(offer => offer.trim() !== ''),
        description: data.description,
        mainImage: mainImageUrl,
        additionalImages: additionalImageUrls
      };

      await createNewProduct({ data: productData });
      
      resetForm();
      alert('Product created successfully!');
      router.push('/admin/product');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!id || !data?.name || !data?.category || !data?.price || !data?.description ||
        !data?.offeredPrice) {
      setSubmitError('All fields are required');
      return;
    }
  
    if (!mainImage) {
      setSubmitError('Main image is required');
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      let mainImageUrl = mainImage.url;
      if (mainImage.file.size > 0) {
        mainImageUrl = await uploadImage(mainImage.file);
      }
  
      const additionalImageUrls = await Promise.all(
        additionalImages.map(async (img) => {
          if (img.file.size > 0) {
            return await uploadImage(img.file);
          }
          return img.url;
        })
      );
  
      const productData: ProductData = {
        id,
        name: data.name,
        category: data.category,
        price: data.price,
        offeredPrice: data.offeredPrice,
        specialOffers: specialOffers.filter(offer => offer.trim() !== ''),
        description: data.description,
        mainImage: mainImageUrl,
        additionalImages: additionalImageUrls
      };
  
      await UpdateProduct({ data: productData });
  
      alert('Product Updated successfully!');
      router.push('/admin/product');
      
    } catch (error) {
      console.error('Error updating form:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{id ? "Update" : "Add New"} Plant </h1>
      </div>
      <form className="w-full" onSubmit={id ? handleUpdate : handleSubmit}>
        <div className="space-y-6 p-6">
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{submitError}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={data?.name || ''}
              onChange={(e) => handleData('name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
  value={data?.category || ''}
  onChange={(e) => handleData('category', e.target.value)}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
>
  {categoryOptions.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              value={data?.price || ''}
              onChange={(e) => handleData('price', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label htmlFor="offeredPrice" className="block text-sm font-medium text-gray-700">Offered Price</label>
            <input
              type="number"
              id="offeredPrice"
              value={data?.offeredPrice || ''}
              onChange={(e) => handleData('offeredPrice', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Special Offers</label>
            <div className="space-y-2">
              {specialOffers.map((offer, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={offer}
                    onChange={(e) => handleSpecialOfferChange(index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Enter special offer"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecialOffer(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSpecialOffer}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Special Offer
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows={3}
              value={data?.description || ''}
              onChange={(e) => handleData('description', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Main Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Main Image</label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="hidden"
                id="mainImage"
              />
              <label
                htmlFor="mainImage"
                className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Image
              </label>
            </div>
            {mainImage && (
              <div className="mt-2 relative inline-block">
                <Image
                  src={mainImage.url}
                  alt="Main product image"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Additional Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Images</label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
                className="hidden"
                id="additionalImages"
              />
              <label
                htmlFor="additionalImages"
                className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Images
              </label>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4">
              {additionalImages.map((image, index) => (
                <div key={index} className="relative inline-block">
                  <Image
                    src={image.url}
                    alt={`Additional product image ${index + 1}`}
                    width={150}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isUploading || isSubmitting}
              className="flex items-center justify-center bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
              {(isUploading || isSubmitting) && <LoadingSpinner />}
              {isUploading 
                ? 'Uploading...' 
                : isSubmitting 
                ? (id ? 'Updating...' : 'Creating...') 
                : (id ? 'Update Product' : 'Create Product')
              }
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
