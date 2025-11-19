import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = `${import.meta.env.VITE_API_URL}`;

function TicketAssignment({ ticket, onTicketUpdate }) {
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(
    ticket.assignedTo || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
          setError("Failed to load agents");
        }
      };
      fetchAgents();
    }
  }, [user]);

  const handleAssign = async (agentIdToAssign) => {
    if (!agentIdToAssign) {
      setError("Please select an agent first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.patch(
        `${API_URL}/api/tickets/${ticket._id}`,
        {
          assignedTo: agentIdToAssign,
          status: "assigned",
          version: ticket.version,
        },
        { withCredentials: true }
      );
      console.log("Ticket assigned successfully!");
      onTicketUpdate(response.data);
    } catch (error) {
      console.error("Failed to assign ticket", error);
      setError(error.response?.data?.message || "Error assigning ticket");
    } finally {
      setLoading(false);
    }
  };

  if (user && user.role === "admin") {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h4 className="text-sm font-semibold text-white">Assign Agent</h4>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        <select
          value={selectedAgentId}
          onChange={(e) => {
            setSelectedAgentId(e.target.value);
            setError("");
          }}
          className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none hover:border-blue-500 text-sm">
          <option value="" className="bg-slate-800">
            -- Select an Agent --
          </option>
          {agents.map((agent) => (
            <option key={agent._id} value={agent._id} className="bg-slate-800">
              {agent.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => handleAssign(selectedAgentId)}
          disabled={loading || !selectedAgentId}
          className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm">
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Assigning...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Assign Ticket
            </span>
          )}
        </button>
      </div>
    );
  }

  if (user && user.role === "agent") {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h4 className="text-sm font-semibold text-white">Assign Ticket</h4>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-3 py-2 rounded-lg text-xs">
            {error}
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-3 mb-3">
          <p className="text-xs text-slate-300">
            Click the button below to assign this ticket to yourself
          </p>
        </div>

        <button
          onClick={() => handleAssign(user._id)}
          disabled={loading}
          className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm">
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Assigning...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Assign to Me
            </span>
          )}
        </button>
      </div>
    );
  }

  return null;
}

export default TicketAssignment;
