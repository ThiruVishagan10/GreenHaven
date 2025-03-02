import ContactUs from '../ui/Components/Product/ContactUs';
import FloweringPlants from '../ui/Components/Product/FloweringPlants';
import Product from '../ui/Components/aboutus/Product';
import IndoorPlants from '../ui/Components/Product/IndoorPlants';
import OutdoorPlants from '../ui/Components/Product/OutdoorPlants';

export default function page() {
  return (
    <div>
      <Product />
      <IndoorPlants />
      <OutdoorPlants />
      <FloweringPlants />
      <ContactUs />
    </div>
  )
}
