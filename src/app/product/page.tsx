// import ContactUs from '@/components/Components/Product/ContactUs'
import Hero from '@/components/Components/Product/Hero';
import ProductSlider from '@/components/Components/Product/ProductSlider';

export default function page() {
  return (
    <div>
      {/* <ProductList /> */}
      <Hero />
      <ProductSlider category="Indoor Plants" />
      <ProductSlider category="Outdoor Plants" />
      <ProductSlider category="Flowering Plants" />
      {/* <ContactUs /> */}
    </div>
  )
}
