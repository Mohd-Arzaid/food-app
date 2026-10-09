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
  firstName: z
    .string()
    .trim()
    .min(2, "First name is required (at least 2 characters)."),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),
  contact: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^[0-9+\s-]{7,15}$/.test(val),
      "Please enter a valid phone number (7-15 digits)."
    ),
  address: z
    .string()
    .trim()
    .min(5, "Complete street address is required (at least 5 characters).")
    .refine((val) => !val.toLowerCase().includes("update your"), {
      message: "Please enter your actual street address.",
    }),
  city: z
    .string()
    .trim()
    .min(2, "City is required.")
    .refine((val) => !val.toLowerCase().includes("update your"), {
      message: "Please enter your city.",
    }),
  state: z.string().trim().optional(),
  postalCode: z
    .string()
    .trim()
    .min(3, "Postal code is required.")
    .regex(/^[a-zA-Z0-9\s-]{3,10}$/, "Please enter a valid postal code."),
  country: z
    .string()
    .trim()
    .min(2, "Country is required.")
    .refine((val) => !val.toLowerCase().includes("update your"), {
      message: "Please enter your country.",
    }),
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
      contact: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const cleanProfileVal = (val) => {
    if (!val || typeof val !== "string") return "";
    if (val.toLowerCase().includes("update your")) return "";
    return val;
  };

  useEffect(() => {
    if (user && open) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        contact: cleanProfileVal(user.additionalDetails?.contact),
        address: cleanProfileVal(user.additionalDetails?.address),
        city: cleanProfileVal(user.additionalDetails?.city),
        state: cleanProfileVal(user.additionalDetails?.state),
        postalCode: cleanProfileVal(user.additionalDetails?.postalCode),
        country: cleanProfileVal(user.additionalDetails?.country),
      });
    }
  }, [user, open, reset]);

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
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        contact: data.contact?.trim() || "",
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state?.trim() || "",
        postalCode: data.postalCode.trim(),
        country: data.country.trim(),
      },
      restaurantId,
    };

    await dispatch(createCheckoutSession(token, checkoutData));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Delivery Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Please provide your complete delivery address before proceeding to payment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Recipient Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="First Name *"
              placeholder="e.g. John"
              disabled={isSubmitting}
              {...register("firstName")}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name *"
              placeholder="e.g. Doe"
              disabled={isSubmitting}
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address *"
              placeholder="e.g. john@example.com"
              disabled={isSubmitting}
              type="email"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Phone Number (Optional)"
              placeholder="e.g. +91 9876543210"
              disabled={isSubmitting}
              type="tel"
              {...register("contact")}
              error={errors.contact?.message}
            />
          </div>

          {/* Street Address */}
          <Input
            label="Street Address *"
            placeholder="Flat / House No., Building, Street address"
            disabled={isSubmitting}
            {...register("address")}
            error={errors.address?.message}
          />

          {/* City & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="City *"
              placeholder="e.g. Mumbai"
              disabled={isSubmitting}
              {...register("city")}
              error={errors.city?.message}
            />
            <Input
              label="State / Region (Optional)"
              placeholder="e.g. Maharashtra"
              disabled={isSubmitting}
              {...register("state")}
              error={errors.state?.message}
            />
          </div>

          {/* Postal Code & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Postal / PIN Code *"
              placeholder="e.g. 400001"
              disabled={isSubmitting}
              {...register("postalCode")}
              error={errors.postalCode?.message}
            />
            <Input
              label="Country *"
              placeholder="e.g. India"
              disabled={isSubmitting}
              {...register("country")}
              error={errors.country?.message}
            />
          </div>

          <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
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
