import useCartStore from '../store/cartStore';

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty</p>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {cart.map((item) => (
              <div key={item._id} className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price} x {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="w-16 p-2 border rounded mr-2"
                    min="1"
                  />
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="bg-red-600 text-white p-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-6">
              <button onClick={clearCart} className="bg-red-600 text-white p-2 rounded">Clear Cart</button>
              <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white p-2 rounded mt-6 w-full">
            Proceed to Checkout (Not Implemented)
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;