import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { toast } from "react-toastify";

function ProductForm({ product, onSubmit }) {
  const { token } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });
  const [errors, setErrors] = useState([]);

  // Update formData when product prop changes (for editing)
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        image: product.image || "",
        stock: product.stock || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        await axios.put(
          `http://localhost:5000/api/products/${product._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product created successfully");
      }
      setErrors([]);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
      });
      onSubmit();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors.map((err) => err.msg));
      } else {
        toast.error("Failed to save product");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {product ? "Edit Product" : "Add Product"}
      </h2>
      {errors.length > 0 && (
        <div className="mb-4">
          {errors.map((error, index) => (
            <p key={index} className="text-red-600 text-sm">
              {error}
            </p>
          ))}
        </div>
      )}
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product Name"
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        name="price"
        type="number"
        step="0.01"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Image URL"
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        name="stock"
        type="number"
        value={formData.stock}
        onChange={handleChange}
        placeholder="Stock"
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Save
      </button>
    </form>
  );
}

export default ProductForm;
