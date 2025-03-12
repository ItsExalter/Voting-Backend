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
