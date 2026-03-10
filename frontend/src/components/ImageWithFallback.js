import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import imageService from "../services/imageService";
import "./ImageWithFallback.css";

const ImageWithFallback = ({
    src,
    alt,
    fallbackSrc = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    imageObj,
    className = "",
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        setImgSrc(src);
        setIsLoading(true);
        setError(false);
        setRetryCount(0);
    }, [src]);

    const handleError = () => {
        console.log("Image failed to load:", imgSrc);

        // Σημείωσε το URL ως αποτυχημένο
        if (imgSrc) {
            imageService.markAsFailed(imgSrc);
        }

        // Προσπάθησε με fallback
        if (imageObj && imageObj.fallback && retryCount === 0) {
            setImgSrc(imageObj.fallback);
            setRetryCount(1);
        }
        // Αν το fallback αποτύχει, χρησιμοποίησε το default fallback
        else if (retryCount === 1) {
            setImgSrc(fallbackSrc);
            setRetryCount(2);
        }
        // Ακόμα κι αν το default αποτύχει, δείξε error
        else {
            setError(true);
            setIsLoading(false);
        }
    };

    const handleLoad = () => {
        setIsLoading(false);
        setError(false);
    };

    // Αν το src έχει αποτύχει στο παρελθόν, χρησιμοποίησε κατευθείαν fallback
    const getInitialSrc = () => {
        if (src && imageService.hasFailed(src) && imageObj && imageObj.fallback) {
            return imageObj.fallback;
        }
        return src || fallbackSrc;
    };

    const imageSource = getInitialSrc();

    return ( <
        div className = { `image-container ${className}` } > {
            isLoading && ( <
                motion.div className = "image-skeleton"
                animate = {
                    { opacity: [0.5, 0.8, 0.5] } }
                transition = {
                    { duration: 1.5, repeat: Infinity } }
                />
            )
        }

        <
        img src = { imageSource }
        alt = { alt || "Image" }
        onLoad = { handleLoad }
        onError = { handleError }
        className = { `image ${isLoading ? "loading" : "loaded"}` }
        loading = "lazy" {...props }
        />

        {
            error && !isLoading && ( <
                div className = "image-error" >
                <
                span > 🏨 < /span> <
                p > { alt || "Hotel" } < /p> <
                /div>
            )
        } <
        /div>
    );
};

export default ImageWithFallback;