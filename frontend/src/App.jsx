import { Route, Routes } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Home from "./components/manual/Home";
import ForgotPassword from "./auth/ForgotPassword";

function App() {
  return (
    <Routes>
      {/* Route for UnAuthorized Users*/}
      <Route path="/" element={<Home />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
