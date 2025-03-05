// src/lib/firestore/createProduct/write.tsx
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

interface ProductData {
  name: string;
  category: string;
  price: string;
  description: string;
}

interface CreateProductProps {
  data: ProductData;
  mainImage: File;
  additionalImages: File[];
}

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

export const createNewProduct = async ({ data, mainImage, additionalImages }: CreateProductProps) => {
  // Validation checks
  if (!data?.name) {
    throw new Error('Name is required');
  }

  if (!data?.category) {
    throw new Error('Category is required');
  }

  if (!data?.price) {
    throw new Error('Price is required');
  }

  if (!data?.description) {
    throw new Error('Description is required');
  }

  if (!mainImage) {
    throw new Error('Main image is required');
  }

  if (additionalImages.length === 0) {
    throw new Error('At least one additional image is required');
  }

  try {
    // Upload main image
    const mainImageUrl = await uploadImage(mainImage);

    // Upload additional images
    const additionalImageUrls = await Promise.all(
      additionalImages.map(file => uploadImage(file))
    );

    // Generate new document ID
    const newId = doc(collection(db, 'ids')).id;

    // Create the product document
    const productData = {
      id: newId,
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description,
      mainImage: mainImageUrl,
      additionalImages: additionalImageUrls,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore
    await setDoc(doc(db, 'products', newId), productData);

    return {
      success: true,
      productId: newId,
      data: productData
    };

  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create product');
  }
};
