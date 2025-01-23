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
      </Route>
    </Routes>
  );
}

export default App;
