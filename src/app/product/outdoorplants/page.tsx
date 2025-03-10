"use client";

import ProductList from "@/app/ui/Components/Product/OutdoorPlants/ProductList";
import ProductListComponent from "@/app/ui/Components/Product/ProductListComponent";
import React from 'react'

const OutdoorPlants = () => {
  return (
    <div>
      {/* <ProductList /> */}
      <ProductListComponent category="Outdoor Plants" />;
    </div>
  )
}

export default OutdoorPlants;