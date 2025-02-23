const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow front-end to connect
  },
});

app.use(bodyParser.json());
app.use(cors());

// Mock data
const buses = [
  { id: 1, serviceNumber: "S101", vehicleNumber: "KA01AB1234", from: "Location A", to: "Location B", speed: "40 km/h", location: { lat: 12.9716, lng: 77.5946 } },
  { id: 2, serviceNumber: "S102", vehicleNumber: "KA02CD5678", from: "Location C", to: "Location D", speed: "35 km/h", location: { lat: 13.0827, lng: 80.2707 } },
  { id: 3, serviceNumber: "8304", vehicleNumber: "AP35AE0703", from: "Bhimavaram", to: "Vizianagaram", speed: "50 km/h", location: { lat: 18.087, lng: 81.165 } },
];

// API to search buses by route
app.post("/searchBuses", (req, res) => {
  const { from, to } = req.body;
  const availableBuses = buses.filter((bus) => bus.from === from && bus.to === to);
  res.json(availableBuses);
});

// API to track bus by service number
app.post("/trackBus", (req, res) => {
  const { serviceNumber } = req.body;
  const bus = buses.find((bus) => bus.serviceNumber === serviceNumber);
  if (bus) {
    res.json({ location: bus.location, speed: bus.speed });
  } else {
    res.status(404).json({ error: "Bus not found" });
  }
});
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is running!" });
  });

// API to search bus by vehicle number
app.post("/searchByVehicle", (req, res) => {
  const { vehicleNumber } = req.body;
  const bus = buses.find((bus) => bus.vehicleNumber === vehicleNumber);
  if (bus) {
    res.json({ location: bus.location });
  } else {
    res.status(404).json({ error: "Bus not found" });
  }
});

// API to search bus by service number
app.post("/searchByService", (req, res) => {
  const { serviceNumber } = req.body;
  const bus = buses.find((bus) => bus.serviceNumber === serviceNumber);
  if (bus) {
    res.json({ location: bus.location, speed: bus.speed });
  } else {
    res.status(404).json({ error: "Bus not found" });
  }
});

// API to submit feedback
app.post("/submitFeedback", (req, res) => {
  const { feedback } = req.body;
  console.log(`Feedback received: ${feedback}`);
  res.json({ message: "Feedback submitted successfully" });
});

// WebSocket for real-time updates
io.on("connection", (socket) => {
  console.log("Client connected");
  setInterval(() => {
    const location = { lat: Math.random() * 100, lng: Math.random() * 100 }; // Mock data
    socket.emit("busLocationUpdate", { location });
  }, 5000); // Emit every 5 seconds
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});