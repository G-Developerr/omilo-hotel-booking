const express = require("express");
const router = express.Router();
const axios = require("axios");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");

// LLM Chat endpoint
router.post("/chat", async(req, res) => {
    try {
        const { message, context } = req.body;

        // Get real data from database
        const hotels = await Hotel.find().limit(5);

        // Fix: Remove optional chaining, check if context exists
        let bookings = [];
        if (context && context.userId) {
            bookings = await Booking.find({ userId: context.userId });
        }

        // Here you'll connect to YOUR custom LLM
        // Replace this URL with your LLM endpoint
        const YOUR_LLM_ENDPOINT = process.env.LLM_ENDPOINT || "http://localhost:8000/llm";

        try {
            const llmResponse = await axios.post(YOUR_LLM_ENDPOINT, {
                prompt: message,
                context: {
                    hotels: hotels,
                    bookings: bookings,
                    userQuery: message,
                    timestamp: new Date().toISOString(),
                },
            });

            res.json({
                response: llmResponse.data,
                timestamp: new Date().toISOString(),
            });
        } catch (llmError) {
            // Fallback response if LLM fails
            res.json({
                response: "I'm here to help! You can ask me about hotels, prices, availability, or make a booking.",
                timestamp: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.error("LLM Error:", error);
        res.status(500).json({
            response: "Sorry, I'm having trouble connecting. Please try again later.",
            error: error.message,
        });
    }
});

// LLM test endpoint
router.get("/test", (req, res) => {
    res.json({
        message: "LLM API is ready",
        status: "connected",
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;