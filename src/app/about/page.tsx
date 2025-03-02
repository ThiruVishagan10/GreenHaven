import Leading from "../Components/aboutus/Leading";
import Story from "../Components/aboutus/Story";
import Product from "../Components/aboutus/Product";
import OurTeam from "../Components/aboutus/OurTeam";
import CustomerReviews from "../Components/aboutus/CustomerReview";
import Journey from "../Components/aboutus/Journey";
import Location from "../Components/aboutus/Location";

export default function page() {
  return (
    <div>
      <Leading />
      <Story />
      <Product />
      <OurTeam />
      <Location />
      <CustomerReviews />
      <Journey />
    </div>
  );
}
