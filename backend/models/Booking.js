const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    guestName: {
        type: String,
        required: true,
    },
    guestEmail: String,
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    guests: Number,
    totalPrice: Number,
    status: {
        type: String,
        enum: ["confirmed", "cancelled", "pending"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Booking", BookingSchema);