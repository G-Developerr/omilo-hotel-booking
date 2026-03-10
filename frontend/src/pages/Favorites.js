import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiHeart, FiTrash2, FiStar, FiFilter, FiGrid, FiList, FiSearch, FiWifi, FiCoffee } from "react-icons/fi";
import { FaSwimmingPool, FaSpa } from "react-icons/fa";
import toast from "react-hot-toast";
import ImageWithFallback from "../components/ImageWithFallback";
import imageService from "../services/imageService";
import PaymentTab from "../components/PaymentTab";
import "./Favorites.css";

const INIT = [
    { id: 1, name: "Shikara Hotel", location: "Yogyakarta, Indonesia", address: "Jl. Aston No. 72, Yogyakarta", price: 42.72, originalPrice: 89.99, rating: 4.8, reviews: 324, amenities: ["WiFi", "Pool", "Breakfast"], tag: "Best Value" },
    { id: 2, name: "Visala Hotel", location: "Yogyakarta, Indonesia", address: "Jl. Kebon No. 17, Yogyakarta", price: 38.42, originalPrice: 75.0, rating: 4.5, reviews: 256, amenities: ["WiFi", "Gym", "Parking"], tag: "Popular" },
    { id: 3, name: "Aruna Suites", location: "Bali, Indonesia", address: "Jl. Raya Seminyak, Bali", price: 55.14, originalPrice: 120.0, rating: 4.9, reviews: 189, amenities: ["WiFi", "Pool", "Spa", "Butler"], tag: "Luxury" },
    { id: 4, name: "Laganu Hotel", location: "Tokyo, Japan", address: "Shinjuku, Tokyo", price: 38.42, originalPrice: 79.0, rating: 4.6, reviews: 198, amenities: ["WiFi", "Restaurant"], tag: "Cultural" },
    { id: 5, name: "Hogi Hotel", location: "Bangkok, Thailand", address: "Sukhumvit, Bangkok", price: 44.0, originalPrice: 88.0, rating: 4.7, reviews: 312, amenities: ["WiFi", "Pool", "Spa"], tag: "Trending" },
];

