import ProductCard from "@/components/Product/ProductCard";
import { Product } from "@/types/products";

const ProductList = ({ products }: { products?: Product[] }) => {
  return (
    <>
      <h2 className="text-[22px] font-normal my-3">Just For You</h2>

      <div className="grid gap-2 grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
        {(products || []).map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};

export default ProductList;
