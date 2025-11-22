"use client";
import z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";

import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/actions/api";
import FullPageLoader from "@/components/FullPageLoader";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useProduct } from "@/hooks/useProduct";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: any;
  productId?: number;
}) => {
  const [open, setOpen] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);

  //CHANGE: states for image management
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [deletedImages, setDeletedImages] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const router = useRouter();
  const { productAddMutation, productUpdateMutation } = useProduct();

  //console.log(product);

  const {
    data: categoryList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(
      type === "Update" ? updateProductSchema : insertProductSchema
    ) as any,
    defaultValues: type === "Update" ? product : productDefaultValues,
  });

  // Reset form when product data is loaded
  useEffect(() => {
    if (type === "Update" && product) {
      form.reset(product);
      setExistingImages(product.images || []);

      const mainIndex =
        product.images?.findIndex((img: any) => img.is_main) ?? null;
      setMainImageIndex(mainIndex);

      setNewImages([]);
      setDeletedImages([]);
    }
  }, []);

  if (isLoading) return <FullPageLoader />;

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values
  ) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("category_id", values.category_id.toString());
    formData.append("brand", values.brand);
    formData.append("price", values.price.toString());
    formData.append("stock", values.stock.toString());
    formData.append("description", values.description);
    formData.append("status", values.status.toString());

    if (type === "Update") formData.append("_method", "PATCH");

    if (mainImageIndex !== null)
      formData.append("main_image_index", mainImageIndex.toString());

    deletedImages.forEach((id) =>
      formData.append("remove_image_ids[]", id.toString())
    );

    newImages.forEach((file) => formData.append("images[]", file));

    if (type === "Create") {
      productAddMutation.mutate(formData, {
        onSuccess: () => router.push("/admin/products"),
        onError: (error: any) =>
          toast.warning(error?.message || "Something went wrong"),
      });
    } else if (type === "Update") {
      productUpdateMutation.mutate(
        { id: Number(productId), productData: formData },
        {
          onSuccess: (res) => {
            //form.reset(res.data);
            setExistingImages(res.data.images || []);
            setNewImages([]);
            setDeletedImages([]);
            toast.success("Product updated successfully");

            router.push("/admin/products");
          },
          onError: (error: any) =>
            toast.warning(error?.message || "Failed to update"),
        }
      );
    }
  };

  return (
    <>
      <Form {...form}>
        <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-[3px]"
                      autoComplete="off"
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field, fieldState }) => {
                const selected = categoryList.find(
                  (c: any) => c.id === field.value
                );
                return (
                  <FormItem className="w-full">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="justify-between w-auto bg-white"
                          >
                            {selected ? selected.name : "Select category"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search Category..."
                              className="h-9"
                            />

                            <CommandList>
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {categoryList.map((category: any) => (
                                  <CommandItem
                                    key={category.id}
                                    value={category.id}
                                    onSelect={() => {
                                      field.onChange(category.id);
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        category.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {category.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="flex flex-col w-full gap-5 mt-3 md:flex-row">
            <FormField
              control={form.control}
              name="brand"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-[3px]"
                      autoComplete="off"
                      placeholder="Brand"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-[3px]"
                      autoComplete="off"
                      placeholder="Price"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col w-full gap-5 mt-3 md:flex-row">
            <FormField
              control={form.control}
              name="stock"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-[3px]"
                      autoComplete="off"
                      placeholder="Stocks"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col w-full gap-5 mt-3 md:flex-row">
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="rounded-[3px]"
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col w-full max-w-[250px] gap-5 mt-3 md:flex-row">
            <FormField
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border border-gray-300 rounded-[3px] p-2"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </FormControl>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col w-full gap-5 mt-3 md:flex-row">
            <FormField
              control={form.control}
              name="images"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel>Product Images</FormLabel>
                  <FormControl className="max-w-[250px] rounded-[3px]">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files
                          ? Array.from(e.target.files)
                          : [];
                        field.onChange(files);
                        setNewImages((prev) => [...prev, ...files]);
                      }}
                    />
                  </FormControl>

                  {/*Preview existing images */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {existingImages.map((img, index) => (
                      <div key={img.id} className="relative">
                        <img
                          src={img.image}
                          className={cn(
                            "h-36 w-36 object-cover rounded-md border transition-all duration-200",
                            index === mainImageIndex
                              ? "border-4 border-blue-500 scale-105"
                              : "border-gray-300"
                          )}
                        />

                        <button
                          type="button"
                          className="absolute bottom-0 left-0 w-full py-1 text-xs text-white bg-red-500 rounded-b-md"
                          onClick={() => {
                            setDeletedImages([...deletedImages, img.id]); // mark deleted
                            setExistingImages(
                              existingImages.filter((i) => i.id !== img.id)
                            ); // remove visually
                          }}
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          className="absolute top-0 left-0 w-full py-1 text-xs text-white bg-blue-500 rounded-t-md"
                          onClick={() => setMainImageIndex(index)}
                        >
                          {index === mainImageIndex
                            ? "Main Image"
                            : "Set as Main"}
                        </button>
                      </div>
                    ))}

                    {/* ✅ Preview new uploaded images */}
                    {newImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          className={cn(
                            "h-36 w-36 object-cover rounded-md border transition-all duration-200",
                            existingImages.length + index === mainImageIndex
                              ? "border-4 border-blue-500 scale-105"
                              : "border-gray-300"
                          )}
                        />
                        <button
                          type="button"
                          className="absolute bottom-0 left-0 w-full py-1 text-xs text-white bg-red-500 rounded-b-md"
                          onClick={() =>
                            setNewImages(
                              newImages.filter((_, i) => i !== index)
                            )
                          }
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          className="absolute top-0 left-0 w-full py-1 text-xs text-white bg-blue-500 rounded-t-md"
                          onClick={() =>
                            setMainImageIndex(existingImages.length + index)
                          }
                        >
                          {existingImages.length + index === mainImageIndex
                            ? "Main Image"
                            : "Set as Main"}
                        </button>
                      </div>
                    ))}
                  </div>

                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="mt-10">
            <Button
              type="submit"
              size="lg"
              className="w-full col-span-2 cursor-pointer button"
              disabled={
                productAddMutation.isPending || productUpdateMutation.isPending
              }
            >
              {productAddMutation.isPending || productUpdateMutation.isPending
                ? "Submitting..."
                : `${type} Product`}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
