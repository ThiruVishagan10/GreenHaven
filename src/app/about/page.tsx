import Leading from "../ui/Components/aboutus/Leading";
import Story from "../ui/Components/aboutus/Story";
import Product from "../ui/Components/aboutus/Product";
import OurTeam from "../ui/Components/Home/OurTeam";
import CustomerReviews from "../ui/Components/aboutus/CustomerReview";
import Journey from "../ui/Components/aboutus/Journey";
import Location from "../ui/Components/aboutus/Location";

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
