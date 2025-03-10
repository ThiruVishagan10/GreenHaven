"use client";


import ProductList from '@/app/ui/Components/Product/FloweringPlants/ProductList';
import ProductListComponent from '@/app/ui/Components/Product/ProductListComponent';
import React from 'react'

const FloweringPlants = () => {
  return (
    <div>
      {/* <ProductList /> */}
      <ProductListComponent category="Flowering Plants" />;
    </div>
  )
}

export default FloweringPlants;