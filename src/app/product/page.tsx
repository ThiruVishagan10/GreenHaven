import ContactUs from '../ui/Components/Product/ContactUs';
import FloweringPlants from '../ui/Components/Product/FloweringPlants';
import Product from '../ui/Components/aboutus/Product';
import IndoorPlants from '../ui/Components/Product/IndoorPlants';
import OutdoorPlants from '../ui/Components/Product/OutdoorPlants';
import Hero from '../ui/Components/Product/Hero';
import ProductSlider from '../ui/Components/Product/ProductSlider';

export default function page() {
  return (
    <div>
      {/* <ProductList /> */}
      <Hero />
      <ProductSlider category="Indoor Plants" />
      <ProductSlider category="Outdoor Plants" />
      <ProductSlider category="Flowering Plants" />
      <ContactUs />
    </div>
  )
}
