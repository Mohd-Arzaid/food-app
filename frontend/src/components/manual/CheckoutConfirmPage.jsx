import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCheckoutSession } from "@/apiServices/apiHandlers/orderAPI";

const CheckoutConfirmPage = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { cart } = useSelector((state) => state.cart);
  const { restaurant } = useSelector((state) => state.restaurant);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    address: user?.additionalDetails?.address || "",
    city: user?.additionalDetails?.city || "",
    country: user?.additionalDetails?.country || "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  

  const checkoutHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const checkoutData = {
      cartItems: cart?.map((cartItem) => ({
        menuId: cartItem._id,
        name: cartItem.name,
        image: cartItem.imageUrl,
        price: cartItem.price.toString(),
        quantity: cartItem.quantity.toString(),
      })),
      deliveryDetails: input,
      // restaurantId: restaurant?._id,
    };
    console.log(checkoutData);

    dispatch(createCheckoutSession(token, checkoutData)).finally(() => {
      setLoading(false);
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="font-semibold">Review Your Order</DialogTitle>
        <DialogDescription className="text-xs">
          Double-check your delivery details and ensure everything is in order.
          When you are ready, hit confirm button to finalize your order
        </DialogDescription>

        <form
          onSubmit={checkoutHandler}
          className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0"
        >
          <div>
            <Label>First Name</Label>
            <Input
              disabled
              type="text"
              name="firstName"
              value={input.firstName}
            />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input
              disabled
              type="text"
              name="lastName"
              value={input.lastName}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input disabled type="email" name="email" value={input.email} />
          </div>

          <div>
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              value={input.address}
              onChange={changeEventHandler}
            />
          </div>

          <div>
            <Label>City</Label>
            <Input
              type="text"
              name="city"
              value={input.city}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Country</Label>
            <Input
              type="text"
              name="country"
              value={input.country}
              onChange={changeEventHandler}
            />
          </div>

          <DialogFooter className="col-span-2 pt-5">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Continue To Payment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutConfirmPage;
