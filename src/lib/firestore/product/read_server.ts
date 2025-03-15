// lib/firestore/product/read_server.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Product } from "@/types/product";

interface GetProductParams {
    id: string;
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
