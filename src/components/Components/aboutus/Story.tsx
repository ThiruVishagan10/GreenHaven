"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Story = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative z-10 flex justify-center -mt-20" // Increased z-index & moved it up
    >
      {/* Container with Background */}
      <div className="bg-[#fdf8f3] shadow-lg rounded-xl p-10 w-full max-w-7xl">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Image on the Left */}
          <div className="w-full md:w-1/2">
            <Image
              src="/story.svg"
              alt="Greenhouse"
              width={600}
              height={350}
              className="rounded-lg object-cover"
            />
          </div>

          {/* Text on the Right */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              Vels Nursery Garden
              Bringing Nature Closer to You Since 2013
              Vels Nursery Garden was started in 2013 by <b>Mr. T. Thangavelu</b> an agricultural expert with over 40 years of hands-on experience in farming, horticulture, and organic practices. A retired Additional Director of Agriculture, his passion for plants led him to start this journey in Manapakkam, Chennai, under the name Hortitech Nursery & Services.
              <br></br><br></br>From the very beginning, we’ve been passionate about making gardening easy and accessible. In fact, we were among the first to introduce terrace gardening in Chennai, and we’ve helped set up over 800+ terrace gardens across the city. We’ve also partnered with the <b>MSME – Government of India</b> to conduct training programs on terrace gardening, nursery development, and mushroom cultivation.
              Over the years, we’ve worked on some amazing landscape projects for places like <br></br><b>Chennai Airport, Ennore Port, and Indian Oil</b> – all backed by our deep understanding of soil, space, and sustainability.
            </p>
          </div>
        </div>

        {/* Mission & Values Section */}
        <div className="mt-12 flex flex-col md:flex-row items-start justify-between gap-6">
          {/* Our Mission */}
          <div className="flex items-start gap-4 w-full md:w-1/2">
            <div className="bg-black text-white rounded-lg p-3 flex items-center justify-center">
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Our Mission</h3>
              <p className="text-gray-700">
                To provide high-quality plants and expert gardening solutions
                while promoting environmental sustainability and beauty in every
                space.
              </p>
            </div>
          </div>

          {/* Our Values */}
          <div className="flex items-start gap-4 w-full md:w-1/2">
            <div className="bg-black text-white rounded-lg p-3 flex items-center justify-center">
              <span className="text-xl">❤️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Our Values</h3>
              <p className="text-gray-700">
                Quality, Sustainability, Customer Service, and Environmental
                Stewardship guide everything we do.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Story;
