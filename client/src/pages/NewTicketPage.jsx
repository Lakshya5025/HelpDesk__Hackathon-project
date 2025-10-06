import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = `${import.meta.env.VITE_API_URL}/api/tickets`;
function NewTicketPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
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
      await axios.post(`${API_URL}`, formData, {
        withCredentials: true,
      });
      console.log("Ticket created successfully!");
      navigate("/tickets");
    } catch (error) {
      console.error("Failed to create ticket", error);
      alert("Error creating ticket. Are you logged in?");
    }
  };

  return (
    <div className="form-container">
      <h2>Create a New Ticket</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={onChange}
          placeholder="What is the issue?"
          required
        />
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Please describe the issue in detail."
          rows={5}
          required></textarea>
        <button className="btn" type="submit">
          Submit Ticket
        </button>
      </form>
    </div>
  );
}

export default NewTicketPage;
