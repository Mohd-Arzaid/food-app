import { Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState } from "react";
import CheckoutConfirmPage from "./CheckoutConfirmPage";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, incrementQuantity, decrementQuantity, removeFromTheCart } from "@/redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart); 
  const [open, setOpen] = useState(false);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col max-w-[90%] mx-auto my-4 md:my-10">
      <div className="flex justify-end">
        <Button variant="link" onClick={() => dispatch(clearCart())}>
          Clear All
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Items</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cart?.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={item?.imageUrl} alt="item image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{item?.name}</TableCell>
              <TableCell>{item?.price}</TableCell>
              <TableCell>
                <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    className="rounded-full bg-gray-200"
                    onClick={() => dispatch(decrementQuantity(item._id))} // Decrement quantity
                  >
                    <Minus />
                  </Button>

                  <Button
                    size={"icon"}
                    className="font-bold border-none"
                    disabled
                    variant={"outline"}
                  >
                    {item?.quantity}
                  </Button>

                  <Button
                    size={"icon"}
                    className="rounded-full bg-orange hover:bg-hoverOrange"
                    variant={"outline"}
                    onClick={() => dispatch(incrementQuantity(item?._id))}
                  >
                    <Plus />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{item.price * item.quantity}</TableCell>
              <TableCell className="text-right">
                <Button size={"sm"} onClick={() => dispatch(removeFromTheCart(item._id))}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow className="text-2xl font-bold">
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">{totalPrice}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="flex justify-end my-5">
        <Button onClick={() => setOpen(true)}>Proceed To Checkout</Button>
      </div>

      <CheckoutConfirmPage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Cart;