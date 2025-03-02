import ContactUs from '../Components/Product/ContactUs'
import FloweringPlants from '../Components/Product/FloweringPlants'
import Product from '../Components/Product/Hero'
import IndoorPlants from '../Components/Product/IndoorPlants'
import OutdoorPlants from '../Components/Product/OutdoorPlants'

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
