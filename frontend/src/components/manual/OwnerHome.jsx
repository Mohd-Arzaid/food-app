import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  UtensilsCrossed,
  SquareMenu,
  PackageCheck,
  PlusCircle,
  Store,
} from "lucide-react";

const OwnerHome = () => {
  const { user } = useSelector((state) => state.profile);
  const { restaurant, loading } = useSelector((state) => state.restaurant);

  // Still checking or loading restaurant details
  if (loading && !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-[75vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Owner has no restaurant yet — show onboarding CTA
  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
        <div className="bg-white shadow-lg rounded-2xl p-10 max-w-lg w-full text-center space-y-6">
          <div className="flex justify-center">
            <Store className="w-20 h-20 text-orange-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            You&apos;re registered as a{" "}
            <span className="font-semibold text-orange-500">
              Restaurant Owner
            </span>
            . To get started, create your restaurant profile so customers can
            discover your menu and place orders.
          </p>
          <Link to="/restaurant">
            <Button className="w-full flex items-center justify-center gap-2 py-3 text-base">
              <PlusCircle className="w-5 h-5" />
              Create Your Restaurant
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Owner has a restaurant — show dashboard
  return (
    <div className="max-w-[90%] md:max-w-[80%] mx-auto my-10 space-y-10">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.restaurantName}
            className="w-28 h-28 rounded-xl object-cover shadow-md"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-orange-500 uppercase tracking-wide">
            Your Restaurant
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1">
            {restaurant.restaurantName}
          </h1>
          <p className="text-gray-500 mt-1">
            {restaurant.city}, {restaurant.country} &bull;{" "}
            {restaurant.deliveryTime} min delivery
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {restaurant.cuisines?.map((c, i) => (
              <span
                key={i}
                className="bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick action cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          Manage Your Restaurant
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <DashboardCard
            to="/restaurant"
            icon={<UtensilsCrossed className="w-8 h-8 text-orange-500" />}
            title="Restaurant Details"
            description="Update name, location, delivery time, and cuisines."
          />
          <DashboardCard
            to="/menu"
            icon={<SquareMenu className="w-8 h-8 text-orange-500" />}
            title="Manage Menu"
            description="Add, edit or remove menu items and prices."
          />
          <DashboardCard
            to="/orders"
            icon={<PackageCheck className="w-8 h-8 text-orange-500" />}
            title="Restaurant Orders"
            description="View incoming orders and update their status."
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ to, icon, title, description }) => (
  <Link
    to={to}
    className="group flex flex-col items-center text-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-200"
  >
    <div className="mb-4 p-3 rounded-full bg-orange-50 group-hover:bg-orange-100 transition-colors">
      {icon}
    </div>
    <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </Link>
);

export default OwnerHome;
