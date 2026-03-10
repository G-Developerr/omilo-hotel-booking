import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiChevronDown, FiMapPin } from "react-icons/fi";
import "./Dashboard.css";
import { useSettings } from "../components/SettingsContext";
import SearchBar from "../components/SearchBar";
import HotelCard from "../components/HotelCard";
import PopularHotelCard from "../components/PopularHotelCard";
import HotelDetail from "../components/HotelDetail";
import PaymentTab from "../components/PaymentTab";
import SearchResultsModal from "../components/SearchResultsModal";

const LODGING = [{
        id: 1,
        name: "Shikara Hotel",
        address: "Jl. Aston No. 72, Yogyakarta",
        price: 42.72,
        rating: 4.8,
        tag: "Best Value",
        description: "Luxury hotel with stunning views of the city. Features a rooftop pool, spa, and fine dining restaurant.",
    },
    {
        id: 2,
        name: "Visala Hotel",
        address: "Jl. Kebon No. 17, Yogyakarta",
        price: 38.42,
        rating: 4.5,
        tag: "Popular",
        description: "Modern boutique hotel in the heart of the city. Walking distance to major attractions.",
    },
    {
        id: 3,
        name: "Aruna Suites",
        address: "Jl. Gatot No. 72, Yogyakarta",
        price: 55.14,
        rating: 4.9,
        tag: "Luxury",
        description: "Exclusive suites with panoramic views. Includes butler service and private terrace.",
    },
];

const POPULAR = [
    { id: 4, name: "Shikara Hotel", country: "Yogyakarta, Indonesia", price: 42 },
    { id: 5, name: "Laganu Hotel", country: "Tokyo, Japan", price: 38 },
    { id: 6, name: "Hogi Hotel", country: "Bangkok, Thailand", price: 44 },
    { id: 7, name: "Ibis Hotel", country: "Bali, Indonesia", price: 45 },
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
        },
    },
};

