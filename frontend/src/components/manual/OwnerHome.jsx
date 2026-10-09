import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  SquareMenu,
  PackageCheck,
  Plus,
  Store,
  Clock,
  MapPin,
  Sparkles,
  ClipboardList,
  Utensils,
  TrendingUp,
} from "lucide-react";

const OwnerHome = () => {
  const { user } = useSelector((state) => state.profile);
  const { restaurant, loading } = useSelector((state) => state.restaurant);

  // Still checking or loading restaurant details
  if (loading && !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#1f2937] border-t-transparent"></div>
      </div>
    );
  }

  // Owner has no restaurant yet — Fashion-style clean, premium onboarding
  if (!restaurant) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-2xl w-full text-center">
          {/* Pill Badge */}
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f5f5] border border-[#e5e7eb] px-4 py-1.5 text-xs sm:text-sm font-medium text-[#6b7280] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#1f2937]" />
            Restaurant Partner Portal
          </span>

          {/* Store Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f5f5f5] border border-[#e5e7eb] text-[#1f2937]">
            <Store className="w-10 h-10" />
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
            Welcome, {user?.firstName || "Partner"}! 👋
          </h1>

          <p className="mt-4 text-base leading-7 text-[#6b7280] sm:text-lg sm:leading-8 max-w-xl mx-auto px-4">
            You&apos;re registered as a{" "}
            <span className="font-semibold text-[#111827]">
              Restaurant Owner
            </span>
            . To get started, create your restaurant profile so customers can
            discover your menu and place orders.
          </p>

          {/* Primary CTA Button */}
          <div className="mt-8 flex justify-center">
            <Link to="/restaurant">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#1f2937] px-8 font-medium text-white transition-colors hover:bg-black cursor-pointer shadow-sm text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your Restaurant</span>
              </button>
            </Link>
          </div>

          {/* 3 Step Features / Why Setup Cards */}
          <div className="mt-14 pt-10 border-t border-[#e5e7eb] grid gap-4 sm:grid-cols-3 text-center">
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#1f2937]">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#111827]">
                1. Add Details
              </h3>
              <p className="mt-2 text-xs leading-5 text-[#6b7280]">
                Set restaurant name, city, delivery time and cover photo.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#1f2937]">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#111827]">
                2. Build Menu
              </h3>
              <p className="mt-2 text-xs leading-5 text-[#6b7280]">
                Add dishes, prices, descriptions and appetizing images.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#1f2937]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#111827]">
                3. Receive Orders
              </h3>
              <p className="mt-2 text-xs leading-5 text-[#6b7280]">
                Manage incoming orders and update delivery status live.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Owner has a restaurant — Fashion-style clean, modern dashboard
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Restaurant Banner Card */}
      <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-[#f5f5f5]">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.restaurantName}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f5] border border-[#e5e7eb] px-3 py-1 text-xs font-medium text-[#6b7280] mb-2">
            <Store className="w-3.5 h-3.5 text-[#1f2937]" />
            Restaurant Dashboard
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">
            {restaurant.restaurantName}
          </h1>

          <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-[#6b7280]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1f2937]" />
              {restaurant.city}, {restaurant.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#1f2937]" />
              {restaurant.deliveryTime} mins delivery
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
            {restaurant.cuisines?.map((cuisine, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-lg bg-[#f5f5f5] border border-[#e5e7eb] px-3 py-1 text-xs font-medium text-[#111827]"
              >
                {cuisine}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center md:self-start">
          <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
            ● Active
          </span>
        </div>
      </div>

      {/* Action Cards */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#111827]">
              Manage Your Restaurant
            </h2>
            <p className="text-sm text-[#6b7280] mt-1">
              Quick tools to manage your restaurant, menu and orders
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            to="/restaurant"
            icon={<UtensilsCrossed className="w-6 h-6" />}
            title="Restaurant Details"
            description="Update name, location, delivery time, and cuisines."
          />
          <DashboardCard
            to="/menu"
            icon={<SquareMenu className="w-6 h-6" />}
            title="Manage Menu"
            description="Add, edit or remove menu items, prices and photos."
          />
          <DashboardCard
            to="/orders"
            icon={<PackageCheck className="w-6 h-6" />}
            title="Restaurant Orders"
            description="View incoming customer orders and update status."
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ to, icon, title, description }) => (
  <Link
    to={to}
    className="group overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
  >
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#1f2937] transition-colors group-hover:bg-[#1f2937] group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#111827] transition-colors group-hover:text-[#1f2937]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#6b7280]">{description}</p>
    </div>

    <div className="mt-6 flex items-center gap-1 text-xs font-medium text-[#111827] group-hover:underline">
      <span>Open</span>
      <span>&rarr;</span>
    </div>
  </Link>
);

export default OwnerHome;
