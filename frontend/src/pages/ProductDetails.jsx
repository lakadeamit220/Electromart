import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";
import useCartStore from "../store/cartStore";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewErrors, setReviewErrors] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        toast.error("Failed to fetch product");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a review");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        reviewForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProduct({ ...product, reviews: [...product.reviews, response.data] });
      setReviewForm({ rating: 5, comment: "" });
      toast.success("Review submitted successfully");
      setReviewErrors([]);
    } catch (error) {
      if (error.response?.data?.errors) {
        setReviewErrors(error.response.data.errors.map((err) => err.msg));
      } else {
        toast.error("Failed to submit review");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/2 h-96 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-blue-700 font-bold text-2xl mb-4">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-500 mb-4">Category: {product.category}</p>
            <p className="text-gray-500 mb-4">Stock: {product.stock}</p>
            <button
              onClick={() => addToCart(product)}
              className={`w-full py-3 rounded-lg text-white font-medium ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition`}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
          {product.reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review._id} className="border-b pb-4">
                  <p className="text-yellow-500">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </p>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-gray-500 text-sm">
                    Posted on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
          {user && (
            <form onSubmit={handleReviewSubmit} className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Add a Review
              </h3>
              {reviewErrors.length > 0 && (
                <div className="mb-4">
                  {reviewErrors.map((error, index) => (
                    <p key={index} className="text-red-600 text-sm">
                      {error}
                    </p>
                  ))}
                </div>
              )}
              <select
                name="rating"
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm({
                    ...reviewForm,
                    rating: parseInt(e.target.value),
                  })
                }
                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <textarea
                name="comment"
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                placeholder="Your review"
                className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                disabled={loading}
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
