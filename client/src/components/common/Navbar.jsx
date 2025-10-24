import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./Navbar.css";
import { useState } from "react";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          TeeStore
        </Link>
      </div>

      {/* Hamburger Button */}
      <button
        className="nav-toggle"
        aria-label="toggle navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        &#9776;
      </button>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link
          to="/contact"
          className={location.pathname === "/contact" ? "active" : ""}
        >
          Contact Us
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              to="/cart"
              className={location.pathname === "/cart" ? "active" : ""}
            >
              Cart
            </Link>
            <Link
              to="/orders"
              className={location.pathname === "/orders" ? "active" : ""}
            >
              Past Orders
            </Link>
            <span className="user-badge">👋 Hi, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-btn">
              Sign In
            </Link>
            <Link to="/signup" className="auth-btn secondary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