const Dashboard = ({ onBookingConfirmed, onMenuChange }) => {
    const { t } = useSettings();
    const [selected, setSelected] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [searchData, setSearchData] = useState(null);
    const [showPay, setShowPay] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [popTab, setPopTab] = useState("mostPopular");
    const [isLoading, setIsLoading] = useState(false);

    const getEffectiveSearchData = () => {
        const today = new Date();
        const checkout = new Date(today);
        checkout.setDate(checkout.getDate() + 2);
        return {
            // Η τοποθεσία παίρνεται ΠΑΝΤΑ από το επιλεγμένο ξενοδοχείο
            location: selected ?
                selected.location || selected.country || selected.address || "Unknown" :
                searchData ?
                searchData.location :
                "Unknown",
            // Οι ημερομηνίες παίρνονται από το search αν υπάρχει, αλλιώς default
            checkIn: searchData ? searchData.checkIn : today,
            checkOut: searchData ? searchData.checkOut : checkout,
            guests: searchData ? searchData.guests : "2 Guests",
        };
    };

    const handleBook = () => {
        setShowPay(true);
    };

    const handleSearch = (data) => {
        console.log("Search data received:", data);
        setIsLoading(true);
        setSearchData(data);

        // Προσομοίωση loading και μετά εμφάνιση αποτελεσμάτων
        setTimeout(() => {
            setIsLoading(false);
            setShowSearchResults(true);
            toast.success("Hotels found!", {
                icon: "✨",
            });
        }, 600);
    };

    const handleSelectHotelFromResults = (hotel) => {
        setSelected(hotel);
        setShowSearchResults(false);
        toast.success(`${hotel.name} selected!`, {
            icon: "🏨",
        });
    };

    const handleConfirmBooking = (updatedSearchData) => {
        const effectiveData = updatedSearchData || getEffectiveSearchData();
        if (onBookingConfirmed && selected && effectiveData) {
            onBookingConfirmed(selected, effectiveData);
        }
        toast.success("Booking confirmed! ✨", {
            duration: 4000,
            style: {
                background: "var(--gold)",
                color: "#000",
                fontWeight: 600,
            },
            icon: "🎉",
        });
        setShowPay(false);
        setSelected(null);
    };

    return ( <
        div className = "dashboard" > { " " } { /* Center Feed */ } { " " } <
        motion.div className = "dash-feed"
        variants = { containerVariants }
        initial = "hidden"
        animate = "visible" >
        <
        motion.div variants = { itemVariants } >
        <
        div className = "dash-heading" >
        <
        h1 > Find Your Stay < /h1> <span> Yogyakarta, Indonesia </span > { " " } <
        /div>{" "} <
        /motion.div> <
        motion.div variants = { itemVariants } >
        <
        SearchBar onSearch = { handleSearch }
        isLoading = { isLoading }
        />{" "} <
        /motion.div> { /* Lodging */ } { " " } <
        motion.div variants = { itemVariants } >
        <
        div className = "section-row" >
        <
        span className = "section-label" > { t("availableLodging") } < /span>{" "} <
        motion.button className = "section-link"
        whileHover = {
            { x: 5 } }
        whileTap = {
            { scale: 0.95 } } > { t("viewAll") } { " " } <
        /motion.button>{" "} <
        /div>{" "} <
        motion.div className = "hotel-grid"
        variants = { containerVariants } > {
            LODGING.map((h) => ( <
                motion.div key = { h.id }
                variants = { itemVariants }
                whileHover = {
                    { y: -4 } } >
                <
                HotelCard hotel = { h }
                selected = { selected && selected.id === h.id }
                onClick = {
                    () => setSelected(h) }
                />{" "} <
                /motion.div>
            ))
        } { " " } <
        /motion.div>{" "} <
        /motion.div> { /* Promo Banner */ } { " " } <
        motion.div className = "promo-banner"
        variants = { itemVariants }
        whileHover = {
            { scale: 1.01 } }
        whileTap = {
            { scale: 0.99 } } >
        <
        div className = "promo-content" >
        <
        div className = "promo-text" >
        <
        strong > { t("limitedTimeOffer") } < /strong> <p> {t("limitedOfferText")} </p > { " " } <
        /div>{" "} <
        motion.div className = "promo-badge"
        animate = {
            {
                scale: [1, 1.05, 1],
                rotate: [0, -5, 5, 0],
            }
        }
        transition = {
            {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
            }
        } > { "45% OFF" } { " " } <
        /motion.div>{" "} <
        /div>{" "} <
        div className = "promo-glow" / >
        <
        /motion.div> { /* Popular Hotels */ } { " " } <
        motion.div variants = { itemVariants } >
        <
        div className = "section-row" >
        <
        span className = "section-label" > { t("mostPopular") } < /span>{" "} <
        motion.button className = "section-link"
        whileHover = {
            { x: 5 } }
        whileTap = {
            { scale: 0.95 } } > { t("viewAll") } { " " } <
        /motion.button>{" "} <
        /div> <
        div className = "pop-tabs" > { " " } {
            [t("mostPopular"), t("specialOffers"), t("nearMe")].map((tab) => ( <
                motion.button key = { tab }
                className = { `pop-tab${tab === t(popTab) ? " active" : ""}` }
                onClick = {
                    () =>
                    setPopTab(
                        ["mostPopular", "specialOffers", "nearMe"][
                            [t("mostPopular"), t("specialOffers"), t("nearMe")].indexOf(tab)
                        ]
                    )
                }
                whileHover = {
                    { scale: 1.05 } }
                whileTap = {
                    { scale: 0.95 } } > { tab } { " " } <
                /motion.button>
            ))
        } { " " } <
        /div> <
        motion.div className = "popular-list"
        variants = { containerVariants } > {
            POPULAR.map((h) => ( <
                motion.div key = { h.id }
                variants = { itemVariants }
                whileHover = {
                    { x: 8 } }
                whileTap = {
                    { scale: 0.98 } } >
                <
                PopularHotelCard hotel = { h }
                onClick = {
                    () => setSelected(h) }
                />{" "} <
                /motion.div>
            ))
        } { " " } <
        /motion.div>{" "} <
        /motion.div>{" "} <
        /motion.div> { /* Right Panel */ } { " " } <
        motion.aside className = "dash-panel glass"
        initial = {
            { x: 50, opacity: 0 } }
        animate = {
            { x: 0, opacity: 1 } }
        transition = {
            { type: "spring", damping: 20 } } >
        <
        div className = "panel-user" >
        <
        motion.div className = "panel-avatar"
        whileHover = {
            { scale: 1.1, rotate: 5 } }
        whileTap = {
            { scale: 0.95 } } >
        KS { " " } <
        /motion.div>{" "} <
        div className = "panel-user-info" >
        <
        h4 > Katherine Smith < /h4> <p> Traveler Enthusiast </p > { " " } <
        /div>{" "} <
        motion.span className = "panel-chevron"
        onClick = {
            () => setShowProfile(!showProfile) }
        whileHover = {
            { y: 3 } }
        animate = {
            { rotate: showProfile ? 180 : 0 } }
        transition = {
            { duration: 0.3 } } >
        <
        FiChevronDown / >
        <
        /motion.span>{" "} <
        /div> { /* Profile Dropdown */ } {
            showProfile && ( <
                motion.div className = "panel-profile-drop"
                initial = {
                    { opacity: 0, y: -10 } }
                animate = {
                    { opacity: 1, y: 0 } }
                exit = {
                    { opacity: 0, y: -10 } }
                transition = {
                    { duration: 0.2 } } >
                <
                div className = "profile-drop-item" >
                <
                span > ✈️ < /span> <
                div >
                <
                strong > 12 < /strong> <
                p > Trips taken < /p> <
                /div> <
                /div> <
                div className = "profile-drop-item" >
                <
                span > ⭐ < /span> <
                div >
                <
                strong > 4.9 < /strong> <
                p > Avg rating < /p> <
                /div> <
                /div> <
                div className = "profile-drop-item" >
                <
                span > 💰 < /span> <
                div >
                <
                strong > $1, 240 < /strong> <
                p > Total saved < /p> <
                /div> <
                /div> <
                div className = "profile-drop-divider" / >
                <
                button className = "profile-drop-btn"
                onClick = {
                    () => {
                        setShowProfile(false);
                        if (onMenuChange) onMenuChange("settings");
                    }
                } >
                Edit Profile <
                /button> <
                /motion.div>
            )
        } <
        div className = "panel-detail" >
        <
        AnimatePresence mode = "wait" > { " " } {
            selected ? ( <
                motion.div key = "detail"
                initial = {
                    { opacity: 0, y: 20 } }
                animate = {
                    { opacity: 1, y: 0 } }
                exit = {
                    { opacity: 0, y: -20 } }
                transition = {
                    { type: "spring", stiffness: 300 } } >
                <
                HotelDetail hotel = { selected }
                onBook = { handleBook }
                />{" "} <
                /motion.div>
            ) : ( <
                motion.div className = "panel-empty"
                key = "empty"
                initial = {
                    { opacity: 0 } }
                animate = {
                    { opacity: 1 } }
                exit = {
                    { opacity: 0 } } >
                <
                motion.div animate = {
                    {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                    }
                }
                transition = {
                    {
                        duration: 3,
                        repeat: Infinity,
                    }
                } >
                <
                FiMapPin size = { 40 }
                />{" "} <
                /motion.div>{" "} <
                p > Select a hotel to view details and book < /p>{" "} <
                /motion.div>
            )
        } { " " } <
        /AnimatePresence>{" "} <
        /div>{" "} <
        /motion.aside> { /* Search Results Modal */ } { " " } <
        AnimatePresence > { " " } {
            showSearchResults && searchData && ( <
                SearchResultsModal searchData = { getEffectiveSearchData() }
                onClose = {
                    () => setShowSearchResults(false) }
                onSelectHotel = { handleSelectHotelFromResults }
                />
            )
        } { " " } <
        /AnimatePresence> { /* Payment Modal */ } { " " } <
        AnimatePresence > { " " } {
            showPay && selected && ( <
                PaymentTab hotel = { selected }
                searchData = { getEffectiveSearchData() }
                onClose = {
                    () => setShowPay(false) }
                onConfirm = { handleConfirmBooking }
                />
            )
        } { " " } <
        /AnimatePresence>{" "} <
        /div>
    );
};

export default Dashboard;