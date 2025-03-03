
import Hero from "@/app/ui/Components/Home/Hero";
import Plants from "@/app/ui/Components/Home/PlantCategories";
import ProfessionalGardenServices from "@/app/ui/Components/Home/ProfessionalGardenServices";
import ContactSection from "@/app/ui/Components/Home/ContactSection";
import TestimonialSlider from "@/app/ui/Components/Home/TestimonialSlider";
import OurTeam from "@/app/ui/Components/Home/OurTeam";
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
