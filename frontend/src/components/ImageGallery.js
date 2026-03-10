import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import ImageWithFallback from './ImageWithFallback';
import './ImageGallery.css';

const ImageGallery = ({ images, initialIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handlePrevious = useCallback((e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }, [images.length]);

    const handleNext = useCallback((e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }, [images.length]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') handlePrevious(e);
        if (e.key === 'ArrowRight') handleNext(e);
    }, [onClose, handlePrevious, handleNext]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!images || images.length === 0) return null;

    // Safe access to image URL - ΧΩΡΙΣ optional chaining
    const getCurrentImageUrl = () => {
        const currentImage = images[currentIndex];
        if (!currentImage) return null;

        // Προσπάθεια να πάρουμε large ή url
        if (currentImage.large) {
            return currentImage.large;
        }
        if (currentImage.url) {
            return currentImage.url;
        }
        return currentImage; // αν είναι string
    };

    const getThumbnailUrl = (img) => {
        if (!img) return null;
        if (img.url) return img.url;
        if (img.thumb) return img.thumb;
        return img; // αν είναι string
    };

    return ( <
        motion.div className = "gallery-overlay"
        initial = {
            { opacity: 0 } }
        animate = {
            { opacity: 1 } }
        exit = {
            { opacity: 0 } }
        onClick = { onClose } >
        <
        div className = "gallery-container"
        onClick = {
            (e) => e.stopPropagation() } >
        <
        motion.button className = "gallery-close"
        onClick = { onClose }
        whileHover = {
            { rotate: 90, scale: 1.1 } }
        whileTap = {
            { scale: 0.9 } } >
        <
        FiX / >
        <
        /motion.button>

        <
        div className = "gallery-main" >
        <
        AnimatePresence mode = "wait" >
        <
        motion.div key = { currentIndex }
        className = "gallery-image"
        initial = {
            { opacity: 0, x: 100 } }
        animate = {
            { opacity: 1, x: 0 } }
        exit = {
            { opacity: 0, x: -100 } }
        transition = {
            { type: "spring", stiffness: 300 } } >
        <
        ImageWithFallback src = { getCurrentImageUrl() }
        alt = { `Gallery image ${currentIndex + 1}` }
        /> <
        /motion.div> <
        /AnimatePresence>

        {
            images.length > 1 && ( <
                >
                <
                motion.button className = "gallery-nav prev"
                onClick = { handlePrevious }
                whileHover = {
                    { scale: 1.1 } }
                whileTap = {
                    { scale: 0.9 } } >
                <
                FiChevronLeft / >
                <
                /motion.button> <
                motion.button className = "gallery-nav next"
                onClick = { handleNext }
                whileHover = {
                    { scale: 1.1 } }
                whileTap = {
                    { scale: 0.9 } } >
                <
                FiChevronRight / >
                <
                /motion.button> <
                />
            )
        } <
        /div>

        <
        div className = "gallery-thumbnails" > {
            images.map((img, idx) => ( <
                motion.div key = { idx }
                className = { `thumbnail ${idx === currentIndex ? 'active' : ''}` }
                onClick = {
                    () => setCurrentIndex(idx) }
                whileHover = {
                    { scale: 1.05 } }
                whileTap = {
                    { scale: 0.95 } } >
                <
                ImageWithFallback src = { getThumbnailUrl(img) }
                alt = { `Thumbnail ${idx + 1}` }
                /> <
                /motion.div>
            ))
        } <
        /div>

        <
        div className = "gallery-counter" > { currentIndex + 1 }
        / {images.length} <
        /div> <
        /div> <
        /motion.div>
    );
};

export default ImageGallery;