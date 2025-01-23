import { Route, Routes } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Home from "./components/manual/Home";
import ForgotPassword from "./auth/ForgotPassword";
import ForgotPasswordToken from "./auth/ForgotPasswordToken";
import VerifyEmail from "./auth/VerifyEmail";

function App() {
  return (
    <Routes>
      {/* Route for UnAuthorized Users*/}
      <Route path="/" element={<Home />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="update-password/:token" element={<ForgotPasswordToken />} />
      <Route path="verify-email" element={<VerifyEmail />} />
    </Routes>
  );
}

export default App;
