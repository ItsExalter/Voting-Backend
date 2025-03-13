# Backend - Voting App

## Description
Backend for the voting application with admin and user roles, event management, and voting functionality.

## Prerequisites
- Node.js
- npm (Node Package Manager)
- MongoDB

## Installation

1. Navigate to the backend directory:
    ```sh
    cd Voting-Backend
    ```
2. Install the dependencies:
    ```sh
    npm install
    ```

## Running the Backend

1. Start the backend server:
    ```sh
    npm start
    ```
   The backend server should now be running on `http://localhost:3001` (or the port specified in your configuration).

## Environment Variables
Create a `.env` file in the backend directory and add the necessary environment variables. For example:
```plaintext
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3001
```

~~## Initializing the Admin User~~
~~To initialize the admin user in MongoDB, use the following query in MongoDB Shell (in MongoDB Compass):~~
``` sh
use voting-app

db.users.insertOne({
  username: "admin",
  password: "$2a$12$zIrbfFDXlJsLadPIyc4GS.PaWPK.pqZE6ckgg3XBuI2nuFfIIrM5O", // bcrypt hash of "testing123"
  role: "admin"
})
```

## Initializing the MongoDB Connection String:
for string connection, you can put MONGO_URI like this in .env
```
MONGO_URI=mongodb+srv://new-user:x5SRnNkGDIgtZKMD@cluster0.ndgj6.mongodb.net/voting-db
```

## API Documentation

### Authentication
- POST /api/auth/login: Login with username and password.

### Events
- GET /api/events: List all events (Admin only).
- POST /api/events: Create a new event (Admin only).
- GET /api/events/active: Get active events (Public).
- PATCH /api/events/:id/status: Update event status (Admin only).

### Users
- GET /api/users: List all users (Admin only).
- PATCH /api/users/:id/username: Update username (Admin only).
- PATCH /api/users/:id/role: Update user role (Admin only).
- DELETE /api/users/:id: Delete user (Admin only).

### Voting
- POST /api/votes: Submit a vote (User only).
- GET /api/votes/results/:eventId: Get voting results.
