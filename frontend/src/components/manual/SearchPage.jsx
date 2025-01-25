import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import FilterPage from "./FilterPage";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Globe, MapPin, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchRestaurant } from "@/apiServices/apiHandlers/restaurantAPI";
import { setAppliedFilter } from "@/redux/restaurantSlice";

const SearchPage = () => {
  const { token } = useSelector((state) => state.auth);
  const params = useParams();
  const { appliedFilter, searchedRestaurant } = useSelector(
    (state) => state.restaurant
  );
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(searchRestaurant(params.text, searchQuery, appliedFilter, token));
  }, [params.text, appliedFilter]);

  return (
    <div className="max-w-[90%] mx-auto my-7 md:my-10 ">
      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-10">
        <FilterPage />
        <div className="flex-1">
          {/* Search Input Field */}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={searchQuery}
              placeholder="Search by restaurant & cuisines"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              onClick={() =>
                dispatch(
                  searchRestaurant(
                    params.text,
                    searchQuery,
                    appliedFilter,
                    token
                  )
                )
              }
            >
              Search
            </Button>
          </div>

          {/* Searched Items display here  */}
          <div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2 my-2 md:my-3">
              <h1 className="font-medium text-base md:text-lg">
                ({searchedRestaurant?.restaurants?.length}) Search result found
              </h1>

              <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                {appliedFilter?.map((selectedFilter, idx) => (
                  <div
                    key={idx}
                    className="relative inline-flex items-center max-w-full"
                  >
                    <Badge
                      className="text-[#D19254] rounded-md hover:cursor-pointer  pb-1 pr-6 whitespace-nowrap"
                      variant="outline"
                    >
                      {selectedFilter}
                    </Badge>
                    <X
                      onClick={() => dispatch(setAppliedFilter(selectedFilter))}
                      size={16}
                      className="absolute text-[#D19254] right-1 hover:cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Restaurant Cards  */}
            <div className="grid md:grid-cols-3 gap-4">
              {searchedRestaurant?.restaurants?.map((restaurant) => (
                <Card
                  key={restaurant?._id}
                  className="bg-white  shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="relative">
                    <div className="aspect-[10/6] md:aspect-[16/6]">
                      <img
                        src={restaurant?.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 left-2 bg-white bg-opacity-75 rounded-lg px-3 py-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Featured
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {restaurant?.restaurantName}
                    </h1>
                    <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin size={16} />
                      <p className="text-sm">
                        City :{" "}
                        <span className="font-medium">{restaurant?.city}</span>
                      </p>
                    </div>
                    <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                      <Globe size={16} />
                      <p className="text-sm">
                        Country :{" "}
                        <span className="font-medium">
                          {restaurant?.country}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {restaurant.cuisines.map((cuisine, idx) => (
                        <Badge
                          key={idx}
                          className="font-medium px-2 py-1 rounded-full shadow-sm"
                        >
                          {cuisine}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t md:border-t-2 border-t-gray-100 text-white flex justify-end">
                    <Link to={`/restaurant/${restaurant?._id}`}>
                      <Button className="font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
                        View Menus
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
