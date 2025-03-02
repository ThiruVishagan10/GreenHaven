import Plants from "./Components/Home/PlantCategories";
import ProfessionalGardenServices from "./Components/Home/ProfessionalGardenServices";
import Hero from "./Components/Home/Hero";
import TestimonialSlider from './Components/Home/TestimonialSlider'; 
import ContactSection from "./Components/Home/ContactSection";
import OurTeam from "./Components/Home/OurTeam";
import AuthPage from "./Components/Home/AuthPage";

export default function Home() {
  return (
    <div className="font-sans bg-white text-black">  
      <AuthPage />
      {/* <Hero />
      <Plants />      
      <ProfessionalGardenServices />
      <ContactSection />
      <TestimonialSlider />
      <OurTeam /> */}
    </div>

    
  );
}
