import { useDispatch, useSelector } from "react-redux";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  getOrderOverview,
  updateOrder,
} from "@/apiServices/apiHandlers/orderAPI";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const Orders = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { orderOverview } = useSelector((state) => state.order);
  // console.log(orderOverview);

  useEffect(() => {
    dispatch(getOrderOverview(token));
  }, [dispatch, token]);

  const handleStatusChange = async (orderId, newStatus) => {
    dispatch(updateOrder(token, orderId, newStatus));
    dispatch(getOrderOverview(token));
  };

  if (orderOverview.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[75vh] bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
          <div className="mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-gray-400 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            No Orders Overview Found
          </h2>
          <p className="text-gray-600 mb-6">
            It looks like you haven&apos;t placed any orders yet. Start shopping
            now!
          </p>
          <Link to="/cart">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[90%] md:max-w-[80%] mx-auto my-7 md:my-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-10">
        Orders Overview
      </h1>
      <div className="space-y-8">
        {orderOverview.map((order) => (
          <div
            key={order._id}
            className="flex flex-col md:flex-row justify-between items-start sm:items-center bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-gray-200"
          >
            <div className="flex-1 mb-6 sm:mb-0">
              <h1 className="text-xl font-semibold text-gray-800">
                {order.deliveryDetails.firstName}{" "}
                {order.deliveryDetails.lastName}
              </h1>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">Address: </span>
                {order.deliveryDetails.address}, {order.deliveryDetails.city},{" "}
                {order.deliveryDetails.country}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">Total Amount: </span>₹
                {order.totalAmount / 100}{" "}
                {/* Assuming totalAmount is in paise */}
              </p>
            </div>
            <div className="w-full sm:w-1/3">
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </Label>
              <Select
                defaultValue={order.status.toLowerCase()}
                onValueChange={(value) => handleStatusChange(order._id, value)}
              >
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
        ))}
      </div>
    </div>
  );
};

export default Orders;
