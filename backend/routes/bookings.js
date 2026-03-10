const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Room = require("../models/Room");

// Get all bookings
router.get("/", async(req, res) => {
    try {
        const bookings = await Booking.find().populate("roomId");
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create booking
router.post("/", async(req, res) => {
    try {
        // Find the room
        const room = await Room.findById(req.body.roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Calculate total price
        const nights = Math.max(
            1,
            Math.ceil(
                (new Date(req.body.checkOut) - new Date(req.body.checkIn)) / (1000 * 60 * 60 * 24)
            )
        );
        const totalPrice = room.pricePerNight * nights;

        const booking = new Booking({
            roomId: req.body.roomId,
            guestName: req.body.guestName,
            guestEmail: req.body.guestEmail,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            guests: req.body.guests,
            totalPrice: totalPrice,
            status: "confirmed",
        });

        const newBooking = await booking.save();

        // Update room availability
        await Room.findByIdAndUpdate(req.body.roomId, { available: false });

        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cancel booking
router.patch("/:id/cancel", async(req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        // Update booking status
        booking.status = "cancelled";
        await booking.save();

        // Make room available again
        await Room.findByIdAndUpdate(booking.roomId, { available: true });

        res.json({ message: "Booking cancelled" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;