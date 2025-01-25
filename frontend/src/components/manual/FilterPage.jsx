import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { resetAppliedFilter, setAppliedFilter } from "@/redux/restaurantSlice";

const filterOptions = [
  { id: "burger", label: "Burger" },
  { id: "thali", label: "Thali" },
  { id: "biryani", label: "Biryani" },
  { id: "momos", label: "Momos" },
];
const FilterPage = () => {
  const dispatch = useDispatch();
  const { appliedFilter } = useSelector((state) => state.restaurant);

  const appliedFilterHandler = (value) => {
    dispatch(setAppliedFilter(value));
  };
  return (
    <div className="md:w-72">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-lg">Filter by cuisines</h1>
        <Button variant={"link"} onClick={() => dispatch(resetAppliedFilter())}>
          Reset</Button>
      </div>
      {filterOptions.map((option) => (
        <div key={option.id} className="flex items-center space-x-2 my-5">
          <Checkbox
            id={option.id}
            checked={appliedFilter?.includes(option?.label)}
            onClick={() => appliedFilterHandler(option?.label)}
          />
          <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default FilterPage;
