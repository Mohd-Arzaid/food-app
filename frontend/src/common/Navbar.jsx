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

import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="max-w-[90%] m-auto py-1 ">
      <section className="flex w-full h-14 justify-between items-center">
        <Link to="/">
          <h1 className="font-bold md:font-extrabold text-2xl md:text-3xl">
            Food App
          </h1>
        </Link>
       {/* <Link to="/search/asj">S1</Link>
        <Link to="/restaurant/33">S2</Link> 
        <Link to="/login">S1</Link>
        <Link to="/signup">S2</Link>
        <Link to="/verify-email">S2</Link> 
        <Link to="/order/status">S2</Link> 
        
        */}

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
                  <Link to="/admin/orders">
                    <MenubarItem>Orders</MenubarItem>
                  </Link>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          {/* Shopping cart */}
          <Link to="/cart" className="relative cursor-pointer">
            <ShoppingCart />
            <Button
              size={"icon"}
              className="absolute -inset-y-3 left-2 text-xs rounded-full w-4 h-4 bg-red-500 hover:bg-red-500"
            >
              2
            </Button>
          </Link>

          {/* Profile Image */}

          <Avatar>
            <AvatarImage alt="profilephoto" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <Button>Logout</Button>
        </div>

        {/* Mobile responsive navbar */}
        <div className="md:hidden ">
          <MobileNavbar />
        </div>
      </section>
    </nav>
  );
};

export default Navbar;

const MobileNavbar = () => {
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
          <Link
            to="/profile"
            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
          >
            <User />
            <span>Profile</span>
          </Link>
          <Link
            to="/order/status"
            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
          >
            <HandPlatter />
            <span>Order</span>
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
          >
            <ShoppingCart />
            <span>Cart (0)</span>
          </Link>

          <Link
            to="/menu"
            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
          >
            <SquareMenu />
            <span>Menu</span>
          </Link>
          <Link
            to="/restaurant"
            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
          >
            <UtensilsCrossed />
            <span>Restaurant</span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
          >
            <PackageCheck />
            <span>Restaurant Orders</span>
          </Link>
        </SheetDescription>

        <SheetFooter className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="font-bold">Mohd Arzaid</h1>
          </div>

          <SheetClose asChild>
            <Button>Logout</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
