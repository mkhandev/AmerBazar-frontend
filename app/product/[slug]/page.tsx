"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchProduct } from "@/lib/actions/api";
import ProductImages from "@/components/Product/ProductImages";
import ProductPrice from "@/components/Product/ProductPrice";
import Rating from "@/components/Product/Rating";
import ReviewList from "@/components/Review/ReviewList";
import { Coins, Siren, Truck } from "lucide-react";

import { QRCodeCanvas } from "qrcode.react";
import { apiUrl } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import AddToCart from "@/components/Product/AddToCart";

const ProductPage = () => {
  const params = useParams();
  const slug = params?.slug;

  if (!slug || Array.isArray(slug)) return <p>Invalid product URL</p>;

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    enabled: !!slug,
  });

  if (!product) return null;

  const productUrl = `${apiUrl}/product/${slug}`;

  return (
    <>
      <section className="bg-white mt-7 p-5 pr-0 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="col-span-2 pb-5">
            <ProductImages images={product?.data?.images || []} />
          </div>
          <div className="col-span-2 pb-5">
            <div className="flex flex-col gap-1">
              <p>
                {product?.data?.brand} {product?.data?.category?.name}
              </p>
              <h1 className="font-bold text-[22px] text-[#37a001]">
                {product?.data?.name}
              </h1>

              {product?.data.rating ? (
                <div className="flex flex-row gap-1 items-center mb-2 text-[13px]">
                  <div>
                    <Rating value={Number(product.data.rating)} />
                  </div>
                  <div>|</div>
                  <div>Ratings </div>
                  <div>{product.data.num_reviews}</div>
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

            <div className="mt-5 mb-5">
              <AddToCart
                item={{
                  product_id: product?.data.id,
                  price: Number(product?.data.price),
                }}
              />
            </div>
          </div>
          <div className="bg-[#FAFAFA] px-5 text-[#212121] text-[14px]">
            <div className="flex flex-row gap-5 border-b border-[#DDDDDD] mb-3 pb-2">
              <Truck />
              <div>
                <div>Standard Delivery</div>
                <div className="text-[12px] text-[#9e9e9e]">
                  Guaranteed by 4-9 days
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-5 border-b border-[#DDDDDD] mb-3 py-2">
              <Coins />
              <div>Cash on Delivery Available</div>
            </div>

            <div className="mb-2">Return & Warranty</div>

            <div className="flex flex-row gap-5 border-b border-[#DDDDDD] mb-5">
              <Siren />
              <div>14 days easy return</div>
            </div>

            <div className="pb-5">
              <QRCodeCanvas value={productUrl} size={110} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white mt-5 p-5">
        <div>
          <h2 className="h2-bold pb-5 text-[22px]">Customer reviews</h2>
          <ReviewList reviews={product?.data.reviews || []} />
        </div>
      </section>
    </>
  );
};

export default ProductPage;
