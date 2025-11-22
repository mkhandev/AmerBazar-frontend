import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useProduct } from "@/hooks/useProduct";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const EditDeleteAction = ({ id }: { id: number }) => {
  const [open, setOpen] = useState(false);

  const { productDeleteMutation } = useProduct();

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      productDeleteMutation.mutate(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["product_list"] });
          toast.success("Product deleted successfully");
          setOpen(false);
        },
        onError: (error: any) => {
          toast.error(error?.message || "Something went wrong");
        },
      });

      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {/* Edit */}
      <Link href={`/admin/products/${id}`}>
        <Button variant="outline" size="sm" className="cursor-pointer">
          Edit
        </Button>
      </Link>

      {/* Delete */}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
        className="cursor-pointer"
      >
        Delete
      </Button>

      {/* Confirmation Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button
              variant="destructive"
              disabled={productDeleteMutation.isPending}
              onClick={handleDelete}
            >
              {productDeleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditDeleteAction;
