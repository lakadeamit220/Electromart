import ProductList from "../components/ProductList";

function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-6">
        Welcome to Electromart
      </h1>
      <ProductList />
    </div>
  );
}

export default Home;
