import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // This line remains exactly the same - it already handles both cases
  const redirectPath = location.state?.from || "/my-bookings";
  const redirectState = location.state?.hotel && location.state?.bookingDetails
    ? {
        hotel: location.state.hotel,
        bookingDetails: location.state.bookingDetails,
      }
    : null;

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!userData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!userData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "https://travelnest-3.onrender.com/api/auth/login",
        userData
      );

      if (response.data.success) {
        login(response.data.user, response.data.token);
        localStorage.setItem("token", response.data.token);

        toast.success(`${response.data.user.username} Login successful!`, {
          position: "top-right",
          autoClose: 3000,
        });

        setTimeout(() => {
          if (redirectState) {
            navigate(redirectPath, { state: redirectState });
          } else {
            navigate(redirectPath); // This will handle both wishlist and my-bookings
          }
        }, 3000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        "Login failed. Please check your credentials.", 
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  const handleClick = () => {
    navigate("/register");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="img-container"></div>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}

          <label htmlFor="password">Password</label>
          <div className={`password-container ${errors.password ? "error" : ""}`}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
            />
            <span
              className="password-toggle"
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}

          <button type="submit">Login</button>
          <div className="sign-up">
            <p className="signup-text">New to TravelNest? </p>
            <span className="signup-link" onClick={handleClick}>
              Sign Up
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;