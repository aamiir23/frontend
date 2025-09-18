RAG-Powered Chatbot for News Websites (Frontend)
This project contains the frontend application for the RAG chatbot. It's a single-page application built with React, Vite, and SCSS, providing a user-friendly interface to interact with the backend API.

1. Tech Stack and Dependencies
React: The UI library. It manages the user interface, state (e.g., chat messages, input values), and component-based rendering.

Vite: The build tool. It provides a fast development server and build tool that handles bundling, hot-reloading, and optimizing the React application for production.

SCSS: The CSS pre-processor. It simplifies and structures the styling code with features like variables and nested rules, making the CSS easier to maintain.

uuid: The unique ID generator. It creates unique session IDs for each new user, which are then used to track individual conversations with the backend.

2. How the Project Works
The frontend handles all user interactions and communicates with the backend via API calls.

Session Initialization: When a user first loads the application, the ChatInterface component checks for a sessionId in localStorage. If one doesn't exist, it generates a new one using the uuid library and stores it for future use.

Rendering Chat History: On component mount, an API call is made to GET /api/chat/:sessionId to fetch any previous conversation history and display it.

User Interaction: When a user types a message and clicks "Send," the message is immediately added to the local state. An asynchronous API call is then made to POST /api/chat, sending the query and session ID to the backend.

Displaying Response: Once the backend returns a response, the messages state is updated with the chatbot's reply, and the UI automatically re-renders to show the complete conversation.

The application ensures a smooth user experience by handling API loading states, preventing duplicate submissions, and managing sessions transparently.

3. Setup and Installation Guide
Prerequisites: You must have the backend server running and accessible.

Clone the repository:

Bash

git clone <your-frontend-repo-url>
cd <project-folder>/frontend
Install dependencies:

Bash

npm install
Run the development server:

Bash

npm run dev
The application will be served at http://localhost:5173. You can open this URL in your browser to interact with the chatbot.
