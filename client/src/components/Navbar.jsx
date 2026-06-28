import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.qty, 0)
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="container-page nav-inner">

        {/* Brand */}
        <Link 
          to="/" 
          className="nav-brand"
        >
          <span className="nav-brand-mark">
            S
          </span>

          <span className="brand-text">
            ShopZone
          </span>
        </Link>


        {/* Navigation */}
        <nav className="nav-links">
          <NavLink 
            to="/"
            end
            className={({isActive}) =>
              `nav-link ${isActive ? "is-active" : ""}`
            }
          >
            Shop
          </NavLink>

          <NavLink
            to="/?category=new"
            className="nav-link"
          >
            New
          </NavLink>

          <NavLink
            to="/?category=featured"
            className="nav-link"
          >
            Featured
          </NavLink>
        </nav>


        {/* Actions */}
        <div className="nav-actions">


          {user ? (

            <div className="nav-user">

              <span className="nav-user-avatar">
                {
                  user.name?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase()
                }
              </span>


              <span className="nav-user-name">
                {user.name || "Account"}
              </span>


              <button
                onClick={handleLogout}
                className="btn btn-sm btn-ghost"
              >
                Logout
              </button>

            </div>


          ) : (

            <>
              <Link
                to="/login"
                className="btn btn-sm btn-ghost"
              >
                Sign in
              </Link>


              <Link
                to="/register"
                className="btn btn-sm btn-primary"
              >
                Join
              </Link>

            </>

          )}



          {/* Cart */}

          <Link
            to="/cart"
            className="cart-btn"
            aria-label="Shopping cart"
          >

            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >

              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>

              <line
                x1="3"
                y1="6"
                x2="21"
                y2="6"
              />

              <path d="M16 10a4 4 0 0 1-8 0"/>

            </svg>


            {cartCount > 0 && (

              <span className="cart-btn-count">
                {cartCount}
              </span>

            )}

          </Link>


        </div>


      </div>
    </header>
  );
}