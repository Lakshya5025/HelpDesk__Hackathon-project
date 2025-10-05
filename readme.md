# **HelpDesk Ticketing System**

HelpDesk is a full-stack web application designed to streamline and manage customer support tickets. It provides a user-friendly interface for clients to submit and track their support requests, while offering robust tools for agents and administrators to manage, assign, and resolve tickets efficiently.

---

## **Features**

### **Frontend**

- **User Authentication**: Secure user registration and login functionality.
- **Ticket Management**: Users can create, view, and comment on their support tickets.
- **Role-Based Views**: The interface adapts based on user roles (user, agent, admin), showing relevant information and actions.
- **Ticket Assignment**: Agents and admins can assign tickets to themselves or other agents.
- **Status Updates**: Agents and admins can update the status of tickets (e.g., open, closed).
- **Protected Routes**: Ensures that only authenticated users can access the main application features.
- **Responsive Design**: A clean and responsive layout for a seamless experience across devices.

### **Backend**

- **Secure Authentication**: Uses JSON Web Tokens (JWT) stored in cookies for secure, session-based authentication.
- **Role-Based Access Control**: Pre-defined roles (user, agent, admin) to manage permissions.
- **Full CRUD for Tickets**: Endpoints to create, read, update, and delete tickets and comments.
- **Pagination**: Supports ?limit= and ?offset= on list endpoints for efficient data handling.
- **Rate Limiting**: Protects the API from abuse by limiting users to 60 requests per minute.
- **Idempotency**: POST endpoints accept an Idempotency-Key header to prevent accidental duplicate creations.
- **Optimistic Locking**: Protects against simultaneous edits on the same ticket using a version key.
- **Uniform Error Formatting**: All API errors are returned in a consistent, easy-to-parse JSON format.

---

## **Technologies Used**

### **Frontend**

- **React**: For building the user interface.
- **React Router**: For client-side routing and navigation.
- **Axios**: For making HTTP requests to the backend API.
- **Vite**: As the frontend build tool and development server.
- **ESLint**: For code linting and maintaining code quality.

### **Backend**

- **Node.js**: As the JavaScript runtime environment.
- **Express**: As the web framework for building the API.
- **MongoDB**: As the NoSQL database for storing application data.
- **Mongoose**: As the ODM for interacting with MongoDB.
- **JWT**: For user authentication.
- **bcrypt**: For hashing passwords.

---

## **API Summary**

### **Authentication**

- POST /api/auth/register: Register a new user.
- POST /api/auth/login: Log in a user and receive an httpOnly cookie containing the JWT.

### **Tickets**

- POST /api/tickets: Create a new ticket (requires authentication).
- GET /api/tickets: Get a paginated list of tickets for the logged-in user (requires authentication).
- GET /api/tickets/:id: Get a single ticket by its ID (requires authentication).
- PATCH /api/tickets/:id: Update a ticket's status or assignment (requires authentication).
- POST /api/tickets/:id/comments: Add a comment to a ticket (requires authentication).

---

## **Getting Started**

### **Prerequisites**

- Node.js and npm (or yarn) installed on your machine.
- A running instance of the HelpDesk backend server.
- MongoDB connection URI.

### **Installation & Setup**

1. **Clone the repository:**  
   Bash  
   git clone https://github.com/lakshya5025/helpdesk\_\_hackathon-project.git

2. **Backend Setup:**

   - Navigate to the server directory: cd helpdesk\_\_hackathon-project/server
   - Install dependencies: npm install
   - Create a .env file and add the following environment variables:  
     MONGO_URL=\<your_mongodb_connection_uri\>  
     JWT_SECRET=\<your_jwt_secret\>  
     SALT=\<your_salt_rounds\>

   - Run the development server: npm run dev
   - The backend will be available at http://localhost:8080

3. **Frontend Setup:**
   - Navigate to the client directory: cd helpdesk\_\_hackathon-project/client
   - Install dependencies: npm install
   - Configure the API endpoint: Ensure the API_URL in the components and pages points to your running backend server (e.g., http://localhost:8080/api).
   - Run the development server: npm run dev
   - The application will be available at http://localhost:5173.
