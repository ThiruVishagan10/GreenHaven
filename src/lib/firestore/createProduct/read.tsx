import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";

interface ProductData {
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

interface GetProductsResponse {
  success: boolean;
  data: ProductData[];
  error?: string;
}

interface GetProductProps {
  id: string;
}

export const getProducts = async (): Promise<GetProductsResponse> => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products: ProductData[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data() as ProductData;
      products.push({
        ...data,
        id: doc.id,
      });
    });

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch products",
    };
  }
};

export const getProduct = async ({ id }: GetProductProps): Promise<ProductData | null> => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as ProductData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};
