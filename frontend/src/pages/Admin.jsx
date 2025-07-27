import { useState } from "react";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import useAuthStore from "../store/authStore";
import { ToastContainer } from "react-toastify";

function Admin() {
  const { user } = useAuthStore();
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!user?.isAdmin) {
    return (
      <div className="text-center p-6 text-xl text-gray-800">Access Denied</div>
    );
  }

  const handleFormSubmit = () => {
    setEditingProduct(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Admin Dashboard
      </h1>
      <ProductForm product={editingProduct} onSubmit={handleFormSubmit} />
      <ProductList onEdit={setEditingProduct} key={refreshTrigger} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
}

export default Admin;
