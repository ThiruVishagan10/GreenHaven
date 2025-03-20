
import Hero from "@/components/Components/Home/Hero";
import Plants from "@/components/Components/Home/PlantCategories";
import ProfessionalGardenServices from "@/components/Components/Home/ProfessionalGardenServices";
import ContactSection from "@/components/Components/Home/ContactSection";
import TestimonialSlider from "@/components/Components/Home/TestimonialSlider";
import OurTeam from "@/components/Components/Home/OurTeam";
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
