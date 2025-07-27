import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import useAuthStore from "../store/authStore";
import { toast } from "react-toastify";

function ProductList({ onEdit }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user, token } = useAuthStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/categories"
        );
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          page,
          limit: 9,
        };
        if (search) params.search = search;
        if (category) params.category = category;
        if (sort) params.sort = sort;

        const response = await axios.get("http://localhost:5000/api/products", {
          params,
        });
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        toast.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, [page, search, category, sort, refreshTrigger]);

  const handleDelete = async (id, name) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product._id !== id));
      toast.success(`${name} deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // Function to trigger product list refresh
  const refreshProducts = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full md:w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full md:w-1/4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id}>
            <ProductCard product={product} />
            {user?.isAdmin && (
              <div className="mt-4 flex justify-between gap-2">
                <button
                  onClick={() => onEdit(product)}
                  className="flex-1 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id, product.name)}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductList;
