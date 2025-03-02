import Expert from "../Components/Services/Expert";
import Garden from "../Components/Services/Garden";
import Landscaping from "../Components/Services/Landscaping";
import ProfessionalServices from "../Components/Services/ProfessionalService";
import ServiceContact from "../Components/Services/ServiceContact";
import Terrace from "../Components/Services/Terrace";

export default function ProfessionalServicePage() {
  return (
    <div>
      <ProfessionalServices />
      <Landscaping />
      <Terrace />
      <Garden />
      <Expert />
      <ServiceContact />
    </div>
  );
}
