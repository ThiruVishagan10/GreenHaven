

// "use client";

// import { useState, useEffect, use } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { Heart, ShoppingCart, Loader2, Plus, Minus } from 'lucide-react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../../../../firebase';
// import { useCart } from '@/lib/context/CartContext';
// import { useFavorites } from '../../../lib/context/FavoritesContext';
// import { UserAuth } from '@/lib/context/AuthContent';


// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: string;
//   offeredPrice: string;
//   mainImage: string | null;
//   category: string;
// }

// interface PageProps {
//   params: Promise<{ id: string }>;
// }

// export default function ProductPage({ params }: PageProps) {
//   const productId = use(params).id;
//   const router = useRouter();
//   const { user } = UserAuth();
//   const { addToCart, isItemInCart, cartItems } = useCart();
//   const { 
//     addToFavorites, 
//     removeFromFavorites, 
//     isFavorite, 
//     loading: favoriteLoading 
//   } = useFavorites();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [quantity, setQuantity] = useState(1);

//   // Get current quantity if item is in cart
//   useEffect(() => {
//     const cartItem = cartItems.find(item => item.id === productId);
//     if (cartItem) {
//       setQuantity(cartItem.quantity);
//     }
//   }, [cartItems, productId]);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         const productDoc = await getDoc(doc(db, 'products', productId));
        
//         if (productDoc.exists()) {
//           setProduct({
//             id: productDoc.id,
//             ...productDoc.data()
//           } as Product);
//         } else {
//           setError('Product not found');
//           router.push('/products');
//         }
//       } catch (error) {
//         console.error('Error fetching product:', error);
//         setError('Failed to load product');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId, router]);

//   const handleFavoriteClick = async () => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     if (!product) return;

//     try {
//       if (isFavorite(product.id)) {
//         await removeFromFavorites(product.id);
//       } else {
//         await addToFavorites({
//           id: product.id,
//           name: product.name,
//           price: parseFloat(product.offeredPrice),
//           image: product.mainImage || ''
//         });
//       }
//     } catch (error) {
//       console.error('Error handling favorite:', error);
//     }
//   };

//   const handleQuantityChange = (action: 'increase' | 'decrease') => {
//     if (action === 'increase') {
//       setQuantity(prev => Math.min(prev + 1, 10));
//     } else {
//       setQuantity(prev => Math.max(prev - 1, 1));
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     if (!product) return;

//     try {
//       setIsAddingToCart(true);
//       await addToCart({
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         offeredPrice: product.offeredPrice,
//         mainImage: product.mainImage,
//         quantity: quantity
//       });
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader2 className="h-12 w-12 animate-spin text-green-500" />
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4">
//             {error || 'Product not found'}
//           </h2>
//           <button
//             onClick={() => router.push('/products')}
//             className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
//           >
//             Back to Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const discount = Math.round(
//     ((parseFloat(product.price) - parseFloat(product.offeredPrice)) / parseFloat(product.price)) * 100
//   );

//   const isInCart = isItemInCart(product.id);
//   const isProductFavorite = isFavorite(product.id);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Product Image */}
//         <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
//           {product.mainImage ? (
//             <Image
//               src={product.mainImage}
//               alt={product.name}
//               fill
//               className="object-cover"
//               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
//               priority
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center">
//               <span className="text-gray-400">No image available</span>
//             </div>
//           )}
//         </div>

//         {/* Product Details */}
//         <div className="flex flex-col">
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
//               <p className="text-sm text-gray-500 mt-1">{product.category}</p>
//             </div>
//             <button
//               onClick={handleFavoriteClick}
//               disabled={favoriteLoading}
//               className={`p-2 rounded-full transition-colors ${
//                 isProductFavorite
//                   ? 'text-red-500 hover:text-red-600'
//                   : 'text-gray-400 hover:text-gray-500'
//               }`}
//               aria-label={isProductFavorite ? 'Remove from favorites' : 'Add to favorites'}
//             >
//               {favoriteLoading ? (
//                 <Loader2 className="h-6 w-6 animate-spin" />
//               ) : (
//                 <Heart className={`h-6 w-6 ${isProductFavorite ? 'fill-current' : ''}`} />
//               )}
//             </button>
//           </div>

//           <div className="mt-6">
//             <div className="flex items-baseline gap-2">
//               <span className="text-2xl font-bold text-green-600">
//                 ₹{product.offeredPrice}
//               </span>
//               {discount > 0 && (
//                 <>
//                   <span className="text-lg text-gray-500 line-through">
//                     ₹{product.price}
//                   </span>
//                   <span className="text-sm text-green-600">
//                     ({discount}% OFF)
//                   </span>
//                 </>
//               )}
//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="text-sm font-medium text-gray-900">Description</h3>
//             <div className="mt-2 text-sm text-gray-600 space-y-2">
//               <p>{product.description}</p>
//             </div>
//           </div>

//           {/* Quantity Selector */}
//           <div className="mt-6">
//             <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
//             <div className="flex items-center border border-gray-300 rounded-md w-fit">
//               <button
//                 onClick={() => handleQuantityChange('decrease')}
//                 disabled={quantity <= 1}
//                 className={`p-2 transition-colors ${
//                   quantity <= 1 
//                     ? 'text-gray-300 cursor-not-allowed' 
//                     : 'text-gray-600 hover:bg-gray-100'
//                 }`}
//                 aria-label="Decrease quantity"
//               >
//                 <Minus className="h-4 w-4" />
//               </button>
//               <span className="px-6 py-2 text-gray-900 select-none">
//                 {quantity}
//               </span>
//               <button
//                 onClick={() => handleQuantityChange('increase')}
//                 disabled={quantity >= 10}
//                 className={`p-2 transition-colors ${
//                   quantity >= 10 
//                     ? 'text-gray-300 cursor-not-allowed' 
//                     : 'text-gray-600 hover:bg-gray-100'
//                 }`}
//                 aria-label="Increase quantity"
//               >
//                 <Plus className="h-4 w-4" />
//               </button>
//             </div>
//             {quantity >= 10 && (
//               <p className="text-sm text-gray-500 mt-1">
//                 Maximum quantity reached
//               </p>
//             )}
//           </div>

