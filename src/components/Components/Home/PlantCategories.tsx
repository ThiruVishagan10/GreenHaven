"use client";

import PlantSlider from "../CustomSlider";

interface PlantCategory {
  id: number;
  name: string;
  image: string;
  description: string;
  path: string;
}

const categories: PlantCategory[] = [
  { 
    id: 1, 
    name: "Indoor Plants", 
    image: "/hero.svg", 
    description: "Perfect for enhancing your indoor spaces.",
    path: "/product/indoorplants"
  },
  { 
    id: 2, 
    name: "Outdoor Plants", 
    image: "/hero.svg", 
    description: "Ideal for gardens, patios, and outdoor landscapes.",
    path: "/product/outdoorplants"
  },
  { 
    id: 3, 
    name: "Flowering Plants", 
    image: "/hero.svg", 
    description: "Add color to your garden with our flowering plants.",
    path: "/product/floweringplants"
  },
  { 
    id: 4, 
    name: "Fruit Trees", 
    image: "/hero.svg", 
    description: "Grow fresh fruits with our fruit trees.",
    path: "/product/fruitTrees"
  },
  { 
    id: 5, 
    name: "Avenue Trees", 
    image: "/1.jpg", 
    description: "Grow fresh fruits with our fruit trees.",
    path: "/product/avenueTrees"
  },
  { 
    id: 6, 
    name: "Bonsai", 
    image: "/hero.svg", 
    description: "Grow fresh fruits with our fruit trees.",
    path: "/product/bonsai"
  },
  { 
    id: 7, 
    name: "Medicinal Plants", 
    image: "/hero.svg", 
    description: "Grow fresh fruits with our fruit trees.",
    path: "/product/medicinalPlants"
  },
];


const PlantCategoriesComponent: React.FC = () => {
  return (
    <section className="p-8 bg-white">
      <h3 className="text-2xl font-bold text-center">Discover Our Plant Categories</h3>
      <div className="mt-6">
        <PlantSlider items={categories} /> {/* ✅ Fixed prop name */}
      </div>
    </section>
  );
};

export default PlantCategoriesComponent;