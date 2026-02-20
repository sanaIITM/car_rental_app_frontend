import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext) || {};

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">ApexDrive</Link>
      </div>

      <div className="nav-right">
        <Link to="/">Home</Link>

        {user && user.role === "admin" && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/bookings">All Bookings</Link>
            <Link to="/admin/users">Users</Link>
          </>
        )}

        {user && (
          <Link to="/bookings">My Bookings</Link>
        )}

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="btn-primary">Signup</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;