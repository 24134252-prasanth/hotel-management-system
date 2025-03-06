const express = require("express");
const router = express.Router();

// Dummy hotel data
let hotels = [
    { id: 1, name: "Grand Palace Hotel", location: "New York", price: 200, cancellationPolicy: { freeBeforeDays: 5, penalty: "50% charge" } },
    { id: 2, name: "Ocean View Resort", location: "California", price: 150, cancellationPolicy: { freeBeforeDays: 3, penalty: "No refund" } },
    { id: 3, name: "Taj Hotel", location: "Mumbai", price: 180, cancellationPolicy: { freeBeforeDays: 3, penalty: "20% charge" } },
    { id: 4, name: "Le Meridien", location: "Coimbatore", price: 100, cancellationPolicy: { freeBeforeDays: 4, penalty: "75% charge" } },
    { id: 5, name: "Burj Khalifa", location: "Dubai", price: 250, cancellationPolicy: { freeBeforeDays: 3, penalty: "No refund" } },
    { id: 6, name: "Hilton", location: "Mumbai", price: 180, cancellationPolicy: { freeBeforeDays: 5, penalty: "25% charge" } }
];

// Get all hotels
router.get("/", (req, res) => {
    res.json(hotels);
}); 

// Get a single hotel byID
router.get("/:id", (req, res) => {
    const hotel = hotels.find(h => h.id === parseInt(req.params.id));
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    res.json(hotel);
});

// Add a new hotel
router.post("/", (req, res) => {
    const { name, location, price, cancellationPolicy } = req.body;

    // Default cancellation policy if not provided
    const newHotel = {
        id: hotels.length + 1,
        name,
        location,
        price,
        cancellationPolicy: cancellationPolicy || { freeBeforeDays: 3, penalty: "No refund" } // Default policy
    };

    hotels.push(newHotel);
    res.status(201).json(newHotel);
});

// Update hotel details
router.put("/:id", (req, res) => {
    const hotel = hotels.find(h => h.id === parseInt(req.params.id));
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    hotel.name = req.body.name || hotel.name;
    hotel.location = req.body.location || hotel.location;
    hotel.price = req.body.price || hotel.price;
    hotel.cancellationPolicy = req.body.cancellationPolicy || hotel.cancellationPolicy;

    res.json({ message: "Hotel updated", hotel });
});

// Delete a hotel
router.delete("/:id", (req, res) => {
    hotels = hotels.filter(h => h.id !== parseInt(req.params.id));
    res.json({ message: "Hotel deleted" });
});

module.exports = {router, hotels };
// module.exports = router;
