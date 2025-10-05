import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function TicketAssignment({ ticket, onTicketUpdate }) {
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const { user } = useContext(AuthContext); // Get current user from context

  useEffect(() => {
    if (user && user.role === "admin") {
      const fetchAgents = async () => {
        try {
          const { data } = await axios.get(
            "http://localhost:8080/api/users/agents",
            { withCredentials: true }
          );
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
        `http://localhost:8080/api/tickets/${ticket._id}`,
        { assignedTo: agentIdToAssign, version: ticket.version },
        { withCredentials: true }
      );
      alert("Ticket assigned successfully!");
      onTicketUpdate(response.data);
    } catch (error) {
      console.error("Failed to assign ticket", error);
      alert(error.response?.data?.message || "Error assigning ticket.");
    }
  };

  // If the user is an admin, show the dropdown menu
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

  // If the user is an agent, show a simple "Assign to me" button
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

  // If the user is a regular user, this component will not be rendered at all.
  return null;
}

export default TicketAssignment;
