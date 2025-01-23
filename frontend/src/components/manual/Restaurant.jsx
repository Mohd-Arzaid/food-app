import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const Restaurant = () => {
  return (
    <div className="max-w-[90%] md:max-w-[80%] mx-auto  my-7 md:my-16 ">
      <div>
        <div>
          <h1 className="font-extrabold text-2xl mb-5">Add Restaurants</h1>

          <form>
            <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
              {/* Restaurant Name  */}
              <Label className="flex flex-col gap-1">
                <span className="text-sm md:text-base">Restaurant Name</span>
                <Input
                  type="text"
                  name="restaurantName"
                  placeholder="Enter your restaurant name"
                />
              </Label>

              {/* City */}
              <Label className="flex flex-col gap-1">
                <span className="text-sm md:text-base">City</span>
                <Input
                  type="text"
                  name="city"
                  placeholder="Enter your city name"
                />
              </Label>

              {/* Country */}
              <Label className="flex flex-col gap-1">
                <span className="text-sm md:text-base">Country</span>
                <Input
                  type="text"
                  name="country"
                  placeholder="Enter your country name"
                />
              </Label>

              {/* Delivery Time */}
              <Label className="flex flex-col gap-1">
                <span className="text-sm md:text-base">Delivery Time</span>
                <Input
                  type="number"
                  name="deliveryTime"
                  placeholder="Enter your delivery time"
                />
              </Label>

              {/* Cuisines */}
              <Label className="flex flex-col gap-1">
                <span className="text-sm md:text-base">Cuisines</span>
                <Input
                  type="text"
                  name="cuisines"
                  placeholder="e.g. Momos, Biryani"
                />
              </Label>

              {/* Restaurant Banner */}

              <Label className="flex flex-col gap-1">
                <span className="text-sm md:text-base">
                  Upload Restaurant Banner
                </span>
                <Input type="file" accept="image/*" name="imageFile" />
              </Label>
            </div>

            <div className="my-5 w-fit">
              <Button>Add Your Restaurant</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
