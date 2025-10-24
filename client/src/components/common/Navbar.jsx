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

  // Helper function to close the menu on navigation
  const handleLinkClick = () => {
    setMenuOpen(false);
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
        {/* ADDED MISSING HOME LINK */}
        <Link 
          to="/" 
          className={location.pathname === "/" ? "active" : ""} 
          onClick={handleLinkClick}
        >
          Home
        </Link>
        <Link
          to="/contact"
          className={location.pathname === "/contact" ? "active" : ""}
          onClick={handleLinkClick}
        >
          Contact Us
        </Link>

        {isLoggedIn ? (
          <>
            {/* Logged-in links */}
            <Link
              to="/cart"
              className={location.pathname === "/cart" ? "active" : ""}
              onClick={handleLinkClick}
            >
              Cart
            </Link>
            <Link
              to="/orders"
              className={location.pathname === "/orders" ? "active" : ""}
              onClick={handleLinkClick}
            >
              Past Orders
            </Link>
            <span className="user-badge">👋 Hi, {user.name}</span>
            <button 
              onClick={() => {handleLogout(); handleLinkClick();}} 
              className="logout-btn"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Logged-out links */}
            <Link to="/login" className="auth-btn" onClick={handleLinkClick}>
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="auth-btn secondary"
              onClick={handleLinkClick}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;