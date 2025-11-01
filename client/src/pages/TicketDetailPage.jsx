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
    <div className="ticket-detail-container">
      <Link to="/tickets" className="btn btn-back">
        Back to Tickets
      </Link>
      {isAgentOrAdmin && (
        <div className="admin-panel">
          {}
          {ticket.user != user._id && !ticket.assignedTo && (
            <TicketAssignment ticket={ticket} onTicketUpdate={setTicket} />
          )}
          {ticket.status !== "closed" && (
            <TicketStatusUpdater
              ticket={ticket}
              user={user._id}
              onTicketUpdate={setTicket}
            />
          )}
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
      {ticket.status == "new" && ticket.assignedTo ? (
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
      ) : null}
    </div>
  );
}

export default TicketDetailPage;
