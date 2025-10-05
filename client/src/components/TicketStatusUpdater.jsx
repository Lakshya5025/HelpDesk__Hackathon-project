import React from "react";
import axios from "axios";

function TicketStatusUpdater({ ticket, onTicketUpdate }) {
  const handleStatusChange = async (newStatus) => {
    if (ticket.status === newStatus) return;

    try {
      const response = await axios.patch(
        `http://localhost:8080/api/tickets/${ticket._id}`,
        { status: newStatus, version: ticket.version },
        { withCredentials: true }
      );
      alert(`Ticket status changed to: ${newStatus}`);
      onTicketUpdate(response.data);
    } catch (error) {
      console.error("Failed to update status", error);
      alert(error.response?.data?.message || "Error updating status.");
    }
  };

  return (
    <div className="status-updater-container">
      <h4>Update Status</h4>
      <div className="status-buttons">
        {ticket.status !== "open" && (
          <button onClick={() => handleStatusChange("open")} className="btn">
            Open Ticket
          </button>
        )}
        {ticket.status !== "closed" && (
          <button
            onClick={() => handleStatusChange("closed")}
            className="btn btn-danger">
            Close Ticket
          </button>
        )}
      </div>
    </div>
  );
}

export default TicketStatusUpdater;
