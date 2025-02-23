import express from "express";
import cors from "cors";
import { config } from "dotenv";
import bodyParser from "body-parser";
import Handler from "./auth/auth.js";
import { WebSocketServer } from "ws";
import axios from "axios";
import db from "./db/db.js";

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
     //onst parsedData = JSON.parse(data); // Parse the incoming data
     const jsonString = data.toString();
     const jsonData = JSON.parse(jsonString);
     const token = await db.myfunction(jsonData.email);
      
      console.log("Received from client:", jsonData.user_input )
      // Make the API request with the extracted text
      const response = await axios.post(
        'http://127.0.0.1:5000/deploy',
        { user_input: jsonData.user_input , token : token },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const d = response.data ;
      console.log("Response from API:", d );
      const mango = d.api_response ;
      console.log(d.api_response);
      // Send the response back to the client
      ws.send(JSON.stringify({ 'array' : mango.response  , 'url' : response.data.url }));
  
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