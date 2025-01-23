import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to Home Page</h1>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
        <li>
          <Link to="/forgot-password">Forgot Password</Link>
        </li>
        <li>
          <Link to="/update-password/sample-token">
            Update Password (Token Example)
          </Link>
        </li>
        <li>
          <Link to="/verify-email">Verify Email</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
