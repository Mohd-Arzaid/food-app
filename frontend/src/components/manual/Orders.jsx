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
import { PackageCheck, Store } from "lucide-react";

const Orders = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { orderOverview } = useSelector((state) => state.order);
  const { restaurant } = useSelector((state) => state.restaurant);

  useEffect(() => {
    if (token) {
      dispatch(getOrderOverview(token));
    }
  }, [dispatch, token]);

  const handleStatusChange = async (orderId, newStatus) => {
    await dispatch(updateOrder(token, orderId, newStatus));
    await dispatch(getOrderOverview(token));
  };

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[75vh] bg-gray-50 px-4">
        <div className="bg-white shadow-sm rounded-2xl p-8 max-w-lg w-full text-center border border-border">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-[#1f2937]">
            <Store className="h-8 w-8 text-[#1f2937]" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Create your restaurant first to start receiving orders.
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            You haven&apos;t created a restaurant yet. Once you set up your restaurant and add menu items, incoming customer orders will appear here.
          </p>
          <Link to="/restaurant">
            <Button className="w-full h-11">Create Your Restaurant</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderOverview.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[75vh] bg-gray-50 px-4">
        <div className="bg-white shadow-sm rounded-2xl p-8 max-w-lg w-full text-center border border-border">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-[#1f2937]">
            <PackageCheck className="h-8 w-8 text-[#1f2937]" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            No incoming orders yet
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Customer orders for your restaurant will appear here once they are placed.
          </p>
          <Link to="/">
            <Button variant="outline" className="w-full h-11">Go to Dashboard</Button>
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
                {order.deliveryDetails.postalCode ? `${order.deliveryDetails.postalCode}, ` : ""}
                {order.deliveryDetails.country}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-semibold">Total Amount: </span>
                {typeof order.totalAmount === "number"
                  ? `₹${order.totalAmount / 100}`
                  : "Pending"}
              </p>
            </div>
            <div className="w-full sm:w-1/3">
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </Label>
              {order.status === "pending" ? (
                <p className="text-sm text-gray-600">Pending payment</p>
              ) : (
              <Select
                value={order.status}
                onValueChange={(value) => handleStatusChange(order._id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[
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
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
