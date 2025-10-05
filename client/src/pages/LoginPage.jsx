import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/login";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData, { withCredentials: true });

      navigate("/"); // Navigate to the main page
    } catch (error) {
      alert("Login failed. Check your credentials.");
      console.error(error);
    }
  };

  // ... (rest of the JSX is the same)
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;
