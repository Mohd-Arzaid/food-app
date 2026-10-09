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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurant } from "@/apiServices/apiHandlers/restaurantAPI";
import { setRestaurant } from "@/redux/restaurantSlice";

import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { cart } = useSelector((state) => state.cart);
  const { restaurant } = useSelector((state) => state.restaurant);
  const [ownerChecked, setOwnerChecked] = useState(false);

  const isOwner = Boolean(user?.isRestaurantOwner);

  useEffect(() => {
    if (!token) {
      setOwnerChecked(false);
      return;
    }
    // Only fetch the owner's restaurant if the user is an owner
    if (!isOwner) {
      setOwnerChecked(true);
      return;
    }
    let active = true;
    setOwnerChecked(false);
    dispatch(setRestaurant(null));
    dispatch(getRestaurant(token)).finally(() => {
      if (active) {
        setOwnerChecked(true);
      }
    });
    return () => {
      active = false;
    };
  }, [dispatch, token, user?._id, isOwner]);

  const showRestaurantLink =
    ownerChecked && (Boolean(restaurant) || user?.isRestaurantOwner);
  const showManagementLinks = ownerChecked && Boolean(restaurant);

  // Calculate total quantity of items in the cart
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 justify-between items-center">
        <Link to="/">
          <h1 className="font-bold tracking-tight text-2xl md:text-3xl text-foreground">
            Food App.
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/profile"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Profile
            </Link>

            {/* Customer-only links */}
            {!isOwner && (
              <Link
                to="/order/status"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                My Orders
              </Link>
            )}

            {/* Owner-only links (shown after restaurant check completes) */}
            {isOwner && showRestaurantLink && (
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger className="cursor-pointer font-medium text-sm text-muted-foreground hover:text-foreground">
                    Dashboard
                  </MenubarTrigger>
                  <MenubarContent>
                    <Link to="/restaurant">
                      <MenubarItem>Restaurant</MenubarItem>
                    </Link>
                    {showManagementLinks && (
                      <>
                        <Link to="/menu">
                          <MenubarItem>Menu</MenubarItem>
                        </Link>
                        <Link to="/orders">
                          <MenubarItem>Restaurant Orders</MenubarItem>
                        </Link>
                      </>
                    )}
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            )}
          </div>

          {/* Shopping cart — customers only */}
          {!isOwner && (
            <Link to="/cart" className="relative cursor-pointer text-foreground hover:text-foreground/80 transition-colors">
              <ShoppingCart className="w-5 h-5" />

              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] font-bold rounded-full w-4 h-4 bg-[#1f2937] text-white flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>
          )}

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
          <MobileNavbar
            totalQuantity={totalQuantity}
            showRestaurantLink={showRestaurantLink}
            showManagementLinks={showManagementLinks}
            isOwner={isOwner}
          />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

const MobileNavbar = ({
  totalQuantity,
  showRestaurantLink,
  showManagementLinks,
  isOwner,
}) => {
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

          {/* Customer-only nav items */}
          {!isOwner && (
            <>
              <SheetClose asChild>
                <Link
                  to="/order/status"
                  className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                >
                  <HandPlatter />
                  <span>My Orders</span>
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
            </>
          )}

          {/* Owner-only nav items */}
          {isOwner && showRestaurantLink && (
            <SheetClose asChild>
              <Link
                to="/restaurant"
                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
              >
                <UtensilsCrossed />
                <span>Restaurant</span>
              </Link>
            </SheetClose>
          )}

          {isOwner && showManagementLinks && (
            <>
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
                  to="/orders"
                  className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                >
                  <PackageCheck />
                  <span>Restaurant Orders</span>
                </Link>
              </SheetClose>
            </>
          )}
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
