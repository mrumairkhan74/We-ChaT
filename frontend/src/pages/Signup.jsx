import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Background from "./Background";
import LogoS from "./LogoS";
const apiUrl = import.meta.env.VITE_BACKEND_API;

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !username || !email || !password) {
      toast.error("Please Fill All Fields");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${apiUrl}/users/create`,
        { name, username, email, password },
        { withCredentials: true }
      );

      if (res.data?.exists) {
        toast.error("User Already Exists");
        setLoading(false);
        return;
      }

      toast.success(`${res.data.username} Registered Successfully`);
      navigate("/");
    } catch (err) {
      setError("Something went wrong");
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <Background />

      {/* Full-screen loader overlay */}
      {loading && <LogoS />}

      <div className="w-full min-h-screen flex items-center justify-center relative p-4">
        <div className="w-full max-w-md rounded-md bg-white/30 backdrop-blur-sm shadow-md shadow-black p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p className="text-red-500 text-center font-semibold">{error}</p>
            )}
            <img
              src="./images/signup.png"
              alt="signup icon"
              className="w-40 mx-auto mb-4"
            />
            <input
              type="text"
              className="p-3 w-full rounded-md border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
            <input
              type="text"
              className="p-3 w-full rounded-md border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
            <input
              type="email"
              className="p-3 w-full rounded-md border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <input
              type="password"
              className="p-3 w-full rounded-md border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <div className="flex items-center gap-2 text-sm justify-center">
              <p>I already have an account</p>
              <Link to="/" className="text-blue-600 underline">
                Login
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="p-3 rounded-md border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
