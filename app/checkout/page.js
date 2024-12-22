"use client";

import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [deliveryDetails, setDeliveryDetails] = useState({
    deliveryMethod: "standard", //  delivery method
    deliveryAddress: "",
    deliveryType: "delivery", 
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  // Function to calculate the total price
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Function to handle customer input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Function to handle delivery method changes
  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Function to handle quantity updates
  const handleQuantityChange = (id, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(newQuantity, 1) } // Prevent quantity from going below 1
        : item
    );
    updateLocalStorage(updatedCart);
  };

  // Function to remove items from the cart
  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    updateLocalStorage(updatedCart);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (
      !customerDetails.name ||
      !customerDetails.email ||
      (deliveryDetails.deliveryType === "delivery" &&
        !deliveryDetails.deliveryAddress)
    ) {
      setError("Please fill out all required fields.");
      return;
    }
    setError(""); // Reset error

    // Example logic after checkout is confirmed (e.g., displaying a success message)
    alert("Your order has been confirmed!");
  };

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold mb-4">Checkout</h2>

      {/* Customer Details */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-bold mb-4">Customer Details</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={customerDetails.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={customerDetails.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your email"
            />
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-bold mb-4">Delivery Options</h3>
        <div className="space-y-3">
          <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="deliveryType"
                value="delivery"
                checked={deliveryDetails.deliveryType === "delivery"}
                onChange={handleDeliveryChange}
                className="mr-2"
              />
              Delivery
            </label>
            <label className="inline-flex items-center ml-5">
              <input
                type="radio"
                name="deliveryType"
                value="pickup"
                checked={deliveryDetails.deliveryType === "pickup"}
                onChange={handleDeliveryChange}
                className="mr-2"
              />
              Pickup (In-store)
            </label>
          </div>

          {deliveryDetails.deliveryType === "delivery" && (
            <>
              <div>
                <label className="block text-sm font-bold mb-1">Delivery Address</label>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={deliveryDetails.deliveryAddress}
                  onChange={handleDeliveryChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter delivery address"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Delivery Method</label>
                <select
                  name="deliveryMethod"
                  value={deliveryDetails.deliveryMethod}
                  onChange={handleDeliveryChange}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="standard">Standard Delivery</option>
                  <option value="express">Express Delivery</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
            >
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500">${item.price}</p>
                {/* Quantity Selector */}
                <div className="flex items-center mt-2">
                  <button
                    className="bg-gray-300 text-gray-700 px-2 rounded"
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="bg-gray-300 text-gray-700 px-2 rounded"
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                {/* Total Price for Item */}
                <div className="text-xl font-bold mr-4">
                  ${item.price * item.quantity}
                </div>
                {/* Remove Button */}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
      </div>

      {/* Total Price */}
      {cartItems.length > 0 && (
        <div className="mt-6 text-right">
          <h3 className="text-2xl font-bold">Total: ${calculateTotal()}</h3>
        </div>
      )}

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <button
          className="bg-emerald-500 text-white py-2 px-6 rounded-lg mt-6 hover:bg-emerald-600"
          onClick={handleCheckout}
        >
          Proceed to Payment
        </button>
      )}
    </div>
  );
}
