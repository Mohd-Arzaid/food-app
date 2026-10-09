import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getRestaurant } from "@/apiServices/apiHandlers/restaurantAPI";

const OwnerRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
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

  if (!restaurant) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default OwnerRoute;
