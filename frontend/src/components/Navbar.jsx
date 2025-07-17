import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";

function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Electromart
        </Link>
        <div className="flex items-center">
          <Link to="/" className="text-white mx-4">
            Home
          </Link>
          <Link to="/cart" className="text-white mx-4">
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </Link>
          {user ? (
            <>
              {user.isAdmin && (
                <Link to="/admin" className="text-white mx-4">
                  Admin
                </Link>
              )}
              <button onClick={logout} className="text-white mx-4">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mx-4">
                Login
              </Link>
              <Link to="/register" className="text-white mx-4">
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
