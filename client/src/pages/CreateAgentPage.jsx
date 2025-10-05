import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users/create-agent`;

function CreateAgentPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
  });
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

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
      alert("New agent/admin created successfully!");
      navigate("/");
    } catch (error) {
      alert("Failed to create agent/admin. Please check the details.");
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Agent/Admin</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Enter name"
          required
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Enter email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Enter password"
          required
        />
        <select name="role" value={role} onChange={onChange}>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="btn">
          Create User
        </button>
      </form>
    </div>
  );
}

export default CreateAgentPage;
