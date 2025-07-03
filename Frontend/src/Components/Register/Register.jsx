import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [showPassword,setShowPassword]=useState(false)

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const users = await axios.post(
        "https://travelnest-3.onrender.com/api/auth/signup",
        userData
      );
      console.log(users);
      toast.success("Registered successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Navigate after the toast is shown
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      setUserData({ username: "", email: "", password: "" });
    } catch (error) {
      toast.error("Registration Failed.Check your details", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(error);
    }
  };
  const passwordVisibility=()=>{
    setShowPassword(!showPassword)
  }
  return (
    <div className="register-page">
      <ToastContainer />
      <div className="img-container"></div>
      <div className="register-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">User Name</label>
          <input
            type="text"
            placeholder="UserName"
            name="username"
            value={userData.username}
            id="username"
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            id="email"
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <div className="password-container">
          <input
            type={showPassword ? "text":"password"}
            placeholder="Password"
            name="password"
            value={userData.password}
            id="password"
            onChange={handleChange}
          />
          <span className="password-toggle"
          onClick={passwordVisibility}
          style={{"cursor":"pointer"}}>
            {showPassword ? <FaEyeSlash/>:<FaEye/>}
          </span>
          </div>
          <button type="submit">Register</button>
        </form>
        <div className="login">
          <p>Already Have an Account?</p>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
