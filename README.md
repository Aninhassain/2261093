Afford Medical Full Stack Test

This is a full stack URL shortener project made for the Afford Medical coding test. It has a frontend using React and a backend using Express.

Folder Structure:

Frontend Test Submission/

Backend Test Submission/

Logging Middleware/

How to Run:

Backend:

Go to the backend folder:
cd "Backend Test Submission"

Install dependencies:
npm install

Start the server:
node server.js

Server will run on: http://localhost:5000

Frontend:

Go to the frontend folder:
cd "Frontend Test Submission"

Install dependencies:
npm install

Start the React app:
npm start

App will run on: http://localhost:3000

Features:

Create short URLs with or without custom code

Expiry time (default is 30 minutes)

Redirection to long URL

Track number of clicks and time of each click

View stats by shortcode

No authentication

No console.log used (only custom logger)

Logging:
All logs are handled using a custom middleware inside:
Logging Middleware/log.js

