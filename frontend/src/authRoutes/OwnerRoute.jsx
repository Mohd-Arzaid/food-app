import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getRestaurant } from "@/apiServices/apiHandlers/restaurantAPI";

const OwnerRoute = ({ children, allowOnboarding = false }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { restaurant } = useSelector((state) => state.restaurant);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    dispatch(getRestaurant(token)).finally(() => {
      if (active) {
        setChecked(true);
      }
    });
    return () => {
      active = false;
    };
  }, [dispatch, token]);

  if (!checked) {
    return null;
  }

  if (!user?.isRestaurantOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default OwnerRoute;
