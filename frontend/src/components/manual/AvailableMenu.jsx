import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { toast } from "sonner";

const AvailableMenu = ({ menus, restaurant }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.profile);

  const handleAddToCart = (menu) => {
    if (
      restaurant?.user &&
      user?._id &&
      String(restaurant.user) === String(user._id)
    ) {
      toast.error("You cannot order from your own restaurant");
      return;
    }

    const hasAnotherRestaurant = cart?.some(
      (item) => item.restaurantId && item.restaurantId !== restaurant?._id
    );
    if (hasAnotherRestaurant) {
      toast.error("Clear your cart before ordering from another restaurant");
      return;
    }

    dispatch(addToCart({ ...menu, restaurantId: restaurant?._id }));
    navigate("/cart");
  };
  return (
    <div className="">
      <h1 className="text-xl md:text-2xl font-extrabold mb-4 md:mb-6">
        Available Menus
      </h1>

      <div className="grid md:grid-cols-3 px-0 md:px-10  gap-6 md:gap-6">
        {menus.map((menu, idx) => (
          <Card
            key={idx}
            className=" max-w-md  shadow-lg rounded-lg overflow-hidden"
          >
            <img
              src={menu?.imageUrl}
              alt="Menu Image"
              className="w-full h-40 object-cover"
            />
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {menu?.name}
              </h2>
              <p className="text-sm text-gray-600 mt-2">{menu?.description}</p>
              <h3 className="text-lg font-semibold mt-4">
                Price: <span className="text-[#D19254]">₹{menu?.price}</span>
              </h3>
            </CardContent>

            <CardFooter className="px-4 mt-1">
              <Button
                onClick={() => handleAddToCart(menu)}
                className="w-full text-base"
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableMenu;
