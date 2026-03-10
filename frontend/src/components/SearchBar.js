import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiMapPin, FiUsers, FiSearch } from 'react-icons/fi';
import "react-datepicker/dist/react-datepicker.css";
import "./SearchBar.css";

const SearchBar = ({ onSearch, isLoading }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
    const [location, setLocation] = useState("Yogyakarta, Indonesia");
    const [guests, setGuests] = useState(2);
    const [showDropdown, setShowDropdown] = useState(false);
    const locationRef = useRef(null);

    const destinations = [
        "Yogyakarta, Indonesia",
        "Jakarta, Indonesia",
        "Bali, Indonesia",
        "Bandung, Indonesia",
        "Surabaya, Indonesia",
        "Tokyo, Japan",
        "Bangkok, Thailand",
        "Singapore",
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = () => {
        console.log("Search button clicked!", { location, startDate, endDate, guests });
        if (onSearch) {
            onSearch({
                location,
                checkIn: startDate,
                checkOut: endDate,
                guests
            });
        }
    };

    return ( <
        div className = "search-wrap" > { /* Date Field */ } <
        div className = "sf" >
        <
        div className = "sf-icon" >
        <
        FiCalendar / >
        <
        /div> <
        div className = "sf-body" >
        <
        span className = "sf-label" > Check in -Check out < /span> <
        div className = "sf-dates" >
        <
        DatePicker selected = { startDate }
        onChange = {
            (date) => setStartDate(date) }
        selectsStart startDate = { startDate }
        endDate = { endDate }
        dateFormat = "MMM d"
        className = "date-inp" /
        >
        <
        span className = "date-sep" > — < /span> <
        DatePicker selected = { endDate }
        onChange = {
            (date) => setEndDate(date) }
        selectsEnd startDate = { startDate }
        endDate = { endDate }
        minDate = { startDate }
        dateFormat = "MMM d"
        className = "date-inp" /
        >
        <
        /div> <
        /div> <
        /div>

        <
        div className = "sf-divider" / >

        { /* Location Field */ } <
        div className = "sf"
        ref = { locationRef } >
        <
        div className = "sf-icon" >
        <
        FiMapPin / >
        <
        /div> <
        div className = "sf-body" >
        <
        span className = "sf-label" > Where to < /span> <
        input type = "text"
        className = "loc-inp"
        value = { location }
        onChange = {
            (e) => setLocation(e.target.value) }
        onFocus = {
            () => setShowDropdown(true) }
        placeholder = "Enter destination" /
        >
        <
        /div>

        <
        AnimatePresence > {
            showDropdown && ( <
                motion.div className = "loc-drop"
                initial = {
                    { opacity: 0, y: -10 } }
                animate = {
                    { opacity: 1, y: 0 } }
                exit = {
                    { opacity: 0, y: -10 } }
                transition = {
                    { type: "spring", stiffness: 500, damping: 30 } } >
                {
                    destinations.map((dest, i) => ( <
                        motion.div key = { i }
                        className = "loc-opt"
                        onClick = {
                            () => {
                                setLocation(dest);
                                setShowDropdown(false);
                            }
                        }
                        whileHover = {
                            { x: 5 } } >
                        <
                        FiMapPin / > { dest } <
                        /motion.div>
                    ))
                } <
                /motion.div>
            )
        } <
        /AnimatePresence> <
        /div>

        <
        div className = "sf-divider" / >

        { /* Guests Field */ } <
        div className = "sf" >
        <
        div className = "sf-icon" >
        <
        FiUsers / >
        <
        /div> <
        div className = "sf-body" >
        <
        span className = "sf-label" > Guests < /span> <
        select className = "guests-sel"
        value = { guests }
        onChange = {
            (e) => setGuests(Number(e.target.value)) } >
        {
            [1, 2, 3, 4, 5, 6].map((n) => ( <
                option key = { n }
                value = { n } > { n } { n === 1 ? 'Guest' : 'Guests' } <
                /option>
            ))
        } <
        /select> <
        /div> <
        /div>

        { /* Search Button */ } <
        motion.button className = { `search-btn ${isLoading ? 'loading' : ''}` }
        onClick = { handleSearch }
        whileHover = {
            { scale: 1.02 } }
        whileTap = {
            { scale: 0.98 } }
        disabled = { isLoading }
        type = "button" >
        {
            isLoading ? ( <
                >
                <
                div className = "spinner" / >
                Searching... <
                />
            ) : ( <
                >
                <
                FiSearch style = {
                    { marginRight: 8 } }
                />
                Search <
                />
            )
        } <
        /motion.button> <
        /div>
    );
};

export default SearchBar;