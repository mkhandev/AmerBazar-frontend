import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/types/cart";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AddToCart = ({ item }: { item: CartItem }) => {
  //const { addMutation } = useCart();
  const { cart, isLoading, addMutation, updateMutation } = useCart();

  //console.log(cart);

  const existingItem = cart?.data.find(
    (ci: any) => ci.product_id === item.product_id
  );

  //console.log(existingItem);

  const [quantity, setQuantity] = useState(existingItem?.quantity || 1);

  const { mutate, isPending } = addMutation;
  const [open, setOpen] = useState(false);

  const handleAddToCart = () => {
    if (existingItem) {
      updateMutation.mutate(
        { product_id: item.product_id, quantity },
        {
          onSuccess: () => setOpen(true),
          onError: (error: any) =>
            toast.warning(error?.message || "Something went wrong"),
        }
      );
    } else {
      // Add new item
      addMutation.mutate(
        { product_id: item.product_id, quantity },
        {
          onSuccess: () => setOpen(true),
          onError: (error: any) =>
            toast.warning(error?.message || "Something went wrong"),
        }
      );
    }
  };

  return (
    <>
      {/* Quantity selector */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          className="px-3 py-1 border rounded"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        >
          -
        </button>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => {
            let value = Number(e.target.value);
            if (value < 1) value = 1;
            if (value > 5) value = 5;
            setQuantity(value);
          }}
          className="w-12 text-center border rounded py-1"
        />
        <button
          type="button"
          className="px-3 py-1 border rounded"
          onClick={() => setQuantity((q) => Math.min(5, q + 1))} // max 5
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={isPending}
        onClick={handleAddToCart}
        className={`flex justify-center items-center rounded w-full max-w-[210px] py-3 text-[15px] text-white bg-[#37a001] border-0 outline-0  
          ${isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"}
        `}
      >
        {isPending ? (
          <Spinner className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        &nbsp; Add To Cart
      </button>

      {/* ✅ Success Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Item Added to Cart</DialogTitle>
            <DialogDescription>
              Your item has been successfully added to the cart.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Continue Shopping
            </Button>

            <Button
              onClick={() => {
                setOpen(false);
                window.location.href = "/cart";
              }}
            >
              Go to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddToCart;
