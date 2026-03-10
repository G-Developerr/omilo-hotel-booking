import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiMapPin,
    FiCalendar,
    FiUsers,
    FiTrash2,
    FiCheckCircle,
    FiClock,
    FiPackage,
    FiAlertTriangle,
    FiX,
} from "react-icons/fi";
import ImageWithFallback from "../components/ImageWithFallback";
import imageService from "../services/imageService";
import "./MyBookings.css";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const fmt = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const getNights = (checkIn, checkOut) =>
    Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));

const BookingCard = ({ booking, onCancel }) => {
    const { hotel, searchData, bookedAt, id } = booking;
    const nights = getNights(searchData.checkIn, searchData.checkOut);
    const total = (hotel.price * nights * 1.1).toFixed(2);
    const isUpcoming = new Date(searchData.checkIn) >= new Date();

    const [imgData] = React.useState(() => imageService.getRandomImage("hotels"));

    return ( <
        motion.div className = { "booking-card " + (isUpcoming ? "upcoming" : "past") }
        variants = { itemVariants }
        layout exit = {
            { opacity: 0, scale: 0.9, y: -20 } } >
        <
        div className = "booking-img" >
        <
        ImageWithFallback src = { imgData.url }
        imageObj = { imgData }
        alt = { hotel.name }
        /> <
        span className = { "booking-status " + (isUpcoming ? "upcoming" : "past") } > {
            isUpcoming ? ( <
                >
                <
                FiClock / > Upcoming <
                />
            ) : ( <
                >
                <
                FiCheckCircle / > Completed <
                />
            )
        } <
        /span> <
        /div>

        <
        div className = "booking-body" >
        <
        div className = "booking-top" >
        <
        div >
        <
        h3 className = "booking-name" > { hotel.name } < /h3> <
        div className = "booking-loc" >
        <
        FiMapPin / > { searchData.location } <
        /div> <
        /div> <
        div className = "booking-total" > $ { total } < /div> <
        /div>

        <
        div className = "booking-dates" >
        <
        div className = "booking-date-item" >
        <
        span className = "booking-date-label" >
        <
        FiCalendar / > Check - in
        <
        /span> <
        strong > { fmt(searchData.checkIn) } < /strong> <
        /div> <
        div className = "booking-date-arrow" > → < /div> <
        div className = "booking-date-item" >
        <
        span className = "booking-date-label" >
        <
        FiCalendar / > Check - out <
        /span> <
        strong > { fmt(searchData.checkOut) } < /strong> <
        /div> <
        div className = "booking-date-item" >
        <
        span className = "booking-date-label" >
        <
        FiUsers / > Guests <
        /span> <
        strong > { searchData.guests } < /strong> <
        /div> <
        div className = "booking-date-item" >
        <
        span className = "booking-date-label" > Duration < /span> <
        strong > { nights } { nights === 1 ? "night" : "nights" } <
        /strong> <
        /div> <
        /div>

        <
        div className = "booking-footer" >
        <
        span className = "booking-booked-at" > Booked on { fmt(bookedAt) } < /span> <
        motion.button className = { "booking-cancel-btn" + (isUpcoming ? "" : " past") }
        onClick = {
            () => onCancel(id, hotel.name) }
        whileHover = {
            { scale: 1.05 } }
        whileTap = {
            { scale: 0.95 } }
        title = "Remove booking" >
        <
        FiTrash2 / >
        <
        /motion.button> <
        /div> <
        /div> <
        /motion.div>
    );
};

