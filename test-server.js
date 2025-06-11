const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const server = http.createServer(app);

// Enable CORS for Express
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  credentials: true
}));

app.use(express.json());

// Socket.IO with CORS configuration
const io = socketio(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store connected users and their locations
const connectedUsers = new Map();

// Socket.IO connection handling
io.on("connection", function (socket) {
  console.log(`User connected: ${socket.id}`);
  connectedUsers.set(socket.id, { id: socket.id });

  socket.on("send-location", function (data) {
    console.log(
      `Location received from ${socket.id}: ${data.latitude}, ${data.longitude}`
    );
    
    // Update user's location in memory
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.lastLocation = data;
    }
    
    // Broadcast location to all connected clients
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("request-all-locations", function () {
    // Send all current user locations to the requesting client
    connectedUsers.forEach((user, socketId) => {
      if (user.lastLocation && socketId !== socket.id) {
        socket.emit("receive-location", {
          id: socketId,
          ...user.lastLocation,
        });
      }
    });
  });

  socket.on("disconnect", function () {
    console.log(`User disconnected: ${socket.id}`);
    connectedUsers.delete(socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

// REST API endpoints
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.get("/location/connected-users", (req, res) => {
  res.json({
    count: connectedUsers.size,
    timestamp: new Date().toISOString(),
  });
});

app.get("/location/all-users", (req, res) => {
  const users = Array.from(connectedUsers.entries()).map(([socketId, user]) => ({
    id: socketId,
    lastLocation: user.lastLocation,
  }));
  
  res.json({
    users,
    timestamp: new Date().toISOString(),
  });
});

app.get("/location/delivery-tracking/:orderId", (req, res) => {
  const orderId = parseInt(req.params.orderId);
  
  // Return mock delivery tracking data
  res.json({
    orderId,
    status: "OUT_FOR_DELIVERY",
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    currentLocation: {
      lat: 35.228950619029085 + (Math.random() - 0.5) * 0.01,
      lng: 126.8427269951037 + (Math.random() - 0.5) * 0.01,
    },
    destination: {
      lat: 35.2290,
      lng: 126.8435,
    },
    managerInfo: {
      name: 'Kim Min-jun',
      phone: '+82-10-1234-5678',
      department: 'Delivery Operations',
      role: 'Delivery Manager',
    },
    updates: [
      {
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'Order confirmed and preparing',
        location: 'Restaurant Kitchen',
      },
      {
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        status: 'Out for delivery',
        location: 'En route to destination',
      },
    ],
  });
});

// GPS data endpoint - proxy to real AWS API
app.get("/location/gps-data", async (req, res) => {
  try {
    console.log('Fetching GPS data from AWS API...');
    
    // Make direct call to AWS API (no CORS issues on server-side)
    const awsApiUrl = 'https://sfqqyjx9f3.execute-api.ap-northeast-2.amazonaws.com/get-gps';
    
    const response = await fetch(awsApiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    console.log('GPS data received from AWS API:', data);
    
    // Return in the format expected by the frontend
    res.json({
      latitude: data.lat,
      longitude: data.lon,
      timestamp: data.timestamp
    });
  } catch (error) {
    console.error('Error fetching GPS data from AWS API:', error);
    // Fallback to a fixed location instead of random
    res.json({
      latitude: 35.228950619029085,
      longitude: 126.8427269951037,
      timestamp: Date.now()
    });
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Real-time tracking server is running on port ${PORT}`);
  console.log(`Socket.IO server available for real-time location tracking`);
  console.log(`REST API available at http://localhost:${PORT}`);
});
