"use client"

import { useParams } from "next/navigation";
import ProductList from "@/app/ui/Components/Product/OutdoorPlants/ProductList";
import Hero from "@/app/ui/Components/Product/template/Hero";

const ProductPage = () => {
  const { id } = useParams(); // Get the product ID from the URL

  return (
    <div>
      <Hero productId={id} /> {/* Pass ID to Hero */}
      <ProductList />
    </div>
  );
};

export default ProductPage;
