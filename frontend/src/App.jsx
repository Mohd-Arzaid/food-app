import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ForgotPasswordToken from "./auth/ForgotPasswordToken";
import VerifyEmail from "./auth/VerifyEmail";
import MainLayout from "./layout/MainLayout";
import HeroSection from "./components/manual/HeroSection";
import Profile from "./components/manual/Profile";
import SearchPage from "./components/manual/SearchPage";
import RestaurantDetail from "./components/manual/RestaurantDetail";
import Cart from "./components/manual/Cart";
import Success from "./components/manual/Success";
import Restaurant from "./components/manual/Restaurant";
import AddMenu from "./components/manual/AddMenu";
import Orders from "./components/manual/Orders";
import OwnerHome from "./components/manual/OwnerHome";
import OpenRoute from "./authRoutes/OpenRoute";
import PrivateRoute from "./authRoutes/PrivateRoute";
import OwnerRoute from "./authRoutes/OwnerRoute";
import CustomerRoute from "./authRoutes/CustomerRoute";

function App() {
  return (
    <Routes>
      {/* Route for UnAuthorized Users*/}
      <Route
        path="signup"
        element={
          <OpenRoute>
            <Signup />
          </OpenRoute>
        }
      />
      <Route
        path="login"
        element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        }
      />
      <Route
        path="forgot-password"
        element={
          <OpenRoute>
            <ForgotPassword />
          </OpenRoute>
        }
      />
      <Route
        path="update-password/:token"
        element={
          <OpenRoute>
            <ForgotPasswordToken />
          </OpenRoute>
        }
      />
      <Route
        path="verify-email"
        element={
          <OpenRoute>
            <VerifyEmail />
          </OpenRoute>
        }
      />

      {/* Route for Authorized Users*/}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* Home: customer sees HeroSection, owner sees OwnerHome */}
        <Route index element={<HomeDispatch />} />
        <Route path="/profile" element={<Profile />} />

        {/* Customer-only routes */}
        <Route
          path="/search/:text?"
          element={
            <CustomerRoute>
              <SearchPage />
            </CustomerRoute>
          }
        />
        <Route
          path="/restaurant/:id"
          element={
            <CustomerRoute>
              <RestaurantDetail />
            </CustomerRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <CustomerRoute>
              <Cart />
            </CustomerRoute>
          }
        />
        <Route
          path="/order/status"
          element={
            <CustomerRoute>
              <Success />
            </CustomerRoute>
          }
        />

        {/* Owner-only routes */}
        <Route
          path="/restaurant"
          element={
            <OwnerRoute allowOnboarding>
              <Restaurant />
            </OwnerRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <OwnerRoute>
              <AddMenu />
            </OwnerRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <OwnerRoute>
              <Orders />
            </OwnerRoute>
          }
        />
      </Route>
    </Routes>
  );
}

// Dispatches to either the customer HeroSection or OwnerHome based on user role
const HomeDispatch = () => {
  const { user } = useSelector((state) => state.profile);
  if (user?.isRestaurantOwner) {
    return <OwnerHome />;
  }
  return <HeroSection />;
};

export default App;
