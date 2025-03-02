"use client";

import Image from "next/image";

const SellingPlants = () => {
  return (
    <section className="bg-white text-black py-16 px-6 md:px-12 flex flex-col md:flex-row items-center">
      <div className="md:w-1/2 text-left">
        <h2 className="text-2xl font-bold mb-4">Start Selling Your Plants</h2>
        <p className="mb-6">
          Turn your passion for plants into profit. Join our marketplace and connect with plant enthusiasts worldwide.
        </p>
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-black">List Your Plants</h3>
            <p className="text-black">Take beautiful photos and create compelling listings</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black">Ship with Care</h3>
            <p className="text-black">We provide guidance on safe plant packaging</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black">Earn Money</h3>
            <p className="text-black">Get paid securely through our platform</p>
          </div>
        </div>
        <button className="bg-black border border-black text-white px-6 py-2 rounded-lg font-semibold">Open Shop</button>
      </div>
      <div className="md:w-1/2 flex justify-center mt-8 md:mt-0 relative">
        <div className="w-3/4 h-3/4 rounded-full overflow-hidden">
          <Image src="/Buy-Selling.svg" alt="Selling Plants" width={600} height={400} className="object-cover" />
        </div>
      </div>
    </section>
  );
};

export default SellingPlants;
