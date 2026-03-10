import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiArrowRight, FiWifi, FiCoffee, FiTv, FiWind, FiImage } from "react-icons/fi";
import { FaSwimmingPool, FaDumbbell, FaParking, FaSpa } from "react-icons/fa";
import ImageWithFallback from "./ImageWithFallback";
import ImageGallery from "./ImageGallery";
import imageService from "../services/imageService";
import "./HotelDetail.css";
import { useSettings } from "./SettingsContext";

const AMENITIES = [
    { icon: < FiWifi / > , label: "Free WiFi" },
    { icon: < FaSwimmingPool / > , label: "Pool" },
    { icon: < FaDumbbell / > , label: "Gym" },
    { icon: < FaParking / > , label: "Parking" },
    { icon: < FaSpa / > , label: "Spa" },
    { icon: < FiCoffee / > , label: "Breakfast" },
    { icon: < FiTv / > , label: "Smart TV" },
    { icon: < FiWind / > , label: "AC" },
];

const TAB_KEYS = ["overview", "facilities", "details", "reviews"];

// Συντεταγμένες για κάθε ξενοδοχείο (βάσει πόλης)
const HOTEL_COORDS = {
    Yogyakarta: { lat: -7.7956, lng: 110.3695 },
    Jakarta: { lat: -6.2088, lng: 106.8456 },
    Bali: { lat: -8.4095, lng: 115.1889 },
    Tokyo: { lat: 35.6762, lng: 139.6503 },
    Bangkok: { lat: 13.7563, lng: 100.5018 },
    Singapore: { lat: 1.3521, lng: 103.8198 },
};

const getCoords = (address) => {
    for (const [city, coords] of Object.entries(HOTEL_COORDS)) {
        if (address && address.toLowerCase().includes(city.toLowerCase())) {
            return coords;
        }
    }
    return { lat: -7.7956, lng: 110.3695 }; // default Yogyakarta
};

