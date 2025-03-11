require("dotenv").config();
const express = require("express");
const cors = require("cors");

// const { router: hotelRoutes } = require("./core/controllers/hotelController");
const hotelRoutes = require("./core/controllers/hotelController");
const bookingRoutes = require("./core/controllers/bookingController");

// Integrating Plugin
const cancellationPlugin = require("./plugins/cancellation-policy/index");
const emailPlugin = require("./plugins/email-notifications/index");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Core routes
app.use("/hotels", hotelRoutes);
app.use("/bookings", bookingRoutes);

// Load Plugins
// app.use(cancellationPlugin);
// app.use(emailPlugin);

// Default Route
app.get("/", (req, res) => {
    res.send("Hotel Management System API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
