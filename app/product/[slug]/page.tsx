"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchProduct } from "@/lib/actions/api";
import ProductImages from "@/components/Product/ProductImages";
import ProductPrice from "@/components/Product/ProductPrice";
import Rating from "@/components/Product/Rating";

const ProductPage = () => {
  const params = useParams();
  const slug = params?.slug;

  if (!slug || Array.isArray(slug)) return <p>Invalid product URL</p>;

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    enabled: !!slug,
  });

  return (
    <div className="bg-white mt-7 p-5">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="col-span-2">
          <ProductImages images={product?.data?.images || []} />
        </div>
        <div className="col-span-2">
          <div className="flex flex-col gap-1">
            <p>
              {product?.data?.brand} {product?.data?.category?.name}
            </p>
            <h1 className="font-bold text-[22px] text-[#37a001]">
              {product?.data?.name}
            </h1>

            {product?.data.rating ? (
              <div className="flex flex-row gap-1 items-center mb-2 text-[13px]">
                <p>
                  <Rating value={Number(product.data.rating)} />
                </p>
                <p>|</p>
                <p>Ratings </p>
                <p>{product.data.num_reviews}</p>
              </div>
            ) : (
              <p>No Ratings</p>
            )}

            <div className="flex flex-col gap-3 sm:flex-rowitems-center">
              <ProductPrice
                value={Number(product?.data.price)}
                className="w-25 text-[18px] px-5 py-2 bg-[#37a001] text-white rounded-full"
              />
            </div>
          </div>
          <div className="mt-5">
            <p className="font-semibold">Description</p>
            <p>{product?.data.description}</p>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ProductPage;
