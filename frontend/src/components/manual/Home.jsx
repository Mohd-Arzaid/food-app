
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <Link to="/login">
      Login
      </Link>
      <Link to="/signup">   
      Sign Up
      </Link>
    </div>
  )
}

export default Home
