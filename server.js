const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Enable CORS for your frontend
app.use(cors({ origin: "https://onlinebustracking.netlify.app" }));

app.use(bodyParser.json());

// Mock data
const buses = [
  { id: 1, serviceNumber: "S101", vehicleNumber: "KA01AB1234", from: "Hindupur", to: "Bangalore", speed: "40 km/h", location: { lat: 12.9716, lng: 77.5946 }, currentcity: "Hindupur" },
  { id: 2, serviceNumber: "S102", vehicleNumber: "KA02CD5678", from: "Bangalore", to: "Hindupur", speed: "35 km/h", location: { lat: 13.0827, lng: 80.2707 }, currentcity: "Bangalore" },
  { id: 3, serviceNumber: "8304", vehicleNumber: "AP35AE0703", from: "Bhimavaram", to: "Vizianagaram", speed: "50 km/h", location: { lat: 18.0873, lng: 81.165 }, currentcity: "NAD X Junction" },
  { id: 4, serviceNumber: "8305", vehicleNumber: "AP35BD7777", from: "Vizianagaram", to: "Bhimavaram", speed: "62 km/h", location: { lat: 15.8826, lng: 84.456 }, currentcity: "Anakapalli"},
  { id: 5, serviceNumber: "GN01", vehicleNumber: "AP29Z2508", from: "Bhimavaram", to: "Tadepalligudem", speed: "43 km/h", location: { lat: 16.7109, lng: 81.5418 }, currentcity: "Tadepalligudem" },
  { id: 6, serviceNumber: "TG01", vehicleNumber: "AP37Z0085", from: "Bhimavaram", to: "Tadepalligudem", speed: "57 km/h", location: { lat: 11.8825, lng: 78.4568 }, currentcity: "Bhimavaram" },
  { id: 7, serviceNumber: "B001", vehicleNumber: "AP02Z0263", from: "Bhimavaram", to: "Tadepalligudem", speed: "51 km/h", location: { lat: 14.8955, lng: 77.6753 }, currentcity: "Pippara" },
  { id: 8, serviceNumber: "4870", vehicleNumber: "AP39Z0531", from: "Bhimavaram", to: "Vizianagaram", speed: "68 km/h", location: { lat: 17.2806, lng: 82.4035 }, currentcity: "Annavaram" },
  { id: 9, serviceNumber: "8308", vehicleNumber: "AP35Z0134", from: "Bhimavaram", to: "Vizianagaram", speed: "57 km/h", location: { lat: 17.7237, lng: 83.3068 }, currentcity: "Visakhapatnam" },
  { id: 10, serviceNumber: "8303", vehicleNumber: "AP35Z0189", from: "Vizianagaram", to: "Bhimavaram", speed: "48 km/h", location: { lat: 18.1081, lng: 83.3995 }, currentcity: "Vizianagaram" },
  { id: 11, serviceNumber: "4871", vehicleNumber: "AP40Z0632", from: "Vizianagaram", to: "Bhimavaram", speed: "35 km/h", location: { lat: 17.1167, lng: 82.667 }, currentcity: "Pithapuram" },
  { id: 12, serviceNumber: "B001", vehicleNumber: "AP02Z0263", from: "Tadepalligudem", to: "Bhimavaram", speed: "33 km/h", location: { lat: 16.6433, lng: 81.5336 }, currentcity: "Yandagandi" },
  { id: 13, serviceNumber: "G803", vehicleNumber: "AP39Z0987", from: "Tadepalligudem", to: "Bhimavaram", speed: "39 km/h", location: { lat: 16.5870, lng: 81.5329 }, currentcity: "Gollalakoderu" },
  { id: 14, serviceNumber: "V037", vehicleNumber: "AP35B9087", from: "Bhimavaram", to: "Vijayawada", speed: "59 km/h", location: { lat: 16.5062, lng: 80.6480 }, currentcity: "Vijayawada" },
  { id: 15, serviceNumber: "2549", vehicleNumber: "AP31X5246", from: "Vijayawada", to: "Bhimavaram", speed: "61 km/h", location: { lat: 16.5449, lng: 81.5212 }, currentcity: "Bhimavaram" },





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
const io = new Server(server, {
  cors: {
    origin: "https://onlinebustracking.netlify.app", // Allow frontend to connect
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");
  setInterval(() => {
    const location = { lat: Math.random() * 100, lng: Math.random() * 100 }; // Mock data
    socket.emit("busLocationUpdate", { location });
  }, 5000); // Emit every 5 seconds
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on https://bus-backend-s71f.onrender.com`);
});