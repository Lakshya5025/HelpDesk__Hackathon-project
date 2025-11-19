import React, { useState } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/tickets`;

function TicketStatusUpdater({ ticket, onTicketUpdate, user }) {
  const [loading, setLoading] = useState(false);

  // Helper to check if action is allowed
  const canClose = ticket.comments.length > 0;

  const handleStatusChange = async (newStatus) => {
    if (ticket.status === newStatus) return;

    // Specific check for closing
    if (newStatus === "closed" && !canClose) {
      alert("Cannot close ticket without comments/resolution.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch(
        `${API_URL}/${ticket._id}`,
        {
          status: newStatus,
          assignedTo: user._id,
          version: ticket.version,
        },
        { withCredentials: true }
      );
      // Use a more subtle notification or toast in real app, keeping alert for now as per original
      // alert(`Ticket status changed to: ${newStatus}`);
      onTicketUpdate(response.data);
    } catch (error) {
      console.error("Failed to update status", error);
      alert(error.response?.data?.message || "Error updating status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {/* Note: Using text-slate-900 to contrast against light background, 
            or text-white if this sits in a dark container. 
            Based on TicketAssignment sitting in Agent Controls (light), 
            I am using slate-900 for better visibility, though TicketAssignment used white. */}
        <h4 className="text-sm font-semibold text-slate-700">Update Status</h4>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3">
        {ticket.status === "closed" && user.role === "admin" && (
          <button
            onClick={() => handleStatusChange("assigned")}
            disabled={loading}
            className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center">
            {loading ? (
              "Updating..."
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Re-open Ticket
              </>
            )}
          </button>
        )}

        {ticket.status !== "closed" && (
          <div className="space-y-2">
            <button
              onClick={() => handleStatusChange("closed")}
              disabled={loading || !canClose}
              className={`w-full px-4 py-2.5 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center
                ${
                  canClose
                    ? "bg-rose-600 hover:bg-rose-700 active:bg-rose-800"
                    : "bg-slate-400 cursor-not-allowed hover:transform-none hover:shadow-md"
                }`}
              title={
                !canClose
                  ? "Cannot close ticket without comments"
                  : "Close this ticket"
              }>
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                <>
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
                  Close Ticket
                </>
              )}
            </button>

            {/* Helper text for disabled state */}
            {!canClose && (
              <p className="text-xs text-rose-500 text-center bg-rose-50 border border-rose-100 rounded p-1.5">
                Add a comment/resolution before closing.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketStatusUpdater;
