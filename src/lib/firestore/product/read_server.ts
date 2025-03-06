// lib/firestore/product/read_server.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

interface GetProductParams {
    id: string;
}

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

export const getProduct = async ({ id }: GetProductParams): Promise<Product | null> => {
    try {
        // Fix the syntax error in the parentheses
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Add the id to the returned data
            return {
                id: docSnap.id,
                ...docSnap.data()
            } as Product;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};
