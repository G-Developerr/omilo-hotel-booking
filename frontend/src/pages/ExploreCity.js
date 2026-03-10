import React, { useState } from "react";
import { motion } from "framer-motion";
import "./ExploreCity.css";

const CITIES = [{
        name: "Yogyakarta",
        hotels: 24,
        country: "Indonesia",
        image: "https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&w=600",
        fallback: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=600",
    },
    {
        name: "Jakarta",
        hotels: 56,
        country: "Indonesia",
        image: "https://images.pexels.com/photos/3356416/pexels-photo-3356416.jpeg?auto=compress&w=600",
        fallback: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=600",
    },
    {
        name: "Bali",
        hotels: 89,
        country: "Indonesia",
        image: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&w=600",
        fallback: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600",
    },
    {
        name: "Surabaya",
        hotels: 32,
        country: "Indonesia",
        image: "https://images.pexels.com/photos/4220967/pexels-photo-4220967.jpeg?auto=compress&w=600",
        fallback: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600",
    },
    {
        name: "Bandung",
        hotels: 45,
        country: "Indonesia",
        image: "https://images.pexels.com/photos/1483024/pexels-photo-1483024.jpeg?auto=compress&w=600",
        fallback: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    },
    {
        name: "Lombok",
        hotels: 28,
        country: "Indonesia",
        image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&w=600",
        fallback: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600",
    },
    {
        name: "Tokyo",
        hotels: 120,
        country: "Japan",
        image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&w=600",
        fallback: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600",
    },
    {
        name: "Bangkok",
        hotels: 95,
        country: "Thailand",
        image: "https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg?auto=compress&w=600",
        fallback: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600",
    },
    {
        name: "Singapore",
        hotels: 78,
        country: "Singapore",
        image: "https://images.pexels.com/photos/777059/pexels-photo-777059.jpeg?auto=compress&w=600",
        fallback: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600",
    },
];

const CityCard = ({ c, isActive, onClick }) => {
    const [imgSrc, setImgSrc] = useState(c.image);

    return ( <
        motion.div className = { `city-card ${isActive ? "active" : ""}` }
        onClick = { onClick }
        whileHover = {
            { y: -5 } }
        whileTap = {
            { scale: 0.98 } } >
        <
        div className = "city-image" >
        <
        img src = { imgSrc }
        alt = { c.name }
        onError = {
            () => setImgSrc(c.fallback) }
        /> <
        /div> <
        div className = "city-overlay" / >
        <
        div className = "city-content" >
        <
        div className = "city-name" > { c.name } < /div> <
        div className = "city-count" >
        <
        strong > { c.hotels } < /strong> hotels <
        /div> <
        div className = "city-country" > { c.country } < /div> <
        /div> <
        /motion.div>
    );
};

const ExploreCity = () => {
    const [active, setActive] = useState("Bali");

    return ( <
        motion.div className = "explore"
        initial = {
            { opacity: 0 } }
        animate = {
            { opacity: 1 } } >
        <
        div className = "explore-head" >
        <
        h1 > Explore Cities < /h1> <
        p > Discover hotels across Indonesia and beyond < /p> <
        /div>

        <
        div className = "city-grid" > {
            CITIES.map((c) => ( <
                CityCard key = { c.name }
                c = { c }
                isActive = { active === c.name }
                onClick = {
                    () => setActive(c.name) }
                />
            ))
        } <
        /div> <
        /motion.div>
    );
};

export default ExploreCity;