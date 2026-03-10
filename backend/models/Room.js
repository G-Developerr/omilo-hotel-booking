const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    type: {
        type: String,
        enum: ["single", "double", "suite"],
        required: true,
    },
    pricePerNight: {
        type: Number,
        required: true,
    },
    capacity: Number,
    available: {
        type: Boolean,
        default: true,
    },
    amenities: [String],
});

module.exports = mongoose.model("Room", RoomSchema);