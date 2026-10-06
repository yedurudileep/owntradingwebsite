import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          Own<span>Trading</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>

          <Link to="/risk-calculator">
            Risk Calculator
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;