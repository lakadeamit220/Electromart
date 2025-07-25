import { useState } from 'react';
import useCartStore from '../store/cartStore';
import { toast } from 'react-toastify';

function Cart() {
  const [isOpen, setIsOpen] = useState(true);
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-800">
            ✕
          </button>
        </div>
        {cart.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty</p>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between mb-4 border-b pb-4">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                      className="w-16 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                    <button
                      onClick={() => removeFromCart(item._id, item.name)}
                      className="py-1 px-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={clearCart}
                className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Clear Cart
              </button>
              <p className="text-xl font-bold text-gray-800">Total: ${total.toFixed(2)}</p>
            </div>
            <button
              className="w-full py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => toast.info('Checkout not implemented')}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;