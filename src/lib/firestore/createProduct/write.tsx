
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

// Base interface for common fields
interface BaseProductData {
  name: string;
  category: string;
  price: string;
  description: string;
  mainImage: string;
  additionalImages: string[];
}

// Interface for product data with ID
export interface ProductData extends BaseProductData {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Props interfaces
interface CreateProductProps {
  data: ProductData;
}

interface UpdateProductProps {
  data: ProductData;
}

// Validation function
const validateProductData = (data: ProductData, isUpdate: boolean = false): void => {
  if (isUpdate && !data.id) {
    throw new Error('Product ID is required for update');
  }
  
  if (!data.name?.trim()) {
    throw new Error('Name is required');
  }
  
  if (!data.category?.trim()) {
    throw new Error('Category is required');
  }
  
  if (!data.price?.trim()) {
    throw new Error('Price is required');
  }
  
  if (!data.description?.trim()) {
    throw new Error('Description is required');
  }
  
  if (!data.mainImage?.trim()) {
    throw new Error('Main image URL is required');
  }
  
  if (!Array.isArray(data.additionalImages) || data.additionalImages.length === 0) {
    throw new Error('At least one additional image URL is required');
  }
  
  // Validate that all additional image URLs are strings and not empty
  if (data.additionalImages.some(url => typeof url !== 'string' || !url.trim())) {
    throw new Error('All additional image URLs must be valid strings');
  }
};

// Create new product
export const createNewProduct = async ({ data }: CreateProductProps): Promise<{ 
  success: boolean; 
  productId: string; 
  data: ProductData; 
}> => {
  try {
    // Validate the input data
    validateProductData(data);

    // Prepare product data with timestamps
    const productData: ProductData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore
    const productRef = doc(db, 'products', data.id);
    await setDoc(productRef, productData);

    return {
      success: true,
      productId: data.id,
      data: productData
    };

  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create product');
  }
};

// Update product
export const UpdateProduct = async ({ data }: UpdateProductProps): Promise<{
  success: boolean;
  productId: string;
  data: ProductData;
}> => {
  try {
    // Validate the input data
    validateProductData(data, true);

    // Prepare update data with timestamp
    const updateData: ProductData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    // Update in Firestore
    const productRef = doc(db, 'products', data.id);
    await updateDoc(productRef, { ...updateData });

    return {
      success: true,
      productId: data.id,
      data: updateData
    };

  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update product');
  }
};

// Helper function to check if a value is a non-empty string
const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

// Helper function to check if a value is a valid array of strings
const isValidStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
};

// Type guard for ProductData
export const isValidProductData = (data: unknown): data is ProductData => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const product = data as ProductData;

  return (
    isNonEmptyString(product.id) &&
    isNonEmptyString(product.name) &&
    isNonEmptyString(product.category) &&
    isNonEmptyString(product.price) &&
    isNonEmptyString(product.description) &&
    isNonEmptyString(product.mainImage) &&
    isValidStringArray(product.additionalImages)
  );
};

// Error class for product-related errors
export class ProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductError';
  }
}

// Function to format product data before saving
export const formatProductData = (data: ProductData): ProductData => {
  return {
    ...data,
    name: data.name.trim(),
    category: data.category.trim(),
    price: data.price.trim(),
    description: data.description.trim(),
    mainImage: data.mainImage.trim(),
    additionalImages: data.additionalImages.map(url => url.trim()),
    updatedAt: new Date().toISOString()
  };
};
