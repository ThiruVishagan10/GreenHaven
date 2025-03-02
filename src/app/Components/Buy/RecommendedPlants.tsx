"use client";

import BuyCardSlider from "../BuyCardSlider";

interface Plant {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
}

const plants: Plant[] = [
  { id: 1, name: "Monstera Deliciosa", image: "/hero.svg", price: "$65.00", description: "A tropical plant with unique split leaves." },
  { id: 2, name: "Fiddle Leaf Fig", image: "/hero.svg", price: "$89.00", description: "An elegant plant perfect for indoor decor." },
  { id: 3, name: "Snake Plant", image: "/hero.svg", price: "$45.00", description: "A hardy plant that improves indoor air quality." },
  { id: 4, name: "ZZ Plant", image: "/hero.svg", price: "$55.00", description: "A low-maintenance plant with glossy leaves." },
];

const RecommendedPlants: React.FC = () => {
  return (
    <section className="p-8 bg-white">
      <h3 className="text-2xl font-bold text-center">Recommended Plants</h3>
      <div className="mt-6">
        <BuyCardSlider items={plants} />
      </div>
    </section>
  );
};

export default RecommendedPlants;
