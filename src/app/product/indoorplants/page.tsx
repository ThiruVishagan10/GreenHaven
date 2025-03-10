// "use client";

// import { useParams } from "next/navigation";

// import Hero from "@/app/ui/Components/Product/template/Hero";
// import ProductList from "@/app/ui/Components/Product/IndoorPlants/ProductList";

// const page = () => {
//   const params = useParams();
//   const id = params?.id as string; // Ensure correct type

//   if (!id) {
//     return <p className="text-center text-gray-500 text-lg">Product ID not found 🪴</p>;
//   }

//   return (
//     <div>
//      <ProductList />
//     </div>
//   );
// };

// export default page;

"use client";

import ProductList from "@/app/ui/Components/Product/IndoorPlants/ProductList";
import ProductListComponent from "@/app/ui/Components/Product/ProductListComponent";
import React from 'react'

const IndoorPlants = () => {
  return (
    <div>
      {/* <ProductList /> */}
      <ProductListComponent category="Indoor Plants" />;
    </div>
  )
}

export default IndoorPlants;