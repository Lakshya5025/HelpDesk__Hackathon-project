import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const API_URL = `${import.meta.env.VITE_API_URL}`;

function TicketAssignment({ ticket, onTicketUpdate }) {
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.role === "admin") {
      const fetchAgents = async () => {
        try {
          const { data } = await axios.get(`${API_URL}/api/users/agents`, {
            withCredentials: true,
          });
          setAgents(data);
        } catch (error) {
          console.error("Could not fetch agents", error);
        }
      };
      fetchAgents();
    }
  }, [user]);

  const handleAssign = async (agentIdToAssign) => {
    if (!agentIdToAssign) {
      return alert("No agent selected.");
    }
    try {
      const response = await axios.patch(
        `${API_URL}/tickets/${ticket._id}`,
        { assignedTo: agentIdToAssign, version: ticket.version },
        { withCredentials: true }
      );
      console.log("Ticket assigned successfully!");
      onTicketUpdate(response.data);
    } catch (error) {
      console.error("Failed to assign ticket", error);
      alert(error.response?.data?.message || "Error assigning ticket.");
    }
  };

  if (user && user.role === "admin") {
    return (
      <div className="assignment-container">
        <h4>Assign Ticket</h4>
        <select
          value={selectedAgentId}
          onChange={(e) => setSelectedAgentId(e.target.value)}>
          <option value="">-- Select an Agent --</option>
          {agents.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleAssign(selectedAgentId)}
          className="btn btn-sm">
          Assign
        </button>
      </div>
    );
  }

  if (user && user.role === "agent") {
    return (
      <div className="assignment-container">
        <h4>Assign Ticket</h4>
        <button onClick={() => handleAssign(user._id)} className="btn">
          Assign to Me
        </button>
      </div>
    );
  }

  return null;
}

export default TicketAssignment;
