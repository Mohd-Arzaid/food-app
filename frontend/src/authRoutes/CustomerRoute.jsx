// CustomerRoute: Allows only non-owner users to access a route.
// Restaurant owners are redirected to home.

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const CustomerRoute = ({ children }) => {
  const { user } = useSelector((state) => state.profile);

  // If user is a restaurant owner, redirect to home
  if (user?.isRestaurantOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CustomerRoute;
