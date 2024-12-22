"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      router.push("/signin"); // Redirect if not logged in
    }
  }, [router]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isClient]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data from localStorage
    router.push("/signin"); // Redirect to Sign In page
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-5">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Welcome to Our Store</h2>
        <div className="text-xl font-bold bg-gray-200 py-1 px-3 rounded-lg">
          Cart: {cart.reduce((count, item) => count + item.quantity, 0)}
        </div>
      </div>

      
      {/* Checkout Button */}
      <Link
        href="/checkout"
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
        Go to Checkout
      </Link>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for products..."
        className="bg-gray-100 w-full py-2 px-4 rounded-xl my-5"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Log Out Button*/}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none">
          Log Out
        </button>
      </div>


      {/* Products Section */}
      <h2 className="text-3xl font-bold mb-4">Our Products</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="bg-blue-200 p-5 rounded-xl">
              <img
                src={product.picture}
                alt={product.name}
                className="w-64 h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-sm mb-4">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold">${product.price}</span>
                <button
                  className="bg-emerald-400 text-white py-1 px-3 rounded"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
}
