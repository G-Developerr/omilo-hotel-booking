import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMapPin, FiStar, FiChevronLeft, FiChevronRight, FiTrendingUp, FiClock, FiAward } from 'react-icons/fi';
import ImageWithFallback from "./ImageWithFallback";
import "./SearchResultsModal.css";

const SearchResultsModal = ({ searchData, onClose, onSelectHotel }) => {
    const [hotels, setHotels] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortBy, setSortBy] = useState('recommended');
    const [loading, setLoading] = useState(true);

    const getLocation = useCallback(() => {
        if (searchData && searchData.location) {
            return searchData.location;
        }
        return "Yogyakarta, Indonesia";
    }, [searchData]);

    useEffect(() => {
        setLoading(true);

        setTimeout(() => {
            const currentLocation = getLocation();

            const mockHotels = [{
                    id: 1,
                    name: "Shikara Hotel",
                    location: currentLocation,
                    price: 42.72,
                    originalPrice: 89.99,
                    rating: 4.8,
                    reviews: 324,
                    distance: "0.3 km from center",
                    amenities: ["Free WiFi", "Pool", "Breakfast", "Spa"],
                    discount: 52,
                    description: "Luxury hotel with stunning views of the city. Features a rooftop pool, spa, and fine dining restaurant.",
                    tag: "Best Value"
                },
                {
                    id: 2,
                    name: "Visala Hotel",
                    location: currentLocation,
                    price: 38.42,
                    originalPrice: 75.00,
                    rating: 4.5,
                    reviews: 256,
                    distance: "0.8 km from center",
                    amenities: ["Free WiFi", "Restaurant", "Gym", "Parking"],
                    discount: 49,
                    description: "Modern boutique hotel in the heart of the city. Walking distance to major attractions.",
                    tag: "Popular"
                },
                {
                    id: 3,
                    name: "Aruna Suites",
                    location: currentLocation,
                    price: 55.14,
                    originalPrice: 120.00,
                    rating: 4.9,
                    reviews: 189,
                    distance: "1.2 km from center",
                    amenities: ["Free WiFi", "Pool", "Spa", "Butler Service", "Fine Dining"],
                    discount: 54,
                    description: "Exclusive suites with panoramic views. Includes butler service and private terrace.",
                    tag: "Luxury"
                },
                {
                    id: 4,
                    name: "The Grand Palace",
                    location: currentLocation,
                    price: 65.80,
                    originalPrice: 149.99,
                    rating: 4.7,
                    reviews: 412,
                    distance: "0.5 km from center",
                    amenities: ["Free WiFi", "Pool", "Spa", "Casino", "Fine Dining"],
                    discount: 56,
                    description: "Experience royal treatment at this magnificent palace hotel with stunning architecture.",
                    tag: "Premium"
                },
                {
                    id: 5,
                    name: "Ocean Breeze Resort",
                    location: "Bali, Indonesia",
                    price: 48.90,
                    originalPrice: 95.00,
                    rating: 4.6,
                    reviews: 278,
                    distance: "Beachfront",
                    amenities: ["Free WiFi", "Pool", "Beach Access", "Spa", "Restaurant"],
                    discount: 49,
                    description: "Beachfront resort with private beach access and stunning ocean views.",
                    tag: "Beachfront"
                },
                {
                    id: 6,
                    name: "Mountain View Lodge",
                    location: "Bandung, Indonesia",
                    price: 35.20,
                    originalPrice: 69.99,
                    rating: 4.4,
                    reviews: 156,
                    distance: "Mountain view",
                    amenities: ["Free WiFi", "Restaurant", "Hiking", "Fireplace"],
                    discount: 50,
                    description: "Cozy mountain lodge with breathtaking views and outdoor activities.",
                    tag: "Nature"
                }
            ];

            // Φιλτράρισμα με βάση την τοποθεσία
            let filtered = mockHotels;
            if (searchData && searchData.location) {
                const searchLocation = searchData.location.toLowerCase();
                filtered = mockHotels.filter(function(hotel) {
                    return hotel.location.toLowerCase().includes(searchLocation);
                });
            }

            // Αν δεν βρέθηκαν αποτελέσματα, δείξε όλα
            if (filtered.length === 0) {
                filtered = mockHotels;
            }

            // Ταξινόμηση
            const sorted = sortHotels(filtered, sortBy);

            setHotels(sorted);
            setLoading(false);
        }, 800);
    }, [searchData, sortBy, getLocation]);

    const sortHotels = (hotelsArray, sortType) => {
        const hotelsCopy = [...hotelsArray];

        switch (sortType) {
            case 'price-low':
                return hotelsCopy.sort(function(a, b) {
                    return a.price - b.price;
                });
            case 'price-high':
                return hotelsCopy.sort(function(a, b) {
                    return b.price - a.price;
                });
            case 'rating':
                return hotelsCopy.sort(function(a, b) {
                    return b.rating - a.rating;
                });
            case 'discount':
                return hotelsCopy.sort(function(a, b) {
                    return b.discount - a.discount;
                });
            default: // recommended
                return hotelsCopy.sort(function(a, b) {
                    const scoreA = a.rating * 0.7 + a.discount * 0.3;
                    const scoreB = b.rating * 0.7 + b.discount * 0.3;
                    return scoreB - scoreA;
                });
        }
    };

    const handlePrevPage = () => {
        setCurrentPage(function(prev) {
            return Math.max(0, prev - 1);
        });
    };

    const handleNextPage = () => {
        setCurrentPage(function(prev) {
            return Math.min(Math.ceil(hotels.length / 2) - 1, prev + 1);
        });
    };

    const handleSelectHotel = (hotel) => {
        if (onSelectHotel) {
            onSelectHotel(hotel);
        }
        onClose();
    };

    const formatDate = (date) => {
        if (!date) return '';
        try {
            return new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return '';
        }
    };

    const calculateNights = () => {
        if (!searchData) return 1;
        if (!searchData.checkIn) return 1;
        if (!searchData.checkOut) return 1;

        try {
            const checkIn = new Date(searchData.checkIn);
            const checkOut = new Date(searchData.checkOut);
            const diffTime = Math.abs(checkOut - checkIn);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return Math.max(1, diffDays);
        } catch (e) {
            return 1;
        }
    };

    const nights = calculateNights();

    // Έλεγχος για εμφάνιση summary items
    const showLocation = searchData && searchData.location;
    const showDates = searchData && searchData.checkIn && searchData.checkOut;
    const showGuests = searchData && searchData.guests;

    return ( <
        motion.div className = "search-results-overlay"
        initial = {
            { opacity: 0 } }
        animate = {
            { opacity: 1 } }
        exit = {
            { opacity: 0 } }
        onClick = { onClose } >
        <
        motion.div className = "search-results-modal"
        initial = {
            { scale: 0.9, y: 50, opacity: 0 } }
        animate = {
            { scale: 1, y: 0, opacity: 1 } }
        exit = {
            { scale: 0.9, y: 50, opacity: 0 } }
        transition = {
            { type: "spring", damping: 25 } }
        onClick = {
            function(e) { e.stopPropagation(); } } >
        { /* Header */ } <
        div className = "results-header" >
        <
        div className = "results-header-left" >
        <
        h2 > Available Hotels < /h2> <
        div className = "search-summary" > {
            showLocation && ( <
                span className = "search-summary-item" >
                <
                FiMapPin / > { searchData.location } <
                /span>
            )
        } {
            showDates && ( <
                span className = "search-summary-item" >
                <
                FiClock / > { formatDate(searchData.checkIn) } - { formatDate(searchData.checkOut) } <
                /span>
            )
        } {
            showGuests && ( <
                span className = "search-summary-item" >
                <
                FiAward / > { searchData.guests } { searchData.guests === 1 ? 'Guest' : 'Guests' } <
                /span>
            )
        } <
        /div> <
        /div> <
        motion.button className = "results-close"
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

        { /* Sort Bar */ } <
        div className = "results-sort-bar" >
        <
        span className = "sort-label" > Sort by: < /span> <
        div className = "sort-options" > {
            [
                { value: 'recommended', label: 'Recommended' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'rating', label: 'Rating' },
                { value: 'discount', label: 'Discount' }
            ].map(function(option) {
                return ( <
                    motion.button key = { option.value }
                    className = { 'sort-option ' + (sortBy === option.value ? 'active' : '') }
                    onClick = {
                        function() { setSortBy(option.value); } }
                    whileHover = {
                        { y: -2 } }
                    whileTap = {
                        { scale: 0.95 } } >
                    { option.label } { option.value === 'recommended' && < FiTrendingUp / > } <
                    /motion.button>
                );
            })
        } <
        /div> <
        /div>

        { /* Results Content */ } <
        div className = "results-content" > {
            loading ? ( <
                div className = "results-loading" >
                <
                motion.div className = "loading-spinner"
                animate = {
                    { rotate: 360 } }
                transition = {
                    { duration: 1, repeat: Infinity, ease: "linear" } }
                /> <
                p > Searching
                for the best hotels... < /p> <
                /div>
            ) : ( <
                >
                <
                div className = "results-stats" >
                <
                span className = "results-count" > { hotels.length }
                hotels found < /span> <
                span className = "results-nights" > { nights }
                nights < /span> <
                /div>

                <
                AnimatePresence mode = "wait" >
                <
                motion.div key = { currentPage }
                className = "hotels-grid"
                initial = {
                    { opacity: 0, x: 100 } }
                animate = {
                    { opacity: 1, x: 0 } }
                exit = {
                    { opacity: 0, x: -100 } }
                transition = {
                    { duration: 0.3 } } >
                {
                    hotels.slice(currentPage * 2, (currentPage + 1) * 2).map(function(hotel, index) {
                        return ( <
                            motion.div key = { hotel.id }
                            className = "hotel-result-card"
                            initial = {
                                { opacity: 0, y: 20 } }
                            animate = {
                                { opacity: 1, y: 0 } }
                            transition = {
                                { delay: index * 0.1 } }
                            whileHover = {
                                { y: -5, scale: 1.02 } } >
                            <
                            div className = "hotel-result-image" >
                            <
                            ImageWithFallback src = { null }
                            alt = { hotel.name }
                            /> {
                                hotel.tag && ( <
                                    span className = "hotel-result-tag" > { hotel.tag } < /span>
                                )
                            } {
                                hotel.discount > 0 && ( <
                                    span className = "hotel-result-discount" > -{ hotel.discount } % < /span>
                                )
                            } <
                            /div>

                            <
                            div className = "hotel-result-details" >
                            <
                            div className = "hotel-result-header" >
                            <
                            h3 > { hotel.name } < /h3> <
                            div className = "hotel-result-rating" >
                            <
                            FiStar / >
                            <
                            span > { hotel.rating } < /span> <
                            span className = "reviews" > ({ hotel.reviews }) < /span> <
                            /div> <
                            /div>

                            <
                            div className = "hotel-result-location" >
                            <
                            FiMapPin / >
                            <
                            span > { hotel.location } < /span> <
                            span className = "distance" > { hotel.distance } < /span> <
                            /div>

                            <
                            div className = "hotel-result-amenities" > {
                                hotel.amenities.slice(0, 3).map(function(amenity, i) {
                                    return ( <
                                        span key = { i }
                                        className = "amenity-tag" > { amenity } < /span>
                                    );
                                })
                            } {
                                hotel.amenities.length > 3 && ( <
                                    span className = "amenity-tag more" > +{ hotel.amenities.length - 3 } < /span>
                                )
                            } <
                            /div>

                            <
                            p className = "hotel-result-description" > { hotel.description } < /p>

                            <
                            div className = "hotel-result-footer" >
                            <
                            div className = "hotel-result-price" > {
                                hotel.originalPrice && ( <
                                    span className = "original-price" > $ { hotel.originalPrice } < /span>
                                )
                            } <
                            span className = "current-price" > $ { hotel.price } < /span> <
                            span className = "per-night" > /night</span >
                            <
                            /div>

                            <
                            div className = "hotel-result-total" >
                            <
                            span className = "total-label" > Total
                            for { nights }
                            nights: < /span> <
                            span className = "total-price" > $ {
                                (hotel.price * nights).toFixed(2) } < /span> <
                            /div>

                            <
                            motion.button className = "select-hotel-btn"
                            onClick = {
                                function() { handleSelectHotel(hotel); } }
                            whileHover = {
                                { scale: 1.05 } }
                            whileTap = {
                                { scale: 0.95 } } >
                            Select Room <
                            /motion.button> <
                            /div> <
                            /div> <
                            /motion.div>
                        );
                    })
                } <
                /motion.div> <
                /AnimatePresence>

                {
                    hotels.length > 2 && ( <
                        div className = "results-pagination" >
                        <
                        motion.button className = "pagination-btn"
                        onClick = { handlePrevPage }
                        disabled = { currentPage === 0 }
                        whileHover = {
                            { scale: 1.1 } }
                        whileTap = {
                            { scale: 0.9 } } >
                        <
                        FiChevronLeft / >
                        <
                        /motion.button> <
                        span className = "pagination-info" >
                        Page { currentPage + 1 }
                        of { Math.ceil(hotels.length / 2) } <
                        /span> <
                        motion.button className = "pagination-btn"
                        onClick = { handleNextPage }
                        disabled = { currentPage >= Math.ceil(hotels.length / 2) - 1 }
                        whileHover = {
                            { scale: 1.1 } }
                        whileTap = {
                            { scale: 0.9 } } >
                        <
                        FiChevronRight / >
                        <
                        /motion.button> <
                        /div>
                    )
                } <
                />
            )
        } <
        /div>

        { /* Footer με trending searches */ } <
        div className = "results-footer" >
        <
        div className = "trending-searches" >
        <
        FiTrendingUp / >
        <
        span > Trending now: < /span> <
        button className = "trending-tag" > Beachfront < /button> <
        button className = "trending-tag" > Spa < /button> <
        button className = "trending-tag" > Pool < /button> <
        button className = "trending-tag" > Luxury < /button> <
        /div> <
        /div> <
        /motion.div> <
        /motion.div>
    );
};

export default SearchResultsModal;