import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import Background from "./Background";
import LogoL from "./LogoL";

const apiUrl = import.meta.env.VITE_BACKEND_API;

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const loginData = email.includes("@")
      ? { email, password }
      : { username, password };

    try {
      const res = await axios.post(`${apiUrl}/users/login`, loginData, {
        withCredentials: true,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(`${res.data.user.username} successfully logged in`);
      navigate("/home");
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Try again.";
      setError(message);
      toast.error("Invalid Credential");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Background />
      <ToastContainer />
      {loading && <LogoL />}

      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/30 backdrop-blur-md shadow-lg rounded-xl px-6 py-8">
          <form onSubmit={handleLogin}>
            <img
              src="./images/login-lock.png"
              className="w-24 h-24 mx-auto mb-4"
              alt="login icon"
            />

            {error && (
              <p className="text-red-600 text-center text-sm mb-4">{error}</p>
            )}

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username or Email"
                className="p-3 w-full rounded-md text-blue-900 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username || email}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.includes("@")) {
                    setEmail(value);
                    setUsername("");
                  } else {
                    setUsername(value);
                    setEmail("");
                  }
                }}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="p-3 w-full text-blue-900 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between text-sm">
                <p className="text-gray-700">Don’t have an account?</p>
                <Link to="/signup" className="text-blue-600 underline">
                  Signup
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="p-3 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "LOGIN"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