const HotelDetail = ({ hotel, onBook }) => {
    const { t } = useSettings();
    const [tab, setTab] = useState("overview");
    const TABS = TAB_KEYS.map((k) => ({ key: k, label: t(k) }));
    const [expanded, setExpanded] = useState(false);
    const [hotelImages, setHotelImages] = useState([]);
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        const loadImages = async() => {
            try {
                const images = await imageService.getHotelImages(hotel.name, 5);
                setHotelImages(images || []);
            } catch (error) {
                console.error("Error loading images:", error);
                setHotelImages([]);
            }
        };
        loadImages();
    }, [hotel.name]);

    if (!hotel) return null;

    const description =
        hotel.description ||
        "Committed to realizing our guests' dreams — making business travel easier and leisure travel more accessible in the heart of the city. Experience unparalleled comfort and luxury with our world-class amenities and exceptional service.";

    const getImageUrl = (index) => {
        if (hotelImages && hotelImages.length > index && hotelImages[index]) {
            const img = hotelImages[index];
            return img.url || null;
        }
        return null;
    };

    const coords = getCoords(hotel.address || "");
    const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.01}%2C${coords.lat - 0.01}%2C${coords.lng + 0.01}%2C${coords.lat + 0.01}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;

    return ( <
        >
        <
        motion.div initial = {
            { opacity: 0 } }
        animate = {
            { opacity: 1 } }
        exit = {
            { opacity: 0 } } > { /* Gallery */ } <
        div className = "hd-gallery" >
        <
        motion.div className = "hd-gal-main"
        onClick = {
            () => setShowGallery(true) }
        whileHover = {
            { scale: 1.02 } } >
        <
        ImageWithFallback src = { getImageUrl(0) }
        alt = { hotel.name }
        /> <
        div className = "hd-gallery-overlay" >
        <
        FiImage / >
        <
        span > View { hotelImages.length }
        photos < /span> <
        /div> <
        /motion.div>

        <
        div className = "hd-gal-sm"
        onClick = {
            () => setShowGallery(true) } >
        <
        ImageWithFallback src = { getImageUrl(1) }
        alt = { `${hotel.name} 2` }
        /> <
        /div>

        <
        motion.div className = "hd-gal-sm more"
        onClick = {
            () => setShowGallery(true) }
        whileHover = {
            { scale: 1.05 } } >
        <
        ImageWithFallback src = { getImageUrl(2) }
        alt = { `${hotel.name} 3` }
        /> <
        div className = "hd-gallery-more" > +{ Math.max(0, hotelImages.length - 3) } < /div> <
        /motion.div> <
        /div>

        { /* Title */ } <
        div className = "hd-title-row" >
        <
        div className = "hd-name" > { hotel.name } < /div> <
        div className = "hd-rating-pill" >
        <
        FiStar / > { hotel.rating || "4.8" } <
        /div> <
        /div>

        { /* Tabs */ } <
        div className = "hd-tabs" > {
            TABS.map(({ key, label }) => ( <
                motion.button key = { key }
                className = { `hd-tab ${tab === key ? "active" : ""}` }
                onClick = {
                    () => setTab(key) }
                whileHover = {
                    { y: -2 } }
                whileTap = {
                    { scale: 0.95 } } > { label } <
                /motion.button>
            ))
        } <
        /div>

        { /* Tab Content */ } <
        AnimatePresence mode = "wait" >
        <
        motion.div key = { tab }
        className = "hd-content"
        initial = {
            { opacity: 0, y: 10 } }
        animate = {
            { opacity: 1, y: 0 } }
        exit = {
            { opacity: 0, y: -10 } }
        transition = {
            { duration: 0.2 } } > {
            tab === "overview" && ( <
                div >
                <
                span > { expanded ? description : `${description.substring(0, 100)}...` } < /span> <
                motion.button className = "hd-read-more"
                onClick = {
                    () => setExpanded(!expanded) }
                whileHover = {
                    { x: 3 } } > { expanded ? t("showLess") : t("readMore") } <
                /motion.button> <
                /div>
            )
        }

        {
            tab === "facilities" && ( <
                div className = "hd-chips" > {
                    AMENITIES.map((a) => ( <
                        motion.div key = { a.label }
                        className = "hd-chip"
                        whileHover = {
                            { scale: 1.05, y: -2 } } > { a.icon } { a.label } <
                        /motion.div>
                    ))
                } <
                /div>
            )
        }

        {
            tab === "details" && ( <
                div className = "hd-details" >
                <
                div className = "hd-detail-item" >
                <
                span > Check - in: < /span> <
                strong > 14: 00 < /strong> <
                /div> <
                div className = "hd-detail-item" >
                <
                span > Check - out: < /span> <
                strong > 12: 00 < /strong> <
                /div> <
                div className = "hd-detail-item" >
                <
                span > Reception: < /span> <
                strong > 24 / 7 < /strong> <
                /div> <
                div className = "hd-detail-item" >
                <
                span > Floors: < /span> <
                strong > 12 < /strong> <
                /div> <
                /div>
            )
        }

        {
            tab === "reviews" && ( <
                div >
                <
                div className = "hd-review-summary" >
                <
                div className = "hd-review-score" >
                <
                span className = "score" > 4.8 < /span> <
                span className = "total" > /5.0</span >
                <
                /div> <
                p > Excellent· Based on 128 verified guest reviews < /p> <
                /div> <
                div className = "hd-review-tags" >
                <
                span className = "review-tag" > Cleanliness 4.9 < /span> <
                span className = "review-tag" > Location 4.8 < /span> <
                span className = "review-tag" > Service 4.7 < /span> <
                span className = "review-tag" > Value 4.6 < /span> <
                /div> <
                /div>
            )
        } <
        /motion.div> <
        /AnimatePresence>

        { /* Location */ } <
        div className = "hd-location" >
        <
        h3 > { t("location") } < /h3> <
        div className = "hd-map" >
        <
        iframe title = "Hotel Location"
        src = { mapSrc }
        className = "hd-map-iframe"
        loading = "lazy"
        allowFullScreen /
        >
        <
        /div> <
        p className = "hd-address" > { hotel.address } < /p> <
        /div>

        { /* Book Button */ } <
        motion.button className = "hd-book-btn"
        onClick = { onBook }
        whileHover = {
            { scale: 1.02, y: -2 } }
        whileTap = {
            { scale: 0.98 } } >
        <
        div className = "hd-book-price" >
        $ { hotel.price } <
        sub > /night</sub >
        <
        /div> <
        div className = "hd-book-label" > { t("bookNow") } < FiArrowRight / >
        <
        /div> <
        /motion.button> <
        /motion.div>

        { /* Image Gallery Modal */ } <
        AnimatePresence > {
            showGallery && hotelImages.length > 0 && ( <
                ImageGallery images = { hotelImages }
                onClose = {
                    () => setShowGallery(false) }
                />
            )
        } <
        /AnimatePresence> <
        />
    );
};

export default HotelDetail;