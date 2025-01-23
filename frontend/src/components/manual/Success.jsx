import { IndianRupee } from "lucide-react";
import HeroImage from "../../assets/hero_pizza_.png";
import { Separator } from "../ui/separator";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
const Success = () => {
  return (
    <div className="flex items-center justify-center min-h-[75vh] bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 ">
            Order Status:{" "}
            <span className="text-[#FF5A5A]">{"confirm".toUpperCase()}</span>
          </h1>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700mb-4">
            Order Summary
          </h2>

          {/* Your Ordered Item Display here  */}
          <div>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={HeroImage}
                    alt=""
                    className="w-14 h-14 rounded-md object-cover"
                  />
                  <h3 className="ml-4 text-gray-800font-medium">Item Name</h3>
                </div>
                <div className="text-right">
                  <div className="text-gray-800 flex items-center">
                    <IndianRupee />
                    <span className="text-lg font-medium">100</span>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
            </div>
          </div>
        </div>
        <Link to="/cart">
          <Button className="w-full py-3 rounded-md shadow-lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
