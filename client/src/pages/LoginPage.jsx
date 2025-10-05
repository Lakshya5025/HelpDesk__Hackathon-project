import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth/login`;
function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, formData, {
        withCredentials: true,
      });

      login(response.data);

      console.log("Login successful!");
      navigate("/");
    } catch (error) {
      alert("Login failed. Check your credentials.");
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder="Enter password"
          required
        />
        <button type="submit" className="btn">
          Login
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <div>
        <div>User: email:user@example.com ||| password:password123</div>
        <div>Agent: email: agent@example.co ||| password:password123</div>
        <div>Admin: email: admin@example.com ||| password:password123</div>
      </div>
    </div>
  );
}

export default LoginPage;
