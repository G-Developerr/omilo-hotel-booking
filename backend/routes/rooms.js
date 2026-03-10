const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// Get all rooms
router.get("/", async(req, res) => {
    try {
        const rooms = await Room.find().populate("hotelId");
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get rooms by hotel
router.get("/hotel/:hotelId", async(req, res) => {
    try {
        const rooms = await Room.find({ hotelId: req.params.hotelId });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create room
router.post("/", async(req, res) => {
    const room = new Room({
        hotelId: req.body.hotelId,
        type: req.body.type,
        pricePerNight: req.body.pricePerNight,
        capacity: req.body.capacity,
        available: req.body.available,
        amenities: req.body.amenities,
    });

    try {
        const newRoom = await room.save();
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update room availability
router.patch("/:id", async(req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(room);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;