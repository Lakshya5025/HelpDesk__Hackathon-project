import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tickets", {
          withCredentials: true,
        });
        setTickets(response.data.items);
      } catch (err) {
        console.error("Could not fetch tickets", err);
        setError("Failed to load tickets. Please make sure you are logged in.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (isLoading) {
    return <h2>Loading tickets...</h2>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="tickets-container">
      <h2>My Tickets</h2>
      <Link to="/tickets/new" className="btn">
        Create New Ticket
      </Link>
      <div className="tickets-list">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-item">
              <div>
                <h3>{ticket.title}</h3>
                <p>
                  Created on: {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="ticket-status-button">
                <span className={`status status-${ticket.status}`}>
                  {ticket.status}
                </span>
                <Link to={`/tickets/${ticket._id}`} className=" btn-sm">
                  View
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>You have not created any tickets yet.</p>
        )}
      </div>
    </div>
  );
}

export default TicketsPage;
