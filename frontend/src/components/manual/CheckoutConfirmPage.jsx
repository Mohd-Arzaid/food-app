import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createCheckoutSession } from "@/apiServices/apiHandlers/orderAPI";

const CheckoutSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required."),
  lastName: z.string().trim().min(2, "Last name is required."),
  email: z.string().email("Valid email is required."),
  address: z.string().trim().min(5, "Complete street address is required."),
  city: z.string().trim().min(2, "City is required."),
  country: z.string().trim().min(2, "Country is required."),
});

const CheckoutConfirmPage = ({ open, setOpen }) => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      country: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        address: user.additionalDetails?.address || "",
        city: user.additionalDetails?.city || "",
        country: user.additionalDetails?.country || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    if (!cart?.length) {
      toast.error("Your cart is empty");
      return;
    }

    if (cart.some((item) => !item.restaurantId)) {
      toast.error("Clear your cart and add the items again");
      return;
    }

    const restaurantId = cart[0].restaurantId;
    if (cart.some((item) => item.restaurantId !== restaurantId)) {
      toast.error("Clear your cart before ordering from another restaurant");
      return;
    }

    const checkoutData = {
      cartItems: cart.map((cartItem) => ({
        menuId: cartItem._id,
        name: cartItem.name,
        image: cartItem.imageUrl,
        price: cartItem.price.toString(),
        quantity: cartItem.quantity.toString(),
      })),
      deliveryDetails: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        address: data.address,
        city: data.city,
        country: data.country,
      },
      restaurantId,
    };

    await dispatch(createCheckoutSession(token, checkoutData));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Delivery Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Please confirm your delivery address before proceeding to payment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              disabled
              {...register("firstName")}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              disabled
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>

          <Input
            label="Email Address"
            disabled
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Delivery Address"
            placeholder="Street address, house number"
            disabled={isSubmitting}
            {...register("address")}
            error={errors.address?.message}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              placeholder="e.g. Mumbai"
              disabled={isSubmitting}
              {...register("city")}
              error={errors.city?.message}
            />
            <Input
              label="Country"
              placeholder="e.g. India"
              disabled={isSubmitting}
              {...register("country")}
              error={errors.country?.message}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="h-11 px-6 w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Proceeding to payment...
                </span>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutConfirmPage;
