import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiStar } from "react-icons/fi";
import ImageWithFallback from "./ImageWithFallback";
import imageService from "../services/imageService";
import "./HotelCard.css";

const HotelCard = ({ hotel, selected, onClick }) => {
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const loadImage = async() => {
            try {
                const images = await imageService.getHotelImages(hotel.name, 1);
                if (images && images.length > 0) {
                    setImageData(images[0]);
                }
            } catch (error) {
                console.error("Error loading image:", error);
            }
        };
        loadImage();
    }, [hotel.name]);

    // Βοηθητική συνάρτηση για ασφαλή πρόσβαση στο URL
    const getImageUrl = () => {
        if (imageData && imageData.url) {
            return imageData.url;
        }
        return null;
    };

    return ( <
        motion.div className = { `hotel-card ${selected ? "selected" : ""}` }
        onClick = { onClick }
        whileHover = {
            { y: -4 } }
        whileTap = {
            { scale: 0.98 } } >
        <
        div className = "hc-img" >
        <
        ImageWithFallback src = { getImageUrl() }
        imageObj = { imageData }
        alt = { hotel.name }
        /> {
            hotel.tag && ( <
                motion.span className = "hc-tag"
                initial = {
                    { scale: 0 } }
                animate = {
                    { scale: 1 } }
                transition = {
                    { type: "spring", stiffness: 500 } } > { hotel.tag } <
                /motion.span>
            )
        } <
        /div>

        <
        div className = "hc-body" >
        <
        div className = "hc-name" > { hotel.name } < /div>

        <
        div className = "hc-addr" >
        <
        FiMapPin / >
        <
        span > { hotel.address } < /span> <
        /div>

        <
        div className = "hc-footer" >
        <
        div className = "hc-price" >
        $ { hotel.price } <
        sub > /night</sub >
        <
        /div>

        <
        div className = "hc-rating" >
        <
        FiStar / > { hotel.rating } <
        /div> <
        /div> <
        /div> <
        /motion.div>
    );
};

export default HotelCard;