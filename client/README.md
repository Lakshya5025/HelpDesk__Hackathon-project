# **Frontend**

---

## **Features**

- **User Authentication**: Secure user registration and login functionality.
- **Ticket Management**: Users can create, view, and comment on their support tickets.
- **Role-Based Views**: The interface adapts based on user roles (user, agent, admin), showing relevant information and actions.
- **Ticket Assignment**: Agents and admins can assign tickets to themselves or other agents.
- **Status Updates**: Agents and admins can update the status of tickets (e.g., open, closed).
- **Protected Routes**: Ensures that only authenticated users can access the main application features.
- **Responsive Design**: A clean and responsive layout for a seamless experience across devices.

---

## **Getting Started**

### **Prerequisites**

- Node.js and npm (or yarn) installed on your machine.
- A running instance of the HelpDesk backend server.

### **Installation & Setup**

1. **Clone the repository:**  
   Bash  
   git clone https://github.com/lakshya5025/helpdesk\_\_hackathon-project.git  
   cd helpdesk\_\_hackathon-project/client

2. **Install dependencies:**  
   Bash  
   npm install

3. Configure the API endpoint:  
   Ensure the API_URL in the components and pages points to your running backend server (e.g., http://localhost:8080/api).
4. **Run the development server:**  
   Bash  
   npm run dev

   The application will be available at http://localhost:5173.

---

## **Folder Structure**

/src  
|-- /assets  
|-- /components  
| |-- Header.jsx  
| |-- ProtectedRoute.jsx  
| |-- TicketAssignment.jsx  
| \`-- TicketStatusUpdater.jsx  
|-- /context  
| \`-- AuthContext.jsx  
|-- /pages  
| |-- LoginPage.jsx  
| |-- NewTicketPage.jsx  
| |-- RegisterPage.jsx  
| |-- TicketDetailPage.jsx  
| \`-- TicketsPage.jsx  
|-- App.css  
|-- App.jsx  
|-- index.css  
\`-- main.jsx

---

## **Technologies Used**

- **React**: For building the user interface.
- **React Router**: For client-side routing and navigation.
- **Axios**: For making HTTP requests to the backend API.
- **Vite**: As the frontend build tool and development server.
- **ESLint**: For code linting and maintaining code quality.
