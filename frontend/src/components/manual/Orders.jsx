import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Orders = () => {
  return (
    <div className="max-w-[90%] md:max-w-[80%] mx-auto  my-7 md:my-12 ">
      <h1 className="text-3xl font-extrabold text-gray-900  mb-10">
        Orders Overview
      </h1>
      <div className="space-y-8">
        {/* Restaurant Orders diplay here  */}
        <div className="flex flex-col md:flex-row justify-between items-start sm:items-center bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-gray-200 ">
          <div className="flex-1 mb-6 sm:mb-0">
            <h1 className="text-xl font-semibold text-gray-800">
              Order delivery name
            </h1>
            <p className="text-gray-600 mt-2">
              <span className="font-semibold">Address: </span>
              Address
            </p>
            <p className="text-gray-600  mt-2">
              <span className="font-semibold">Total Amount: </span>
              100
            </p>
          </div>
          <div className="w-full sm:w-1/3">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Order Status
            </Label>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[
                    "Pending",
                    "Confirmed",
                    "Preparing",
                    "OutForDelivery",
                    "Delivered",
                  ].map((status, index) => (
                    <SelectItem key={index} value={status.toLowerCase()}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
