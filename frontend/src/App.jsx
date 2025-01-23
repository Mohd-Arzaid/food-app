import { Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <Routes>
      {/* Route for UnAuthorized Users*/}
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="update-password/:token" element={<ForgotPasswordToken />} />
      <Route path="verify-email" element={<VerifyEmail />} />

      {/* Route for Authorized Users*/}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HeroSection />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search/:text" element={<SearchPage />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order/status" element={<Success />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/menu" element={<AddMenu />} />
        <Route path="/orders" element={<Orders />} />

      </Route>
    </Routes>
  );
}

export default App;
