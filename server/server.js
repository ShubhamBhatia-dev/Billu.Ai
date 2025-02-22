import express from "express";
import cors from "cors";
import { config } from "dotenv";
import bodyParser from "body-parser";
import Handler from "./auth/auth.js";
import { WebSocketServer } from "ws";
import axios from "axios";

const app = express();
config();
app.use(bodyParser.json());
app.use(cors());

// CONNECTION TO DATABASE (Add your database connection logic here)

// Get The Token and Store It in Database :-)
app.get("/oauth", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user`
  );
});

app.get("/oauth/callback", (req, res) => {
  Handler(req, res);
});

const server = app.listen(4000, () => {
  console.log("Listening on port 4000");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("USER CONNECTED");

  ws.on("message", async (data) => {
    try {
      const parsedData = JSON.parse(data); // Parse the incoming data
      const userInput = parsedData.text;   // Extract the text field
      
      console.log("Received from client:", userInput);
  
      // Make the API request with the extracted text
      const response = await axios.post(
        'https://api-lr.agent.ai/v1/agent/orb5mahda994u4uz/webhook/0bc4b69d',
        { user_input: userInput },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      console.log("Response from API:", response.data);
  
      // Send the response back to the client
      ws.send(JSON.stringify(response.data));
  
    } catch (error) {
      console.error("Error handling message:", error);
      ws.send(JSON.stringify({ error: "Failed to process the request." }));
    }
  });
  
  ws.on("close", () => {
    console.log("USER DISCONNECTED");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocketServer.OPEN) {
      client.send(message);
    }
  });
}