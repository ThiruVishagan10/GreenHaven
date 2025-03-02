"use client";

import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-12 bg-white">
      {/* Left Side - Text Content */}
      <div className="max-w-lg text-left">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          Transform Your Space with Beautiful Blooms
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Transform your space with our carefully curated collection of flowering 
          plants. From vibrant roses to delicate orchids, find the perfect bloom to 
          bring color and life to your garden.
        </p>
        <Link href="/products">
          <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition">
            Explore Collection
          </button>
        </Link>
      </div>

      {/* Right Side - Image */}
      <div className="w-full md:w-1/2 mt-8 md:mt-0 flex justify-center">
        <Image
          src="/Product-Hero.svg"  // Updated image source
          alt="Product Showcase"
          width={700} 
          height={700}
          className="rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default Hero;
