const express = require("express");
const router = express.Router();
const pool = require("../../db");

// Get all hotels
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM hotels");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get a single hotel by ID
router.get("/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM hotels WHERE id = $1", [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Hotel not found" });
        console.log("result", result.rows[0]);
        
        // res.json(result.rows[0]);

        let hotel = result.rows[0];
        // Check if cancellation_policy is a string before parsing
        if (typeof hotel.cancellation_policy === "string") {
            try {
                hotel.cancellation_policy = JSON.parse(hotel.cancellation_policy);
            } catch (error) {
                console.error("Error parsing cancellation policy:", error);
                hotel.cancellation_policy = { penalty: "Unknown", freeBeforeDays: 0 };
            }
        }
        console.log("cancellation policy", hotel.cancellation_policy);
        res.json(hotel);


    } catch (error) {
        console.error("Error fetching hotel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add a new hotel
router.post("/", async (req, res) => {
    const { name, location, price, cancellationPolicy } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO hotels (name, location, price, cancellation_policy) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, location, price, cancellationPolicy || { freeBeforeDays: 3, penalty: "No refund" }]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error adding hotel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update hotel details
router.put("/:id", async (req, res) => {
    const { name, location, price, cancellationPolicy } = req.body;
    try {
        const result = await pool.query(
            "UPDATE hotels SET name = COALESCE($1, name), location = COALESCE($2, location), price = COALESCE($3, price), cancellation_policy = COALESCE($4, cancellation_policy) WHERE id = $5 RETURNING *",
            [name, location, price, cancellationPolicy, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: "Hotel not found" });
        
        res.json({ message: "Hotel updated", hotel: result.rows[0] });
        
    } catch (error) {
        console.error("Error updating hotel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete a hotel
router.delete("/:id", async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM hotels WHERE id = $1 RETURNING *", [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Hotel not found" });
        res.json({ message: "Hotel deleted" });
    } catch (error) {
        console.error("Error deleting hotel:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// module.exports = {router, hotels };
module.exports = router;

// CODE FOR LOCAL DB
// -----------------
// Dummy hotel data
// let hotels = [
//     { id: 1, name: "Grand Palace Hotel", location: "New York", price: 200, cancellationPolicy: { freeBeforeDays: 5, penalty: "50% charge" } },
//     { id: 2, name: "Ocean View Resort", location: "California", price: 150, cancellationPolicy: { freeBeforeDays: 3, penalty: "No refund" } },
//     { id: 3, name: "Taj Hotel", location: "Mumbai", price: 180, cancellationPolicy: { freeBeforeDays: 3, penalty: "20% charge" } },
//     { id: 4, name: "Le Meridien", location: "Coimbatore", price: 100, cancellationPolicy: { freeBeforeDays: 4, penalty: "75% charge" } },
//     { id: 5, name: "Burj Khalifa", location: "Dubai", price: 250, cancellationPolicy: { freeBeforeDays: 3, penalty: "No refund" } },
//     { id: 6, name: "Hilton", location: "Mumbai", price: 180, cancellationPolicy: { freeBeforeDays: 5, penalty: "25% charge" } }
// ];


// Get all hotels
// router.get("/", (req, res) => {
//     res.json(hotels);
// }); 


// Get a single hotel by ID
// router.get("/:id", (req, res) => {
//     const hotel = hotels.find(h => h.id === parseInt(req.params.id));
//     if (!hotel) return res.status(404).json({ message: "Hotel not found" });
//     res.json(hotel);
// });


// Add a new hotel
// router.post("/", (req, res) => {
//     const { name, location, price, cancellationPolicy } = req.body;

//     // Default cancellation policy if not provided
//     const newHotel = {
//         id: hotels.length + 1,
//         name,
//         location,
//         price,
//         cancellationPolicy: cancellationPolicy || { freeBeforeDays: 3, penalty: "No refund" } // Default policy
//     };

//     hotels.push(newHotel);
//     res.status(201).json(newHotel);
// });


// Update hotel details
// router.put("/:id", (req, res) => {
//     const hotel = hotels.find(h => h.id === parseInt(req.params.id));
//     if (!hotel) return res.status(404).json({ message: "Hotel not found" });

//     hotel.name = req.body.name || hotel.name;
//     hotel.location = req.body.location || hotel.location;
//     hotel.price = req.body.price || hotel.price;
//     hotel.cancellationPolicy = req.body.cancellationPolicy || hotel.cancellationPolicy;

//     res.json({ message: "Hotel updated", hotel });
// });


// Delete a hotel
// router.delete("/:id", (req, res) => {
//     hotels = hotels.filter(h => h.id !== parseInt(req.params.id));
//     res.json({ message: "Hotel deleted" });
// });