import useCartStore from "../store/cartStore";

function ProductCard({ product }) {
  const { addToCart } = useCartStore();

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
        {product.description}
      </p>
      <p className="text-blue-700 font-bold text-lg mt-2">
        ${product.price.toFixed(2)}
      </p>
      <p className="text-gray-500 text-sm">Stock: {product.stock}</p>
      <button
        onClick={() => addToCart(product)}
        className={`mt-4 w-full py-2 rounded-lg text-white font-medium ${
          product.stock === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } transition`}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;