const MyBookings = ({ bookings, onCancel }) => {
    const [filter, setFilter] = useState("all");
    const [confirmId, setConfirmId] = useState(null);
    const [confirmName, setConfirmName] = useState("");

    const handleCancel = (id, name) => {
        setConfirmId(id);
        setConfirmName(name);
    };

    const doCancel = () => {
        if (onCancel) onCancel(confirmId);
        setConfirmId(null);
        setConfirmName("");
    };

    const filtered = bookings.filter((b) => {
        if (filter === "upcoming") return new Date(b.searchData.checkIn) >= new Date();
        if (filter === "past") return new Date(b.searchData.checkIn) < new Date();
        return true;
    });

    return ( <
        div className = "mybookings-root" >
        <
        motion.div className = "mybookings"
        variants = { containerVariants }
        initial = "hidden"
        animate = "visible" > { /* Header */ } <
        motion.div className = "mybookings-head"
        variants = { itemVariants } >
        <
        div className = "mybookings-head-left" >
        <
        div className = "mybookings-head-icon" >
        <
        FiPackage / >
        <
        /div> <
        div >
        <
        h1 > My Bookings < /h1> <
        p className = "mybookings-subtitle" > { bookings.length }
        reservation { bookings.length !== 1 ? "s" : "" }
        total <
        /p> <
        /div> <
        /div> <
        div className = "mybookings-filters" > {
            ["all", "upcoming", "past"].map((f) => ( <
                motion.button key = { f }
                className = { "mybookings-filter-btn " + (filter === f ? "active" : "") }
                onClick = {
                    () => setFilter(f) }
                whileHover = {
                    { y: -2 } }
                whileTap = {
                    { scale: 0.95 } } > { f.charAt(0).toUpperCase() + f.slice(1) } <
                /motion.button>
            ))
        } <
        /div> <
        /motion.div>

        { /* Bookings list */ } <
        motion.div className = "bookings-list"
        variants = { containerVariants } >
        <
        AnimatePresence > {
            filtered.map((b) => ( <
                BookingCard key = { b.id }
                booking = { b }
                onCancel = { handleCancel }
                />
            ))
        } <
        /AnimatePresence> <
        /motion.div>

        { /* Empty state */ } {
            filtered.length === 0 && ( <
                motion.div className = "mybookings-empty"
                initial = {
                    { opacity: 0, scale: 0.9 } }
                animate = {
                    { opacity: 1, scale: 1 } } >
                <
                div className = "mybookings-empty-icon" >
                <
                FiPackage size = { 48 }
                /> <
                /div> <
                h3 > { bookings.length === 0 ? "No bookings yet" : "No bookings found" } < /h3> <
                p > {
                    bookings.length === 0 ?
                    "Book a hotel from the Dashboard or Favorites and it will appear here" :
                        "Try changing the filter"
                } <
                /p> <
                /motion.div>
            )
        } <
        /motion.div>

        { /* Confirmation Modal — OUTSIDE the scrollable area but inside root */ } <
        AnimatePresence > {
            confirmId && ( <
                motion.div className = "cancel-overlay"
                initial = {
                    { opacity: 0 } }
                animate = {
                    { opacity: 1 } }
                exit = {
                    { opacity: 0 } }
                onClick = {
                    (e) => e.target === e.currentTarget && setConfirmId(null) } >
                <
                motion.div className = "cancel-modal"
                initial = {
                    { scale: 0.85, y: 24, opacity: 0 } }
                animate = {
                    { scale: 1, y: 0, opacity: 1 } }
                exit = {
                    { scale: 0.85, y: 24, opacity: 0 } }
                transition = {
                    { type: "spring", damping: 22 } } >
                <
                button className = "cancel-modal-close"
                onClick = {
                    () => setConfirmId(null) } >
                <
                FiX / >
                <
                /button> <
                div className = "cancel-modal-icon" >
                <
                FiAlertTriangle / >
                <
                /div> <
                h3 > Cancel Booking ? < /h3> <
                p >
                Are you sure you want to cancel your reservation at < strong > { confirmName } < /strong>?
                This action cannot be undone. <
                /p> <
                div className = "cancel-modal-actions" >
                <
                motion.button className = "cancel-modal-keep"
                onClick = {
                    () => setConfirmId(null) }
                whileHover = {
                    { scale: 1.03 } }
                whileTap = {
                    { scale: 0.97 } } >
                Keep Booking <
                /motion.button> <
                motion.button className = "cancel-modal-confirm"
                onClick = { doCancel }
                whileHover = {
                    { scale: 1.03 } }
                whileTap = {
                    { scale: 0.97 } } >
                <
                FiTrash2 / > Yes, Cancel <
                /motion.button> <
                /div> <
                /motion.div> <
                /motion.div>
            )
        } <
        /AnimatePresence> <
        /div>
    );
};

export default MyBookings;