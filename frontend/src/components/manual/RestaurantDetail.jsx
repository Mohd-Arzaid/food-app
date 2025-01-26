import { Timer } from "lucide-react";
import { Badge } from "../ui/badge";
import AvailableMenu from "./AvailableMenu";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleRestaurant } from "@/apiServices/apiHandlers/restaurantAPI";
const RestaurantDetail = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { singleRestaurant } = useSelector((state) => state.restaurant);

  useEffect(() => {
    dispatch(getSingleRestaurant(params.id, token));
  }, [params.id, dispatch]);

  return (
    <div className="max-w-[90%] mx-auto my-7 md:my-10 ">
      <div className="w-full">
        <div className="relative w-full h-32 md:h-64 lg:h-72">
          <img
            src={singleRestaurant?.imageUrl || "Loading..."}
            alt="res_image"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between">
          <div className="mt-5 mb-2  md:mb-5">
            <h1 className="font-medium text-2xl md:text-3xl">
              {singleRestaurant?.restaurantName || "Loading..."}
            </h1>
            <div className="flex gap-2 my-2">
              {singleRestaurant?.cuisines?.map((cuisine, idx) => (
                <Badge key={idx}>{cuisine}</Badge>
              ))}
            </div>
            <div className="flex md:flex-row flex-col gap-2 my-5">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                <h1 className="flex items-center gap-2 font-medium">
                  Delivery Time:{" "}
                  <span className="text-[#D19254]">
                    {singleRestaurant?.deliveryTime || "NA"} mins
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {singleRestaurant?.menus && <AvailableMenu menus = {singleRestaurant?.menus} />}
      </div>
    </div>
  );
};

export default RestaurantDetail;
