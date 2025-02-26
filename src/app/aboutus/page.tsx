import Leading from "./Leading";
import Story from "./Story";
import Product from "./Product";
import OurTeam from "./OurTeam";
import CustomerReviews from "./CustomerReview";
import Journey from "./Journey";
import Location from "./Location";

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
