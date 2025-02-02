import { logout } from "@/apiServices/apiHandlers/authAPI";
import ReusableDialog from "@/components/manual/ReusableDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  HandPlatter,
  Menu,
  PackageCheck,
  ShoppingCart,
  SquareMenu,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { cart } = useSelector((state) => state.cart);

  // Calculate total quantity of items in the cart
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="max-w-[90%] m-auto py-1 ">
      <section className="flex w-full h-14 justify-between items-center">
        <Link to="/">
          <h1 className="font-bold md:font-extrabold text-2xl md:text-3xl">
            Food App
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-6">
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/order/status">Order</Link>

            {/* Dashboard */}
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>Dashboard</MenubarTrigger>
                <MenubarContent>
                  <Link to="/restaurant">
                    <MenubarItem>Restaurant</MenubarItem>
                  </Link>
                  <Link to="/menu">
                    <MenubarItem>Menu</MenubarItem>
                  </Link>
                  <Link to="/orders">
                    <MenubarItem>Orders</MenubarItem>
                  </Link>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          {/* Shopping cart */}
          <Link to="/cart" className="relative cursor-pointer">
            <ShoppingCart />

            {totalQuantity > 0 && ( // Show quantity only if cart is not empty
              <Button
                size={"icon"}
                className="absolute -inset-y-3 left-2 text-xs rounded-full w-4 h-4 bg-red-500 hover:bg-red-500"
              >
                {totalQuantity}
              </Button>
            )}
          </Link>

          {/* Profile Image */}

          <Avatar>
            <AvatarImage src={user?.image} alt={`profile-${user?.firstName}`} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          {/* Logout */}
          <ReusableDialog
            triggerText="Logout"
            title="Are you sure?"
            description="You will be logged out of your account."
            confirmText="Confirm"
            onClick={() => {
              dispatch(logout(navigate));
            }}
          />
        </div>

        {/* Mobile responsive navbar */}
        <div className="md:hidden ">
          <MobileNavbar totalQuantity={totalQuantity} />
        </div>
      </section>
    </nav>
  );
};

export default Navbar;

const MobileNavbar = ({ totalQuantity }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size={"icon"}
          className="rounded-full bg-gray-200 text-black hover:bg-gray-200"
          variant="outline"
        >
          <Menu size={"18"} />
        </Button>
      </SheetTrigger>

      {/* Main Content */}
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle>Food App</SheetTitle>
        </SheetHeader>
        <Separator className="my-2" />

        <SheetDescription className="flex-1">
          <SheetClose asChild>
            <Link
              to="/profile"
              className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
            >
              <User />
              <span>Profile</span>
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              to="/order/status"
              className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
            >
              <HandPlatter />
              <span>Order</span>
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              to="/cart"
              className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
            >
              <ShoppingCart />
              <span>Cart ({totalQuantity})</span>
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              to="/menu"
              className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
            >
              <SquareMenu />
              <span>Menu</span>
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              to="/restaurant"
              className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
            >
              <UtensilsCrossed />
              <span>Restaurant</span>
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              to="/orders"
              className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
            >
              <PackageCheck />
              <span>Restaurant Orders</span>
            </Link>
          </SheetClose>
        </SheetDescription>

        <SheetFooter className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage
                src={user?.image}
                alt={`profile-${user?.firstName}`}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="font-bold">
              {" "}
              {user?.firstName} {user?.lastName}{" "}
            </h1>
          </div>

          <SheetClose asChild>
            {/* Logout */}
            <ReusableDialog
              triggerText="Logout"
              title="Are you sure?"
              description="You will be logged out of your account."
              confirmText="Confirm"
              onClick={() => {
                dispatch(logout(navigate));
              }}
            />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