//           {/* Total Price */}
//           <div className="mt-6">
//             <div className="flex items-baseline gap-2">
//               <span className="text-sm text-gray-500">Total:</span>
//               <span className="text-2xl font-bold text-green-600">
//                 ₹{(parseFloat(product.offeredPrice) * quantity).toFixed(2)}
//               </span>
//               {discount > 0 && (
//                 <span className="text-lg text-gray-500 line-through">
//                   ₹{(parseFloat(product.price) * quantity).toFixed(2)}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Add to Cart Button */}
//           <div className="mt-6">
//             <button
//               onClick={handleAddToCart}
//               disabled={isAddingToCart}
//               className={`w-full py-3 px-4 rounded-md transition-colors
//                 flex items-center justify-center gap-2 
//                 ${isAddingToCart 
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-green-600 hover:bg-green-700'} 
//                 text-white`}
//             >
//               {isAddingToCart ? (
//                 <Loader2 className="h-5 w-5 animate-spin" />
//               ) : (
//                 <>
//                   <ShoppingCart className="h-5 w-5" />
//                   {isInCart ? 'Update Cart' : 'Add to Cart'} - 
//                   ₹{(parseFloat(product.offeredPrice) * quantity).toFixed(2)}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingCart, Loader2, Plus, Minus } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useCart } from '@/lib/context/CartContext';
import { useFavorites } from '../../../lib/context/FavoritesContext';
import { UserAuth } from '@/lib/context/AuthContent';
import { Product } from '@/types/product';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const productId = use(params).id;
  const router = useRouter();
  const { user } = UserAuth();
  const { addToCart, isItemInCart, cartItems } = useCart();
  const { 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite, 
    loading: favoriteLoading 
  } = useFavorites();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Get current quantity if item is in cart
  useEffect(() => {
    const cartItem = cartItems.find(item => item.id === productId);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItems, productId]);

  // Set selected image when product loads
  useEffect(() => {
    if (product?.mainImage) {
      setSelectedImage(product.mainImage);
    }
  }, [product]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const productDoc = await getDoc(doc(db, 'products', productId));
        
        if (productDoc.exists()) {
          setProduct({
            id: productDoc.id,
            ...productDoc.data()
          } as Product);
        } else {
          setError('Product not found');
          router.push('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (!product) return;

    try {
      if (isFavorite(product.id)) {
        await removeFromFavorites(product.id);
      } else {
        await addToFavorites({
          id: product.id,
          name: product.name,
          price: parseFloat(product.offeredPrice),
          image: product.mainImage || ''
        });
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
      setError('Failed to update favorite status');
    }
  };

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(prev => Math.min(prev + 1, 10));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!product) return;

    try {
      setIsAddingToCart(true);
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        offeredPrice: product.offeredPrice,
        mainImage: product.mainImage,
        quantity: quantity,
        description: product.description
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => router.push('/products')}
            className="mt-4 text-blue-500 hover:underline"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const discount = Math.round(
    ((parseFloat(product.price) - parseFloat(product.offeredPrice)) / parseFloat(product.price)) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="flex flex-col gap-4">
          {/* Main Image with Favorite Button */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {selectedImage && (
              <>
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                  priority
                />
                {/* Favorite Button */}
                <button
                  onClick={handleFavoriteClick}
                  disabled={favoriteLoading}
                  className={`absolute top-4 right-4 p-2.5 rounded-full 
                    bg-white/80 backdrop-blur-sm shadow-md 
                    hover:bg-white transition-all duration-200 z-10
                    ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {favoriteLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                  ) : (
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        isFavorite(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-6 gap-2">
            {/* Main Image Thumbnail */}
            <button
              onClick={() => setSelectedImage(product.mainImage)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 
                ${selectedImage === product.mainImage 
                  ? 'border-green-500' 
                  : 'border-transparent hover:border-green-200'}`}
            >
              <Image
                src={product.mainImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 20vw, 10vw"
              />
            </button>

            {/* Additional Images */}
            {product.additionalImages?.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 
                  ${selectedImage === image 
                    ? 'border-green-500' 
                    : 'border-transparent hover:border-green-200'}`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, 10vw"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-2 text-gray-500">{product.category}</p>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-2xl font-bold text-green-600">
              ₹{product.offeredPrice}
            </span>
            <span className="text-lg text-gray-500 line-through">
              ₹{product.price}
            </span>
            {discount > 0 && (
              <span className="text-sm text-green-600">
                ({discount}% OFF)
              </span>
            )}
          </div>

          {product.specialOffers.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Special Offers</h3>
              <ul className="list-disc list-inside space-y-1">
                {product.specialOffers.map((offer, index) => (
                  <li key={index} className="text-green-700">{offer}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => handleQuantityChange('decrease')}
                className="p-2 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <Minus size={20} />
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() => handleQuantityChange('increase')}
                className="p-2 hover:bg-gray-100"
                disabled={quantity >= 10}
              >
                <Plus size={20} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {isAddingToCart ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <ShoppingCart size={20} />
                  <span>{isItemInCart(product.id) ? 'Update Cart' : 'Add to Cart'}</span>
                </>
              )}
            </button>
          </div>

          {quantity >= 10 && (
            <p className="text-sm text-gray-500">
              Maximum quantity limit reached
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
