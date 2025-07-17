import { useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

function ProductForm({ product, onSubmit }) {
  const { token } = useAuthStore();
  const [formData, setFormData] = useState(
    product || {
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
    }
  );

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
      } else {
        await axios.post("http://localhost:5000/api/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSubmit();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {product ? "Edit Product" : "Add Product"}
      </h2>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Image URL"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        name="stock"
        type="number"
        value={formData.stock}
        onChange={handleChange}
        placeholder="Stock"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Save
      </button>
    </form>
  );
}

export default ProductForm;
