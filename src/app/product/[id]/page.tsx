import Delivery from "@/app/ui/Components/Product/template/Delivery";
import Feature from "@/app/ui/Components/Product/template/Feature";
import Hero from "@/app/ui/Components/Product/template/Hero";
import Share from "@/app/ui/Components/Product/template/Share";

interface ProductPageProps {
  params: { id: string };
}

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Hero productId={Array.isArray(params.id) ? params.id[0] : params.id} />
      <Share />
      <Feature />
      <Delivery />
    </div>
  );
};

export default ProductPage;
