const express = require("express");
const router = express.Router();
const cancellationPolicy = require("../../plugins/cancellation-policy");
const emailNotifications = require("../../plugins/email-notifications");
const { hotels } = require("./hotelController");

// Dummy booking data
let bookings = [
    { id: 1, hotelId: 1, customer: "Alice", checkIn: "2025-03-10", checkOut: "2025-03-15", email: "alice@example.com" },
    { id: 2, hotelId: 2, customer: "Bob", checkIn: "2025-04-05", checkOut: "2025-04-10", email: "bob@example.com" }
];

// Get all Bookings
router.get("/", (req, res) => {
    const enrichedBookings = bookings.map(booking => {
        const hotel = hotels.find(h => h.id === booking.hotelId);
        return {
            ...booking,
            hotelName: hotel ? hotel.name : "Hotel Name Not Available"
        };
    });

    res.json(enrichedBookings);
    // res.json(bookings);
});

// Get a single booking by ID
router.get("/:id", (req, res) => {
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
});

// Create a new booking
router.post("/", (req, res) => {
    const { hotelId, customer, checkIn, checkOut, email } = req.body;
    if (!hotelId || !customer || !checkIn || !checkOut || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const hotel = hotels.find(h => h.id === parseInt(hotelId)); // Find hotel
    if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
    }

    const newBooking = {
        id: bookings.length + 1,
        hotelId: parseInt(hotelId),
        hotelName: hotel.name,
        customer,
        checkIn,
        checkOut,
        email
    };

    bookings.push(newBooking);
    res.status(201).json(newBooking);
});

// Update booking details
router.put("/:id", (req, res) => {
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.hotelId = req.body.hotelId || booking.hotelId;
    booking.customer = req.body.customer || booking.customer;
    booking.checkIn = req.body.checkIn || booking.checkIn;
    booking.checkOut = req.body.checkOut || booking.checkOut;
    booking.email = req.body.email || booking.email;

    res.json({ message: "Booking updated", booking });
});

// Delete a booking
router.delete("/:id", (req, res) => {
    bookings = bookings.filter(b => b.id !== parseInt(req.params.id));
    res.json({ message: "Booking deleted" });
});

// Cancel booking (Plugin)
router.delete("/:id/cancel", async (req, res) => {
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const hotel = hotels.find(h => h.id === booking.hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // Check cancellation policy
    const cancellationResult = cancellationPolicy.checkCancellation(booking, hotel);
    
    if (!cancellationResult.allowed) {
        return res.status(400).json({ message: cancellationResult.message });
    }

    // Remove booking
    bookings = bookings.filter(b => b.id !== parseInt(req.params.id));

    // Send cancellation email
    // await emailNotifications.sendEmail(
    //     booking.email,
    //     "Booking Cancelled",
    //     `Your booking at ${hotel.name} has been cancelled.`
    // );
    console.log(`Email to ${booking.email}: Your booking at ${hotel.name} has been cancelled.`);


    res.json({ message: "Booking cancelled successfully" });
});

module.exports = router;
