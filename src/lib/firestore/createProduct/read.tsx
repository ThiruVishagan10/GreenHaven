// "use client";

// import { collection, onSnapshot } from 'firebase/firestore'
// import useSWRSubscription from 'swr/subscription'
// import { db } from '../../../../firebase';
 
// export function useProducts() {
//   const { data , error } = useSWRSubscription(["products"], ([path], { next }) => {
//     const ref = collection(db, path);
//     const unsub = onSnapshot(
//         ref,
//       (snapshot) => next(null, snapshot.docs.length ===0 ? null : snapshot.docs.map((snap)=> snap.data)),
//       (err) => next(err)
//     );

//     return () => unsub();
//   })
 
//   return {data,error:error?.message, isLoading: data === undefined };
// }
// lib/firestore/createProduct/read.ts
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';

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

interface UseProductsReturn {
    data: Product[] | null;
    error: Error | null;
    isLoading: boolean;
}

export function useProducts(): UseProductsReturn {
    const [data, setData] = useState<Product[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const products = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];
                setData(products);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch products'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return { data, error, isLoading };
}
