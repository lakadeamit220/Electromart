import { useState } from "react";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import useAuthStore from "../store/authStore";

function Admin() {
  const { user } = useAuthStore();
  const [editingProduct, setEditingProduct] = useState(null);

  if (!user?.isAdmin) {
    return <div className="text-center p-6">Access Denied</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ProductForm
        product={editingProduct}
        onSubmit={() => setEditingProduct(null)}
      />
      <ProductList onEdit={setEditingProduct} />
    </div>
  );
}

export default Admin;
