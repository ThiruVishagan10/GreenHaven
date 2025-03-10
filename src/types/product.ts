
export interface Product {
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
  
  export interface Admin {
    id: string;
    name: string;
    email: string;
    role: string;
  }
  
  export interface ProductListProps {
    category: string;
    itemsPerPage?: number;
    initialPriceRange?: number;
    className?: string;
  }
  

  export interface SortOption {
    value: string;
    label: string;
  }
  
  export const SORT_OPTIONS: SortOption[] = [
    { value: "featured", label: "Featured" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "name-a-z", label: "Name: A to Z" },
    { value: "name-z-a", label: "Name: Z to A" },
    { value: "newest", label: "Newest First" }
  ];

  export interface User {
    id: string;
    email: string;
    favorites?: string[];
  }