import useCartStore from "../store/cartStore";

function ProductCard({ product }) {
  const { addToCart } = useCartStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
      />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-blue-600 font-bold mt-2">${product.price}</p>
      <p className="text-gray-500">Stock: {product.stock}</p>
      <button
        onClick={() => addToCart(product)}
        className="bg-blue-600 text-white p-2 rounded mt-2 w-full"
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}

export default ProductCard;
