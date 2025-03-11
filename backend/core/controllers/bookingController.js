const express = require("express");
const router = express.Router();
const pool = require("../../db");
const cancellationPolicy = require("../../plugins/cancellation-policy");
const emailNotifications = require("../../plugins/email-notifications");
const { hotels } = require("./hotelController");

// Get all Bookings
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT bookings.*, hotels.name AS hotelName 
            FROM bookings 
            JOIN hotels ON bookings.hotel_id = hotels.id
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
});

// Get a single booking by ID
router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT bookings.*, hotels.name AS hotelName 
            FROM bookings 
            JOIN hotels ON bookings.hotel_id = hotels.id
            WHERE bookings.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) return res.status(404).json({ message: "Booking not found" });

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching booking", error });
    }
})

// Create a new booking
router.post("/", async (req, res) => {
    const { hotel_id, customer, checkIn, checkOut, email } = req.body;

    //console.log(req.body);

    if (!hotel_id || !customer || !checkIn || !checkOut || !email) {
        res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Insert new booking
        const result = await pool.query(
            "INSERT INTO bookings (hotel_id, customer, checkin, checkout, email) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [hotel_id, customer, checkIn, checkOut, email]
        );

        // Fetch hotel name separately
        const hotelResult = await pool.query("SELECT name FROM hotels WHERE id = $1", [hotel_id]);
        const hotelName = hotelResult.rows.length > 0 ? hotelResult.rows[0].name : "Hotel Name Not Available";

        // Include hotelName in response
        res.status(201).json({ ...result.rows[0], hotelName });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update booking details
router.put("/:id", async (req, res) => {
    const { hotel_id, customer, checkIn, checkOut, email } = req.body;

    try {
        // Fetch existing booking
        const bookingResult = await pool.query("SELECT * FROM bookings WHERE id = $1", [req.params.id]);
        if (bookingResult.rows.length === 0) return res.status(404).json({ message: "Booking not found" });

        // Update fields (if provided)
        const updatedBooking = await pool.query(
            "UPDATE bookings SET hotel_id = COALESCE($1, hotel_id), customer = COALESCE($2, customer), check_in = COALESCE($3, check_in), check_out = COALESCE($4, check_out), email = COALESCE($5, email) WHERE id = $6 RETURNING *",
            [hotel_id, customer, checkIn, checkOut, email, req.params.id]
        );

        // Fetch updated hotel name
        const hotelResult = await pool.query("SELECT name FROM hotels WHERE id = $1", [updatedBooking.rows[0].hotel_id]);
        const hotelName = hotelResult.rows.length > 0 ? hotelResult.rows[0].name : "Hotel Name Not Available";

        res.json({ message: "Booking updated", booking: { ...updatedBooking.rows[0], hotelName } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a booking
router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM bookings WHERE id = $1 RETURNING *", [req.params.id]);

        if (result.rows.length === 0) return res.status(404).json({ message: "Booking not found" });

        res.json({ message: "Booking deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel booking (Plugin)
router.delete("/:id/cancel", async (req, res) => {
    try {
        // Fetch booking details
        const bookingResult = await pool.query("SELECT * FROM bookings WHERE id = $1", [req.params.id]);
        if (bookingResult.rows.length === 0) return res.status(404).json({ message: "Booking not found" });

        const booking = bookingResult.rows[0];

        // Fetch hotel details
        const hotelResult = await pool.query("SELECT * FROM hotels WHERE id = $1", [booking.hotel_id]);
        if (hotelResult.rows.length === 0) return res.status(404).json({ message: "Hotel not found" });

        const hotel = hotelResult.rows[0];

        // Check cancellation policy
        //const cancellationResult = cancellationPolicy.checkCancellation(booking, hotel);
        const cancellationResult = await cancellationPolicy.checkCancellation(booking);
        if (!cancellationResult.allowed) {
            return res.status(400).json({ message: cancellationResult.message });
        }

        // Remove booking from database
        await pool.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);

        // Send cancellation email (for now just log it)
        console.log(`Email to ${booking.email}: Your booking at ${hotel.name} has been cancelled.`);

        res.json({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

// CODE FOR LOCAL DB
// -----------------
// Dummy booking data
// let bookings = [
//     { id: 1, hotelId: 1, customer: "Alice", checkIn: "2025-03-10", checkOut: "2025-03-15", email: "alice@example.com" },
//     { id: 2, hotelId: 2, customer: "Bob", checkIn: "2025-04-05", checkOut: "2025-04-10", email: "bob@example.com" }
// ];

// Get all Bookings
// router.get("/", (req, res) => {
//     const enrichedBookings = bookings.map(booking => {
//         const hotel = hotels.find(h => h.id === booking.hotelId);
//         return {
//             ...booking,
//             hotelName: hotel ? hotel.name : "Hotel Name Not Available"
//         };
//     });

//     res.json(enrichedBookings);
//     // res.json(bookings);
// });


// Get a single booking by ID
// router.get("/:id", (req, res) => {
//     const booking = bookings.find(b => b.id === parseInt(req.params.id));
//     if (!booking) return res.status(404).json({ message: "Booking not found" });
//     res.json(booking);
// });


// Create a new booking
// router.post("/", (req, res) => {
//     const { hotelId, customer, checkIn, checkOut, email } = req.body;
//     if (!hotelId || !customer || !checkIn || !checkOut || !email) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     const hotel = hotels.find(h => h.id === parseInt(hotelId)); // Find hotel
//     if (!hotel) {
//         return res.status(404).json({ message: "Hotel not found" });
//     }

//     const newBooking = {
//         id: bookings.length + 1,
//         hotelId: parseInt(hotelId),
//         hotelName: hotel.name,
//         customer,
//         checkIn,
//         checkOut,
//         email
//     };

//     bookings.push(newBooking);
//     res.status(201).json(newBooking);
// });


// Update booking details
// router.put("/:id", (req, res) => {
//     const booking = bookings.find(b => b.id === parseInt(req.params.id));
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     booking.hotelId = req.body.hotelId || booking.hotelId;
//     booking.customer = req.body.customer || booking.customer;
//     booking.checkIn = req.body.checkIn || booking.checkIn;
//     booking.checkOut = req.body.checkOut || booking.checkOut;
//     booking.email = req.body.email || booking.email;

//     res.json({ message: "Booking updated", booking });
// });


// Delete a booking
// router.delete("/:id", (req, res) => {
//     bookings = bookings.filter(b => b.id !== parseInt(req.params.id));
//     res.json({ message: "Booking deleted" });
// });


// Cancel booking (Plugin)
// router.delete("/:id/cancel", async (req, res) => {
//     const booking = bookings.find(b => b.id === parseInt(req.params.id));
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     const hotel = hotels.find(h => h.id === booking.hotelId);
//     if (!hotel) return res.status(404).json({ message: "Hotel not found" });

//     // Check cancellation policy
//     const cancellationResult = cancellationPolicy.checkCancellation(booking, hotel);
    
//     if (!cancellationResult.allowed) {
//         return res.status(400).json({ message: cancellationResult.message });
//     }

//     // Remove booking
//     bookings = bookings.filter(b => b.id !== parseInt(req.params.id));

//     // Send cancellation email
//     // await emailNotifications.sendEmail(
//     //     booking.email,
//     //     "Booking Cancelled",
//     //     `Your booking at ${hotel.name} has been cancelled.`
//     // );
//     console.log(`Email to ${booking.email}: Your booking at ${hotel.name} has been cancelled.`);


//     res.json({ message: "Booking cancelled successfully" });
// });