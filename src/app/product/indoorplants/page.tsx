"use client";

import ProductListComponent from "@/components/Components/Product/ProductListComponent";
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