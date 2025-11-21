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
import { insertProductSchema } from "@/lib/validators";
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
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useProduct } from "@/hooks/useProduct";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProductForm = ({
  type,
  slug,
}: {
  type: "Create" | "Update";
  slug?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);

  const router = useRouter();
  const { productAddMutation } = useProduct();

  const {
    data: categoryList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  //console.log(categoryList);

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(insertProductSchema) as any,
    defaultValues: productDefaultValues,
  });

  if (isLoading) return <FullPageLoader />;

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values
  ) => {
    console.log(values);

    const productData = {
      ...values,
      main_image_index: mainImageIndex,
    };

    productAddMutation.mutate(productData, {
      onSuccess: (res) => {
        router.push(`/admin/products`);
      },
      onError: (error: any) =>
        toast.warning(error?.message || "Something went wrong"),
    });
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

          <div className="flex flex-col w-full gap-5 mt-3 md:flex-row">
            <FormField
              control={form.control}
              name="images"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>

                  {/* Image Preview */}
                  {field.value && (field.value as FileList).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.from(field.value as FileList).map(
                        (file: File, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index}`}
                              className={`h-20 w-20 object-cover rounded-md border ${
                                index === mainImageIndex
                                  ? "border-2 border-blue-500"
                                  : "border"
                              }`}
                            />
                            <button
                              type="button"
                              className="absolute bottom-0 left-0 w-full py-1 text-xs text-white bg-blue-500 rounded-b-md"
                              onClick={() => setMainImageIndex(index)}
                            >
                              {index === mainImageIndex
                                ? "Main Image"
                                : "Set as Main"}
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}

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
              disabled={form.formState.isSubmitting}
              className="w-full col-span-2 button"
            >
              {form.formState.isSubmitting
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
