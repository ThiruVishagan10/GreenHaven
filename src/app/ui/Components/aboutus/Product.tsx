"use client";

import CustomSlider from "../CustomSlider";

interface PlantCategory {
  id: number;
  name: string;
  image: string;
  description: string;
}

const reviews: PlantCategory[] = [
  { id: 1, name: "Indoor Plants", image: "/hero.svg", description: "Perfect for enhancing your indoor spaces." },
  { id: 2, name: "Outdoor Plants", image: "/hero.svg", description: "Ideal for gardens, patios, and outdoor landscapes." },
  { id: 3, name: "Flowering Plants", image: "/hero.svg", description: "Add color to your garden with our flowering plants." },
  { id: 4, name: "Fruit Trees", image: "/hero.svg", description: "Grow fresh fruits with our fruit trees." },
];

const Product: React.FC = () => {
  return (
    <section className="p-8 bg-white">
      <h3 className="text-2xl font-bold text-center">Discover Our Product Categories</h3>
      <div className="mt-6">
        <CustomSlider items={reviews} />
      </div>
    </section>
  );
};

export default Product;
