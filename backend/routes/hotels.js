const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");

// Get all hotels
router.get("/", async(req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single hotel
router.get("/:id", async(req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create hotel
router.post("/", async(req, res) => {
    const hotel = new Hotel({
        name: req.body.name,
        location: req.body.location,
        address: req.body.address,
        description: req.body.description,
        amenities: req.body.amenities,
        images: req.body.images,
        rating: req.body.rating,
        popular: req.body.popular,
    });

    try {
        const newHotel = await hotel.save();
        res.status(201).json(newHotel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update hotel
router.patch("/:id", async(req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(hotel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete hotel
router.delete("/:id", async(req, res) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.json({ message: "Hotel deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;