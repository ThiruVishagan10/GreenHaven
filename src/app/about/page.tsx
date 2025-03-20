import Leading from "@/components/Components/aboutus/Leading";
import Story from "@/components/Components/aboutus/Story";
import OurTeam from "@/components/Components/aboutus/OurTeam";
import CustomerReviews from "@/components/Components/aboutus/CustomerReview";
import Journey from "@/components/Components/aboutus/Journey";
import Location from "@/components/Components/aboutus/Location";

export default function page() {
  return (
    <div>
      <Leading />
      <Story />
      {/* <Product /> */}
      <OurTeam />
      <Location />
      <CustomerReviews />
      <Journey />
    </div>
  );
}
