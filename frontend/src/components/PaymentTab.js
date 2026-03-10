import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiMapPin, FiCalendar, FiUsers, FiEdit2, FiCheck } from "react-icons/fi";
import { useSettings } from "./SettingsContext";
import "./PaymentTab.css";

const BuildingIcon = () => ( <
    svg viewBox = "0 0 24 24"
    fill = "none"
    stroke = "currentColor"
    strokeWidth = "1.5" >
    <
    path d = "M3 21h18M4 21V7a1 1 0 0 1 1-1h5V3h4v3h5a1 1 0 0 1 1 1v14" / >
    <
    rect x = "10"
    y = "13"
    width = "4"
    height = "4" / >
    <
    /svg>
);

const GUEST_OPTIONS = ["1 Guest", "2 Guests", "3 Guests", "4 Guests", "5 Guests", "6+ Guests"];

const toDateInput = (d) => {
    const date = new Date(d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const PaymentTab = ({ searchData, hotel, onClose, onConfirm }) => {
    const { t } = useSettings();

    // All hooks BEFORE any early return
    const [checkIn, setCheckIn] = useState(toDateInput(searchData ? searchData.checkIn : new Date()));
    const [checkOut, setCheckOut] = useState(
        toDateInput(searchData ? searchData.checkOut : new Date())
    );
    const [guests, setGuests] = useState(searchData ? searchData.guests || "2 Guests" : "2 Guests");
    const [editingDates, setEditingDates] = useState(false);
    const [editingGuests, setEditingGuests] = useState(false);

    if (!searchData || !hotel) return null;

    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
    const subtotal = hotel.price * nights;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const fmt = (d) =>
        new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const handleConfirm = () => {
        onConfirm({
            ...searchData,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests,
        });
    };

    return ( <
        motion.div className = "pay-overlay"
        onClick = {
            (e) => e.target === e.currentTarget && onClose() }
        initial = {
            { opacity: 0 } }
        animate = {
            { opacity: 1 } }
        exit = {
            { opacity: 0 } } >
        <
        motion.div className = "pay-modal"
        initial = {
            { scale: 0.9, y: 20, opacity: 0 } }
        animate = {
            { scale: 1, y: 0, opacity: 1 } }
        exit = {
            { scale: 0.9, y: 20, opacity: 0 } }
        transition = {
            { type: "spring", damping: 25 } } > { /* Header */ } <
        div className = "pay-head" >
        <
        h3 > { t("bookingSummary") } < /h3> <
        motion.button className = "pay-close"
        onClick = { onClose }
        whileHover = {
            { rotate: 90, scale: 1.1 } }
        whileTap = {
            { scale: 0.9 } } >
        <
        FiX / >
        <
        /motion.button> <
        /div>

        <
        div className = "pay-body" > { /* Hotel */ } <
        motion.div className = "pay-hotel"
        initial = {
            { x: -20, opacity: 0 } }
        animate = {
            { x: 0, opacity: 1 } }
        transition = {
            { delay: 0.1 } } >
        <
        div className = "pay-hotel-icon" >
        <
        BuildingIcon / >
        <
        /div> <
        div >
        <
        h4 > { hotel.name } < /h4> <
        p >
        <
        FiMapPin / > { searchData.location } <
        /p> <
        /div> <
        /motion.div>

        { /* Dates — editable */ } <
        motion.div className = "pay-dates"
        initial = {
            { y: 20, opacity: 0 } }
        animate = {
            { y: 0, opacity: 1 } }
        transition = {
            { delay: 0.2 } } > { /* Check-in */ } <
        div className = "pay-date-item" >
        <
        span className = "pay-date-label" >
        <
        FiCalendar / > CHECK - IN <
        /span> {
            editingDates ? ( <
                input type = "date"
                className = "pay-date-input"
                value = { checkIn }
                min = { toDateInput(new Date()) }
                onChange = {
                    (e) => {
                        setCheckIn(e.target.value);
                        // auto-push checkout if needed
                        if (e.target.value >= checkOut) {
                            const d = new Date(e.target.value);
                            d.setDate(d.getDate() + 1);
                            setCheckOut(toDateInput(d));
                        }
                    }
                }
                />
            ) : ( <
                span className = "pay-date-val" > { fmt(checkIn) } < /span>
            )
        } <
        /div>

        { /* Check-out */ } <
        div className = "pay-date-item" >
        <
        span className = "pay-date-label" >
        <
        FiCalendar / > CHECK - OUT <
        /span> {
            editingDates ? ( <
                input type = "date"
                className = "pay-date-input"
                value = { checkOut }
                min = { checkIn }
                onChange = {
                    (e) => setCheckOut(e.target.value) }
                />
            ) : ( <
                span className = "pay-date-val" > { fmt(checkOut) } < /span>
            )
        } <
        /div>

        { /* Duration */ } <
        div className = "pay-date-item" >
        <
        span className = "pay-date-label" > DURATION < /span> <
        span className = "pay-date-val" > { nights } { nights === 1 ? t("night") : t("nights") } <
        /span> <
        /div>

        { /* Guests — editable */ } <
        div className = "pay-date-item" >
        <
        span className = "pay-date-label" >
        <
        FiUsers / > GUESTS <
        /span> {
            editingGuests ? ( <
                select className = "pay-date-input"
                value = { guests }
                onChange = {
                    (e) => {
                        setGuests(e.target.value);
                        setEditingGuests(false);
                    }
                } > {
                    GUEST_OPTIONS.map((g) => ( <
                        option key = { g }
                        value = { g } > { g } <
                        /option>
                    ))
                } <
                /select>
            ) : ( <
                span className = "pay-date-val" > { guests } < /span>
            )
        } <
        /div> <
        /motion.div>

        { /* Edit buttons */ } <
        div className = "pay-edit-row" >
        <
        motion.button className = { `pay-edit-btn${editingDates ? " active" : ""}` }
        onClick = {
            () => setEditingDates(!editingDates) }
        whileHover = {
            { scale: 1.03 } }
        whileTap = {
            { scale: 0.97 } } > {
            editingDates ? ( <
                >
                <
                FiCheck / > Done <
                />
            ) : ( <
                >
                <
                FiEdit2 / > Edit Dates <
                />
            )
        } <
        /motion.button> <
        motion.button className = { `pay-edit-btn${editingGuests ? " active" : ""}` }
        onClick = {
            () => setEditingGuests(!editingGuests) }
        whileHover = {
            { scale: 1.03 } }
        whileTap = {
            { scale: 0.97 } } > {
            editingGuests ? ( <
                >
                <
                FiCheck / > Done <
                />
            ) : ( <
                >
                <
                FiUsers / > Edit Guests <
                />
            )
        } <
        /motion.button> <
        /div>

        { /* Prices */ } <
        motion.div className = "pay-prices"
        initial = {
            { y: 20, opacity: 0 } }
        animate = {
            { y: 0, opacity: 1 } }
        transition = {
            { delay: 0.3 } } >
        <
        div className = "pay-row" >
        <
        span >
        $ { hotel.price }× { nights } { t("nights") } <
        /span> <
        span > $ { subtotal.toFixed(2) } < /span> <
        /div> <
        div className = "pay-row" >
        <
        span > { t("taxesFees") } < /span> <
        span > $ { tax.toFixed(2) } < /span> <
        /div> <
        motion.div className = "pay-row total"
        animate = {
            { scale: [1, 1.02, 1] } }
        transition = {
            { duration: 0.5, delay: 0.5 } } >
        <
        span > { t("total") } < /span> <
        span > $ { total.toFixed(2) } < /span> <
        /motion.div> <
        /motion.div>

        { /* Confirm button */ } <
        motion.button className = "pay-btn"
        onClick = { handleConfirm }
        whileHover = {
            { scale: 1.02, y: -2 } }
        whileTap = {
            { scale: 0.98 } }
        initial = {
            { y: 20, opacity: 0 } }
        animate = {
            { y: 0, opacity: 1 } }
        transition = {
            { delay: 0.4 } } > { t("confirmPay") } <
        /motion.button> <
        /div> <
        /motion.div> <
        /motion.div>
    );
};

export default PaymentTab;