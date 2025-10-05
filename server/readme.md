## **Backend Features**

- ✅ **Secure Authentication**: Uses JSON Web Tokens (JWT) stored in httpOnly cookies for secure, session-based authentication.
- ✅ **Role-Based Access Control**: Pre-defined roles (user, agent, admin) to manage permissions.
- ✅ **Full CRUD for Tickets**: Endpoints to create, read, update, and delete tickets and comments.
- ✅ **Pagination**: Supports ?limit= and ?offset= on list endpoints for efficient data handling.
- ✅ **Rate Limiting**: Protects the API from abuse by limiting users to 60 requests per minute.
- ✅ **Idempotency**: POST endpoints accept an Idempotency-Key header to prevent accidental duplicate creations.
- ✅ **Optimistic Locking**: Protects against simultaneous edits on the same ticket using a version key.
- ✅ **Uniform Error Formatting**: All API errors are returned in a consistent, easy-to-parse JSON format.
- ✅ **Password Hashing**: User passwords are securely hashed using bcrypt before being stored in the database.
- ✅ **CORS Enabled**: Cross-Origin Resource Sharing (CORS) is enabled to allow requests from the frontend.

---

## **API Summary**

### **Authentication**

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Log in a user and receive an httpOnly cookie containing the JWT.
- **POST /api/auth/logout**: Log out the current user by clearing the authentication cookie.
- **GET /api/auth/me**: Get the profile of the currently logged-in user.

### **Tickets**

- **POST /api/tickets**: Create a new ticket (requires authentication).
- **GET /api/tickets**: Get a paginated list of tickets for the logged-in user (requires authentication).
- **GET /api/tickets/:id**: Get a single ticket by its ID (requires authentication).
- **PATCH /api/tickets/:id**: Update a ticket's status or assignment (requires authentication).
- **POST /api/tickets/:id/comments**: Add a comment to a ticket (requires authentication).

### **Users**

- **GET /api/users/agents**: Get a list of all users with the 'agent' or 'admin' role (requires authentication).

---

## **Example API Usage**

### **1\. Register Users**

You can register users with different roles. The password will be automatically hashed.

**Request**: POST /api/auth/register

**Body**:

JSON

{  
 "name": "Test Agent",  
 "email": "agent@example.com",  
 "password": "password123",  
 "role": "agent"  
}

**Response**: 201 Created

JSON

{  
 "\_id": "68e221cd2b0e5568072febb5",  
 "name": "Test Agent",  
 "email": "agent@example.com",  
 "role": "agent"  
}

### **2\. Log In a User**

**Request**: POST /api/auth/login

**Body**:

JSON

{  
 "email": "user@example.com",  
 "password": "password123"  
}

Response: 200 OK  
(An httpOnly cookie named token is set in the browser.)

JSON

{  
 "\_id": "68e221912b0e5568072febb2",  
 "name": "Test User",  
 "email": "user@example.com",  
 "role": "user"  
}

### **3\. Create a Ticket**

Request: POST /api/tickets  
(The user must be logged in.)  
**Body**:

JSON

{  
 "title": "My brain is on fire",  
 "description": "During bug fixing, smoke started coming out of my brain."  
}

**Response**: 201 Created

JSON

{  
 "user": "68e221912b0e5568072febb2",  
 "title": "My brain is on fire",  
 "description": "During bug fixing, smoke started coming out of my brain.",  
 "status": "new",  
 "assignedTo": null,  
 "\_id": "68e224dbee54ac812110bb5a",  
 "comments": \[\],  
 "createdAt": "2025-10-05T07:57:15.353Z",  
 "updatedAt": "2025-10-05T07:57:15.353Z",  
 "version": 0  
}

### **4\. Add a Comment to a Ticket**

Now, let's have the **Test Agent** add a comment to the ticket.

Request: POST /api/tickets/68e224dbee54ac812110bb5a/comments  
(Assuming the agent is now logged in.)  
**Body**:

JSON

{  
 "text": "Have you tried turning it off and on again?"  
}

**Response**: 201 Created

JSON

\[  
 {  
 "text": "Have you tried turning it off and on again?",  
 "user": "68e221cd2b0e5568072febb5",  
 "\_id": "68e23abc1234567890abcdef",  
 "createdAt": "2025-10-05T08:15:00.123Z",  
 "updatedAt": "2025-10-05T08:15:00.123Z"  
 }  
\]

### **5\. Get a Single Ticket (Now with Comments)**

Fetching the ticket again shows the comment from the agent.

**Request**: GET /api/tickets/68e224dbee54ac812110bb5a

**Response**: 200 OK

JSON

{  
 "\_id": "68e224dbee54ac812110bb5a",  
 "user": "68e221912b0e5568072febb2",  
 "title": "My brain is on fire",  
 "description": "During bug fixing, smoke started coming out of my brain.",  
 "status": "new",  
 "assignedTo": null,  
 "createdAt": "2025-10-05T07:57:15.353Z",  
 "updatedAt": "2025-10-05T08:15:00.123Z",  
 "version": 1,  
 "comments": \[  
 {  
 "text": "Have you tried turning it off and on again?",  
 "user": "68e221cd2b0e5568072febb5",  
 "\_id": "68e23abc1234567890abcdef",  
 "createdAt": "2025-10-05T08:15:00.123Z"  
 }  
 \]  
}

---

## **Test User Credentials**

Use the POST /api/auth/register endpoint with the following bodies to create test accounts.

- **User (default)**:  
  JSON  
  { "name": "Test User", "email": "user@example.com", "password": "password123" }

- **Agent**:  
  JSON  
  { "name": "Test Agent", "email": "agent@example.com", "password": "password123", "role": "agent" }

- **Admin**:  
  JSON  
  { "name": "Test Admin", "email": "admin@example.com", "password": "password123", "role": "admin" }
