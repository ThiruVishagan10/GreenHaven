"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative w-full h-screen flex items-center justify-center text-center text-white bg-black"
    >
      {/* Background Image with Dark Overlay */}
      <div className="absolute opacity-60 inset-0">
        <Image
          src="/Product-Hero.svg"
          alt="Nursery Background"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
      </div>

      {/* Text Content */}
      <div className="relative z-10 max-w-3xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold"
        >
          Let's Dive Into The Inventory
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          viewport={{ once: true }}
          className="mt-4 text-lg"
        >
          Discover our extensive collection of plants and 
          gardening materials
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Hero;
