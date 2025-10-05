import React, { useEffect, useState, useContext } from "react"; // Import useContext
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import TicketAssignment from "../components/TicketAssignment"; // Import new component
import TicketStatusUpdater from "../components/TicketStatusUpdater"; // <-- Import the new component

function TicketDetailPage() {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const { user } = useContext(AuthContext); // Get the logged-in user
  const { id } = useParams();
  const fetchTicket = async () => {
    try {
      setIsLoading(true); // Set loading before fetch
      const response = await axios.get(
        `http://localhost:8080/api/tickets/${id}`,
        { withCredentials: true }
      );
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
    try {
      await axios.post(
        `http://localhost:8080/api/tickets/${id}/comments`,
        { text: commentText },
        { withCredentials: true }
      );
      setCommentText("");
      fetchTicket(); // Refetch ticket to show the new comment
    } catch (error) {
      console.error("Failed to add comment", error);
      alert("Error adding comment.");
    }
  };

  if (isLoading) {
    return <h2>Loading...</h2>;
  }
  if (!ticket) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }
  const isAgentOrAdmin =
    user && (user.role === "agent" || user.role === "admin");

  return (
    // ... The rest of the JSX is the same
    <div className="ticket-detail-container">
      <Link to="/tickets" className="btn btn-back">
        Back to Tickets
      </Link>
      {isAgentOrAdmin && (
        <div className="admin-panel">
          <TicketAssignment ticket={ticket} onTicketUpdate={setTicket} />
          <TicketStatusUpdater ticket={ticket} onTicketUpdate={setTicket} />
        </div>
      )}

      <div className="ticket-header">
        <h2>{ticket.title}</h2>
        <span className={`status status-${ticket.status}`}>
          {ticket.status}
        </span>
      </div>
      <p className="ticket-info">
        Created on: {new Date(ticket.createdAt).toLocaleString("en-US")}
      </p>
      <div className="ticket-description">
        <h3>Description</h3>
        <p>{ticket.description}</p>
      </div>
      <div className="ticket-comments">
        <h3>Comments</h3>
        {ticket.comments.length > 0 ? (
          ticket.comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p>{comment.text}</p>
              <small>
                By user {comment.user} on{" "}
                {new Date(comment.createdAt).toLocaleString("en-US")}
              </small>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
      <div className="comment-form">
        <h3>Add a Comment</h3>
        <form onSubmit={onCommentSubmit}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Type your comment here..."
            rows={4}
            required></textarea>
          <button type="submit" className="btn">
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  );
}

export default TicketDetailPage;