const AMENITY_ICONS = {
    WiFi: < FiWifi / > ,
    Pool: < FaSwimmingPool / > ,
    Spa: < FaSpa / > ,
    Breakfast: < FiCoffee / > ,
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const FavCard = ({ h, viewMode, onRemove, onBook }) => {
        const [imageData, setImageData] = useState(null);

        useEffect(() => {
            const load = async() => {
                try {
                    const imgs = await imageService.getHotelImages(h.name, 1);
                    if (imgs && imgs.length > 0) setImageData(imgs[0]);
                } catch (e) {
                    console.error(e);
                }
            };
            load();
        }, [h.name]);

        return ( <
                motion.div className = { `fav-card ${viewMode}` }
                variants = { itemVariants }
                layout exit = {
                    { opacity: 0, scale: 0.8, y: -20 } }
                whileHover = {
                    { y: -6 } } >
                <
                div className = "fav-img" >
                <
                ImageWithFallback src = { imageData ? imageData.url : null }
                imageObj = { imageData }
                alt = { h.name }
                /> {
                    h.tag && < span className = "fav-tag" > { h.tag } < /span>} <
                        motion.button
                    className = "fav-remove-btn"
                    onClick = {
                        () => onRemove(h.id, h.name) }
                    whileHover = {
                        { scale: 1.15 } }
                    whileTap = {
                        { scale: 0.9 } }
                    title = "Remove from favorites" >
                        <
                        FiTrash2 / >
                        <
                        /motion.button> {
                            h.originalPrice && ( <
                                span className = "fav-discount" >
                                -{ Math.round(((h.originalPrice - h.price) / h.originalPrice) * 100) } %
                                <
                                /span>
                            )
                        } <
                        /div>

                    <
                    div className = "fav-body" >
                        <
                        div className = "fav-name-row" >
                        <
                        div className = "fav-name" > { h.name } < /div> <
                        div className = "fav-rating" > < FiStar / > { h.rating } < /div> <
                        /div> <
                        div className = "fav-loc" > < FiMapPin / > { h.location } < /div> {
                            h.reviews && < div className = "fav-reviews" > { h.reviews }
                            reviews < /div>} <
                                div className = "fav-amenities" > {
                                    h.amenities.slice(0, 3).map((a) => ( <
                                        span key = { a }
                                        className = "fav-amenity" > { AMENITY_ICONS[a] || null } { a } < /span>
                                    ))
                                } {
                                    h.amenities.length > 3 && ( <
                                        span className = "fav-amenity more" > +{ h.amenities.length - 3 } < /span>
                                    )
                                } <
                                /div> <
                                div className = "fav-footer" >
                                <
                                div className = "fav-price-group" > {
                                    h.originalPrice && < span className = "fav-original-price" > $ { h.originalPrice } < /span>} <
                                    span className = "fav-price" > $ { h.price } < sub > /night</sub > < /span> <
                                    /div> <
                                    motion.button
                                    className = "fav-book-btn"
                                    onClick = {
                                        () => onBook(h) }
                                    whileHover = {
                                        { scale: 1.03, y: -1 } }
                                    whileTap = {
                                        { scale: 0.97 } } >
                                    Book Now <
                                    /motion.button> <
                                    /div> <
                                    /div> <
                                    /motion.div>
                                );
                        };

                    const Favorites = ({ onBookingConfirmed }) => {
                        const [favs, setFavs] = useState(INIT);
                        const [viewMode, setViewMode] = useState("grid");
                        const [sortBy, setSortBy] = useState("default");
                        const [searchQuery, setSearchQuery] = useState("");
                        const [showFilters, setShowFilters] = useState(false);
                        const [bookingHotel, setBookingHotel] = useState(null);
                        const [showPayment, setShowPayment] = useState(false);

                        const removeFavorite = (id, name) => {
                            setFavs((prev) => prev.filter((f) => f.id !== id));
                            toast.success(`${name} removed from favorites`, { icon: "💔" });
                        };

                        const handleBookClick = (hotel) => {
                            setBookingHotel(hotel);
                            setShowPayment(true);
                        };

                        const handleConfirmBooking = () => {
                            if (onBookingConfirmed && bookingHotel && defaultSearchData) onBookingConfirmed(bookingHotel, defaultSearchData);
                            toast.success("Booking confirmed! ✨", {
                                duration: 4000,
                                style: { background: "var(--gold)", color: "#000", fontWeight: 600 },
                                icon: "🎉",
                            });
                            setShowPayment(false);
                            setBookingHotel(null);
                        };

                        const getSorted = () => {
                            let filtered = [...favs];
                            if (searchQuery.trim()) {
                                const q = searchQuery.toLowerCase();
                                filtered = filtered.filter(
                                    (h) => h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q)
                                );
                            }
                            switch (sortBy) {
                                case "price-low":
                                    return filtered.sort((a, b) => a.price - b.price);
                                case "price-high":
                                    return filtered.sort((a, b) => b.price - a.price);
                                case "rating":
                                    return filtered.sort((a, b) => b.rating - a.rating);
                                case "name":
                                    return filtered.sort((a, b) => a.name.localeCompare(b.name));
                                default:
                                    return filtered;
                            }
                        };

                        const sorted = getSorted();
                        const totalSaved = favs.reduce((acc, h) => acc + (h.originalPrice - h.price), 0);

                        const today = new Date();
                        const checkout = new Date(today);
                        checkout.setDate(checkout.getDate() + 2);

                        const defaultSearchData = bookingHotel ?
                            { location: bookingHotel.location, checkIn: today, checkOut: checkout, guests: "2 Guests" } :
                            null;

                        return ( <
                            motion.div className = "favs"
                            variants = { containerVariants }
                            initial = "hidden"
                            animate = "visible" >
                            <
                            motion.div className = "favs-head"
                            variants = { itemVariants } >
                            <
                            div className = "favs-head-left" >
                            <
                            div className = "favs-head-icon" > < FiHeart / > < /div> <
                            div >
                            <
                            h1 > Favorites < /h1> <
                            p className = "favs-subtitle" > { favs.length }
                            saved· $ { totalSaved.toFixed(0) }
                            total savings < /p> <
                            /div> <
                            /div> <
                            div className = "favs-head-actions" >
                            <
                            div className = "favs-search-mini" >
                            <
                            FiSearch / >
                            <
                            input type = "text"
                            placeholder = "Search favorites..."
                            value = { searchQuery }
                            onChange = {
                                (e) => setSearchQuery(e.target.value) }
                            /> <
                            /div> <
                            motion.button className = { `favs-view-btn ${viewMode === "grid" ? "active" : ""}` }
                            onClick = {
                                () => setViewMode("grid") }
                            whileTap = {
                                { scale: 0.9 } } > < FiGrid / > < /motion.button> <
                            motion.button className = { `favs-view-btn ${viewMode === "list" ? "active" : ""}` }
                            onClick = {
                                () => setViewMode("list") }
                            whileTap = {
                                { scale: 0.9 } } > < FiList / > < /motion.button> <
                            motion.button className = "favs-filter-btn"
                            onClick = {
                                () => setShowFilters(!showFilters) }
                            whileTap = {
                                { scale: 0.95 } } > < FiFilter / > Sort < /motion.button> <
                            /div> <
                            /motion.div>

                            <
                            AnimatePresence > {
                                showFilters && ( <
                                    motion.div className = "favs-sort-bar"
                                    initial = {
                                        { height: 0, opacity: 0 } }
                                    animate = {
                                        { height: "auto", opacity: 1 } }
                                    exit = {
                                        { height: 0, opacity: 0 } }
                                    transition = {
                                        { duration: 0.2 } } > {
                                        [
                                            { value: "default", label: "Default" },
                                            { value: "price-low", label: "Price: Low → High" },
                                            { value: "price-high", label: "Price: High → Low" },
                                            { value: "rating", label: "Top Rated" },
                                            { value: "name", label: "A–Z" },
                                        ].map((opt) => ( <
                                            motion.button key = { opt.value }
                                            className = { `sort-chip ${sortBy === opt.value ? "active" : ""}` }
                                            onClick = {
                                                () => setSortBy(opt.value) }
                                            whileHover = {
                                                { y: -2 } }
                                            whileTap = {
                                                { scale: 0.95 } } > { opt.label } <
                                            /motion.button>
                                        ))
                                    } <
                                    /motion.div>
                                )
                            } <
                            /AnimatePresence>

                            <
                            motion.div className = { `favs-grid ${viewMode}` }
                            variants = { containerVariants } >
                            <
                            AnimatePresence > {
                                sorted.map((h) => ( <
                                    FavCard key = { h.id }
                                    h = { h }
                                    viewMode = { viewMode }
                                    onRemove = { removeFavorite }
                                    onBook = { handleBookClick }
                                    />
                                ))
                            } <
                            /AnimatePresence> <
                            /motion.div>

                            {
                                sorted.length === 0 && ( <
                                    motion.div className = "favs-empty"
                                    initial = {
                                        { opacity: 0, scale: 0.9 } }
                                    animate = {
                                        { opacity: 1, scale: 1 } } >
                                    <
                                    div className = "favs-empty-icon" > < FiHeart size = { 48 }
                                    /></div >
                                    <
                                    h3 > { searchQuery ? "No matches found" : "No favorites yet" } < /h3> <
                                    p > { searchQuery ? "Try adjusting your search" : "Start adding hotels to your favorites list" } < /p> <
                                    /motion.div>
                                )
                            }

                            <
                            AnimatePresence > {
                                showPayment && bookingHotel && defaultSearchData && ( <
                                    PaymentTab hotel = { bookingHotel }
                                    searchData = { defaultSearchData }
                                    onClose = {
                                        () => { setShowPayment(false);
                                            setBookingHotel(null); } }
                                    onConfirm = { handleConfirmBooking }
                                    />
                                )
                            } <
                            /AnimatePresence> <
                            /motion.div>
                        );
                    };

                    export default Favorites;