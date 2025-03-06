"use client";

import { useParams } from "next/navigation";
import ProductList from "@/app/ui/Components/Product/OutdoorPlants/ProductList";
import Hero from "@/app/ui/Components/Product/template/Hero";

const ProductPage = () => {
  const params = useParams();
  const id = params?.id as string; // Ensure correct type

  if (!id) {
    return <p className="text-center text-gray-500 text-lg">Product ID not found 🪴</p>;
  }

  return (
    <div>
      <Hero productId={id} /> {/* ✅ Pass ID correctly */}
      <ProductList />
    </div>
  );
};

export default ProductPage;
