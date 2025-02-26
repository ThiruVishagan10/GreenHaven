import Image from "next/image";
import { FaTree, FaLeaf, FaWater, FaHandsHelping } from "react-icons/fa";
import Plants from "./PlantCategories";
import ProfessionalGardenServices from "./ProfessionalGardenServices";
import Hero from "./Hero";
import TestimonialSlider from './TestimonialSlider'; 
import ContactSection from "./ContactSection";
import OurTeam from "./OurTeam";

export default function Home() {
  return (
    <div className="font-sans bg-white text-black">  
      <Hero />
      <Plants />      
      <ProfessionalGardenServices />
      <ContactSection />
      <TestimonialSlider />
      <OurTeam />
    </div>

    
  );
}
