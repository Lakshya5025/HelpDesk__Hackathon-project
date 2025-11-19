import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import TicketAssignment from "../components/TicketAssignment";
import TicketStatusUpdater from "../components/TicketStatusUpdater";

const API_URL = `${import.meta.env.VITE_API_URL}/api/tickets`;

function TicketDetailPage() {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const fetchTicket = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      setTicket(response.data);
    } catch (err) {
      console.error("Could not fetch ticket", err);
      setError("Could not load ticket details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const onCommentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/${id}/comments`,
        { text: commentText },
        { withCredentials: true }
      );
      setCommentText("");
      fetchTicket();
    } catch (error) {
      console.error("Failed to add comment", error);
      alert("Error adding comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-800 border-blue-200",
      assigned: "bg-amber-100 text-amber-800 border-amber-200",
      closed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
    return colors[status] || "bg-slate-100 text-slate-800 border-slate-200";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start space-x-3">
          <svg
            className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-red-900 font-semibold">Error Loading Ticket</h3>
            <p className="text-red-700 mt-1">{error || "Ticket not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  const isAgentOrAdmin =
    user && (user.role === "agent" || user.role === "admin");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        to="/tickets"
        className="inline-flex items-center text-slate-600 hover:text-slate-900 font-medium transition-colors duration-300">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Tickets
      </Link>

      {/* Admin Panel */}
      {isAgentOrAdmin && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Agent Controls
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {ticket.user !== user._id && !ticket.assignedTo && (
              <TicketAssignment ticket={ticket} onTicketUpdate={setTicket} />
            )}
            {(ticket.status !== "closed" || user.role === "admin") && (
              <TicketStatusUpdater
                ticket={ticket}
                user={user}
                onTicketUpdate={setTicket}
              />
            )}
          </div>
        </div>
      )}

      {/* Ticket Header */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              {ticket.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {new Date(ticket.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(
              ticket.status
            )}`}>
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </span>
        </div>

        {/* Description */}
        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Description
          </h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Comments ({ticket.comments.length})
        </h3>

        {ticket.comments.length > 0 ? (
          <div className="space-y-4">
            {ticket.comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-800 mb-3 leading-relaxed">
                  {comment.text}
                </p>
                <div className="flex items-center text-xs text-slate-500">
                  <svg
                    className="w-4 h-4 mr-1.5"
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
                  User {comment.user}
                  <span className="mx-2">•</span>
                  {new Date(comment.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-slate-500">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      {(ticket.status === "new" || ticket.status === "assigned") &&
        ticket.assignedTo && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Add a Comment
            </h3>
            <form onSubmit={onCommentSubmit} className="space-y-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Type your comment here..."
                rows={4}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 outline-none hover:border-slate-400 resize-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                {isSubmitting ? "Submitting..." : "Submit Comment"}
              </button>
            </form>
          </div>
        )}
    </div>
  );
}

export default TicketDetailPage;
