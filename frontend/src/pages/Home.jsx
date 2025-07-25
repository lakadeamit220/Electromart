import ProductList from "../components/ProductList";
import { ToastContainer } from "react-toastify";

function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-extrabold text-center my-8 text-gray-800">
        Welcome to ElectroMart
      </h1>
      <ProductList />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
}

export default Home;
