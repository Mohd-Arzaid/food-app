import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
} from "@/apiServices/apiHandlers/restaurantAPI";
import { toast } from "sonner";

const Restaurant = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const { restaurant } = useSelector((state) => state.restaurant);
  const [input, setInput] = useState({
    restaurantName: "",
    city: "",
    country: "",
    deliveryTime: 0,
    cuisines: [],
    image: undefined,
  });

  const { restaurantName, city, country, deliveryTime, cuisines, image } =
    input;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInput((prevData) => ({
      ...prevData,
      [name]: name === "deliveryTime" ? Number(value) : value,
    }));
  };

  const handleCuisinesChange = (e) => {
    const cuisinesArray = e.target.value.split(",").map((item) => item.trim());
    setInput((prevData) => ({
      ...prevData,
      cuisines: cuisinesArray,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || undefined;
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file && file.size > maxSizeBytes) {
      toast.error(
        "File size exceeds 10MB limit. Please choose a smaller file."
      );
      e.target.value = "";
      return;
    }
    setInput((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleAddRestaurant = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("restaurantName", restaurantName);
    formData.append("city", city);
    formData.append("country", country);
    formData.append("deliveryTime", input.deliveryTime.toString());
    formData.append("cuisines", JSON.stringify(input.cuisines));
    if (image) {
      formData.append("image", image);
    }

    if (restaurant) {
      dispatch(updateRestaurant(token, formData)).finally(() => {
        setLoading(false);
      });
    } else {
      // create
      dispatch(createRestaurant(token, formData)).finally(() => {
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      dispatch(getRestaurant(token)).finally(() => {
        if (restaurant) {
          setInput({
            restaurantName: restaurant?.restaurantName || "",
            city: restaurant?.city || "",
            country: restaurant?.country || "",
            deliveryTime: restaurant?.deliveryTime || 0,
            cuisines: restaurant?.cuisines
              ? restaurant.cuisines?.map((cuisine) => cuisine)
              : [],
            image: undefined,
          });
        }
      });
    };
    fetchRestaurant();
    // console.log(restaurant);
  }, []);

  return (
    <div className="max-w-[90%] md:max-w-[80%] mx-auto  my-7 md:my-16 ">
      <div>
        <div>
          <h1 className="font-extrabold text-2xl mb-5">Add Restaurants</h1>

          <form onSubmit={handleAddRestaurant}>
            <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
              {/* Restaurant Name  */}
              <Label className="flex flex-col gap-1">
                <span className="text-sm md:text-base">Restaurant Name</span>
                <Input
                  required
                  type="text"
                  name="restaurantName"
                  value={restaurantName}
                  onChange={handleOnChange}
                  placeholder="Enter your restaurant name"
                />
              </Label>

              {/* City */}
              <Label className="flex flex-col gap-1">
                <span className="text-sm md:text-base">City</span>
                <Input
                  required
                  type="text"
                  name="city"
                  value={city}
                  onChange={handleOnChange}
                  placeholder="Enter your city name"
                />
              </Label>

              {/* Country */}
              <Label className="flex flex-col gap-1">
                <span className="text-sm md:text-base">Country</span>
                <Input
                  required
                  type="text"
                  name="country"
                  value={country}
                  onChange={handleOnChange}
                  placeholder="Enter your country name"
                />
              </Label>

              {/* Delivery Time */}
              <Label className="flex flex-col gap-1">
                <span className="text-sm md:text-base">Delivery Time</span>
                <Input
                  required
                  type="number"
                  name="deliveryTime"
                  value={deliveryTime}
                  onChange={handleOnChange}
                  placeholder="Enter your delivery time"
                />
              </Label>

              {/* Cuisines */}
              <Label className="flex flex-col gap-1">
                <span className="text-sm md:text-base">Cuisines</span>
                <Input
                  required
                  type="text"
                  name="cuisines"
                  value={cuisines.join(", ")}
                  onChange={handleCuisinesChange}
                  placeholder="e.g. Momos, Biryani"
                />
              </Label>

              {/* Restaurant Banner */}

              <Label className="flex flex-col gap-1">
                <span className="text-sm md:text-base">
                  Upload Restaurant Banner
                </span>
                <Input
                  onChange={handleFileChange}
                  type="file"
                  accept="image/*"
                  name="image"
                />
              </Label>
            </div>

            <div className="my-5 w-fit">
              <Button disabled={loading} type="submit">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading
                  ? " Please wait..."
                  : restaurant
                  ? "Update Your Restaurant"
                  : "Add Your Restaurant"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
