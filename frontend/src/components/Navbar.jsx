import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";

function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-white text-3xl font-bold tracking-tight"
        >
          ElectroMart
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-blue-200 transition">
            Home
          </Link>
          <Link
            to="/cart"
            className="text-white hover:text-blue-200 transition relative"
          >
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>
          {user ? (
            <>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="text-white hover:text-blue-200 transition"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="text-white hover:text-blue-200 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-blue-200 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white hover:text-blue-200 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
