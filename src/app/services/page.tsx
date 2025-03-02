import Expert from "../ui/Components/Services/Expert";
import Garden from "../ui/Components/Services/Garden";
import Landscaping from "../ui/Components/Services/Landscaping";
import ProfessionalServices from "../ui/Components/Services/ProfessionalService";
import ServiceContact from "../ui/Components/Services/ServiceContact";
import Terrace from "../ui/Components/Services/Terrace";

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
