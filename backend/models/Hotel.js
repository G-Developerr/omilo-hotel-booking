const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    description: String,
    amenities: [String],
    images: [String],
    rating: Number,
    popular: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("Hotel", HotelSchema);