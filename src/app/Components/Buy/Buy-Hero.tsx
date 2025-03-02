"use client";

import React from "react";

const BuyHero = () => {
  return (
    <section className="bg-white text-black py-16 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
      {/* Left Content */}
      <div className="w-full md:w-1/2 text-left max-w-md md:max-w-lg px-6">
        <h2 className="text-5xl font-bold mb-4">Discover & Share Beautiful Plants</h2>
        <p className="text-gray-400 mb-6">
          Join our thriving community of plant lovers. Buy unique plants or sell your green treasures in our curated marketplace.
        </p>
        <button className="bg-black text-white border border-black px-6 py-2 rounded-md font-semibold hover:bg-green-600">
          Start Shopping
        </button>
        <button className=" text-black border border-black px-6 py-2 ml-5 rounded-md font-semibold hover:bg-green-600 hover:text-white ">
          Sell Product
        </button>
      </div>

      {/* Right Image Section */}
      <div className="relative w-full md:w-[50%] flex justify-end">
        <div className="relative w-full md:w-[90%] h-auto  rounded-tl-[50%] overflow-hidden">
          <img
            src="/Buy-Hero.svg"
            alt="Beautiful plants"
            className="w-full h-auto object-cover rounded-tl-[50%]"
          />
        </div>
      </div>
    </section>
  );
};

export default BuyHero;
