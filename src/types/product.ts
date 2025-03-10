
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
  