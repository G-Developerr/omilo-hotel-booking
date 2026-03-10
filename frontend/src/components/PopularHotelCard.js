import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";
import ImageWithFallback from "./ImageWithFallback";
import imageService from "../services/imageService";
import "./PopularHotelCard.css";

const PopularHotelCard = ({ hotel, onClick }) => {
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

    const getImageUrl = () => {
        if (imageData && imageData.url) {
            return imageData.url;
        }
        return null;
    };

    return ( <
        motion.div className = "popular-card"
        onClick = { onClick }
        whileHover = {
            { x: 8 }
        }
        whileTap = {
            { scale: 0.98 }
        } >
        <
        div className = "popular-image" >
        <
        ImageWithFallback src = { getImageUrl() }
        imageObj = { imageData }
        alt = { hotel.name }
        /> < /
        div >

        <
        div className = "popular-info" >
        <
        h4 > { hotel.name } < /h4> <
        p className = "country" >
        <
        FiMapPin / > { hotel.country } <
        /p> < /
        div >

        <
        div className = "popular-price" >
        $ { hotel.price } <
        span > /night</span >
        <
        /div> < /
        motion.div >
    );
};

export default PopularHotelCard;