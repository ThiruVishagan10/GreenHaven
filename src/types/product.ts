
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

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  phoneNumber?: string;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';



export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface FavoritesContextType {
  favorites: Set<string>;
  isLoading: boolean;
  addresses: Address[];
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  getFavoriteCount: () => number;
  addAddress: (address: Address) => Promise<void>;
  updateAddress: (index: number, address: Address) => Promise<void>;
  removeAddress: (index: number) => Promise<void>;
  setDefaultAddress: (index: number) => Promise<void>;
}
