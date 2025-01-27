import { IndianRupee } from "lucide-react";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "@/apiServices/apiHandlers/orderAPI";

const Success = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(token));
  }, [dispatch, token]);

  if (orders?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[75vh] bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
          {/* Icon */}
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

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            No Orders Found
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            It looks like you haven&apos;t placed any orders yet. Start shopping now!
          </p>

          {/* Continue Shopping Button */}
          <Link to="/cart">
          <Button className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[75vh] bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Order Status:{" "}
            <span className="text-[#FF5A5A]">{"confirm".toUpperCase()}</span>
          </h1>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Order Summary
          </h2>

          {orders.map((order, index) => (
            <div key={index}>
              {order.cartItems.map((item, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={item?.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-md object-cover"
                      />
                      <h3 className="ml-4 text-gray-800 font-medium">
                        {item?.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-800 flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        <span className="text-lg font-medium ml-1">
                          {item?.price}
                        </span>
                      </div>
                    </div>
                  </div>
                  {idx < order.cartItems.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <Link to="/cart">
          <Button className="w-full">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
