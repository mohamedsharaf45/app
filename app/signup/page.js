"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirecting after sign-up

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");

    // Check if the email already exists in localStorage
    const existingUser = JSON.parse(localStorage.getItem("user"));
    if (existingUser && existingUser.email === formData.email) {
      setError("This email is already registered. Please sign in.");
      return;
    }

    // Simulate user creation (You can replace this with API logic)
    console.log("User Created:", formData);

    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(formData));

    // Redirect to Sign In page after successful sign up
    router.push("/signin");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Sign Up</h2>

      {/* Display the error message */}
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="w-full bg-emerald-500 text-white py-3 rounded-md mt-4 hover:bg-emerald-600">
          Sign Up
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:text-blue-700">Sign In</a>
        </p>
      </div>
    </div>
  );
}
