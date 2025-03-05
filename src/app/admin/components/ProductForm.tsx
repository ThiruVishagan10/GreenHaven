// app/admin/components/ProductForm.tsx
"use client"

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { createNewProduct } from '@/lib/firestore/createProduct/write';

interface ImagePreview {
  url: string;
  file: File;
}

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  description: string;
  mainImage?: string;
  additionalImages?: string[];
}

interface FormData {
  name?: string;
  category?: string;
  price?: string;
  description?: string;
  mainImage?: string;
  additionalImages?: string[];
}

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export default function ProductForm() {
  const [data, setData] = useState<FormData | null>(null);
  const [mainImage, setMainImage] = useState<ImagePreview | null>(null);
  const [additionalImages, setAdditionalImages] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleData = (key: string, value: string) => {
    setData((prevData) => {
      return {
        ...(prevData ?? {}),
        [key]: value,
      };
    });
  };

  const resetForm = () => {
    setData(null);
    setMainImage(null);
    setAdditionalImages([]);
    setSubmitError(null);
  };

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

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setMainImage({
        url: previewUrl,
        file: file
      });

      // Upload image
      const uploadedUrl = await uploadImage(file);
      setData(prevData => ({
        ...(prevData ?? {}),
        mainImage: uploadedUrl
      }));
    } catch (error) {
      console.error('Error handling main image:', error);
      alert('Failed to upload main image');
    } finally {
      setIsUploading(false);
    }
  }

  const handleAdditionalImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      
      // Create previews
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        file: file
      }));
      setAdditionalImages(prev => [...prev, ...newPreviews]);

      // Upload images
      const uploadPromises = files.map(file => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setData(prevData => ({
        ...(prevData ?? {}),
        additionalImages: [...(prevData?.additionalImages || []), ...uploadedUrls]
      }));
    } catch (error) {
      console.error('Error handling additional images:', error);
      alert('Failed to upload additional images');
    } finally {
      setIsUploading(false);
    }
  }

  const removeMainImage = () => {
    if (mainImage) {
      URL.revokeObjectURL(mainImage.url);
      setMainImage(null);
      setData(prevData => ({
        ...(prevData ?? {}),
        mainImage: undefined
      }));
    }
  }

  const removeAdditionalImage = (index: number) => {
    URL.revokeObjectURL(additionalImages[index].url);
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setData(prevData => ({
      ...(prevData ?? {}),
      additionalImages: prevData?.additionalImages?.filter((_, i) => i !== index)
    }));
  }

  // In your ProductForm.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitError(null);
  
  if (isUploading) {
    alert('Please wait for images to finish uploading');
    return;
  }

  // Validate required fields
  if (!data?.name || !data?.category || !data?.price || !data?.description) {
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

    // Prepare the product data
    const productData = {
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description,
    };

    // Call createNewProduct with the form data and images
    const result = await createNewProduct({
      data: productData,
      mainImage: mainImage.file,
      additionalImages: additionalImages.map(img => img.file)
    });

    // Clear form after successful submission
    resetForm();
    
    // Show success message
    alert('Product created successfully!');
    
  } catch (error) {
    console.error('Error submitting form:', error);
    setSubmitError(error instanceof Error ? error.message : 'Failed to create product');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="space-y-6 p-6">
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Plant Name
            </label>
            <input
              type="text"
              id="name"
              value={data?.name ?? ''}
              onChange={(e) => handleData('name', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              required
              placeholder="Enter plant name"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={data?.category ?? ''}
              onChange={(e) => handleData('category', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              required
              placeholder="Enter category"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={data?.price ?? ''}
              onChange={(e) => handleData('price', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              required
              placeholder="Enter price"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Plant Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={data?.description ?? ''}
              onChange={(e) => handleData('description', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
              required
              placeholder="Enter detailed plant description including care instructions, size, growing conditions, etc."
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image (Front Page)
            </label>
            <div className="mt-1">
              {mainImage ? (
                <div className="relative">
                  <Image
                    src={mainImage.url}
                    alt="Main preview"
                    width={200}
                    height={200}
                    className="object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="main-image"
                  className="group relative flex flex-col items-center justify-center h-[300px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload 
                      className="mx-auto h-12 w-12 text-gray-400 group-hover:text-green-500 transition-colors" 
                      aria-hidden="true" 
                    />
                    <p className="mt-2 text-sm text-gray-500 group-hover:text-green-500 transition-colors">
                      Click to upload main image
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    id="main-image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Additional Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images
            </label>
            <div className="mt-1">
              <div className="grid grid-cols-2 gap-4">
                {additionalImages.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image.url}
                      alt={`Preview ${index + 1}`}
                      width={150}
                      height={150}
                      className="object-cover rounded-lg w-full h-[150px]"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                <label
                  htmlFor="additional-images"
                  className="group relative flex flex-col items-center justify-center h-[300px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload 
                      className="h-12 w-12 text-gray-400 group-hover:text-green-500 transition-colors" 
                      aria-hidden="true" 
                    />
                    <p className="mt-2 text-sm text-gray-500 group-hover:text-green-500 transition-colors text-center">
                      Add more images
                    </p>
                    <p className="text-xs text-gray-500">Select multiple images</p>
                  </div>
                  <input
                    id="additional-images"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
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
            {isUploading ? 'Uploading...' : isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </div>
    </form>
  )
}
