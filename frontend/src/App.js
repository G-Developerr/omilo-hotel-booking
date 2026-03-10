import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import "./App.css";
import { SettingsProvider } from "./components/SettingsContext";
import LoginScreen from "./components/LoginScreen";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/MyBookings";
import Notifications from "./pages/Notifications";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";

// localStorage helpers — ανά user
const storageKey = (userId) => "omilo_bookings_" + userId;

const loadBookings = (userId) => {
    try {
        const raw = localStorage.getItem(storageKey(userId));
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
};

const saveBookings = (userId, bookings) => {
    try {
        localStorage.setItem(storageKey(userId), JSON.stringify(bookings));
    } catch (e) {}
};

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [activeView, setActiveView] = useState("dashboard");
    const [bookings, setBookings] = useState([]);

    // Φόρτωση bookings όταν κάνει login
    const handleLogin = (account) => {
        setCurrentUser(account);
        setActiveView("dashboard");
        setBookings(loadBookings(account.id));
    };

    // Αποθήκευση στο localStorage κάθε φορά που αλλάζουν τα bookings
    useEffect(() => {
        if (currentUser) {
            saveBookings(currentUser.id, bookings);
        }
    }, [bookings, currentUser]);

    const handleLogout = () => {
        setCurrentUser(null);
        setBookings([]);
        setActiveView("dashboard");
    };

    const handleMenuChange = (view) => setActiveView(view);

    const addBooking = (hotel, searchData) => {
        setBookings((prev) => [{
                id: Date.now(),
                hotel,
                searchData: {
                    ...searchData,
                    checkIn: searchData.checkIn instanceof Date ?
                        searchData.checkIn.toISOString() :
                        searchData.checkIn,
                    checkOut: searchData.checkOut instanceof Date ?
                        searchData.checkOut.toISOString() :
                        searchData.checkOut,
                },
                bookedAt: new Date().toISOString(),
            },
            ...prev,
        ]);
    };

    const cancelBooking = (id) => {
        setBookings((prev) => prev.filter((b) => b.id !== id));
    };

    const renderView = () => {
        switch (activeView) {
            case "dashboard":
                return <Dashboard onBookingConfirmed = { addBooking }
                onMenuChange = { handleMenuChange }
                />;
            case "explore":
                return <MyBookings bookings = { bookings }
                onCancel = { cancelBooking }
                />;
            case "notifications":
                return <Notifications / > ;
            case "favorites":
                return <Favorites onBookingConfirmed = { addBooking }
                />;
            case "settings":
                return <Settings onLogout = { handleLogout }
                currentUser = { currentUser }
                />;
            default:
                return <Dashboard onBookingConfirmed = { addBooking }
                onMenuChange = { handleMenuChange }
                />;
        }
    };

    return ( <
        SettingsProvider >
        <
        Toaster position = "top-right"
        toastOptions = {
            {
                duration: 4000,
                style: {
                    background: "var(--surface2)",
                    color: "var(--text)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r-md)",
                    fontFamily: "var(--font-body)",
                },
                success: { icon: "✨", style: { borderColor: "var(--gold)" } },
                error: { icon: "❌", style: { borderColor: "var(--red)" } },
            }
        }
        />

        <
        AnimatePresence mode = "wait" > {!currentUser ? ( <
                motion.div key = "login"
                initial = {
                    { opacity: 0 } }
                animate = {
                    { opacity: 1 } }
                exit = {
                    { opacity: 0, scale: 0.97 } }
                transition = {
                    { duration: 0.35 } }
                style = {
                    { position: "fixed", inset: 0, zIndex: 9999 } } >
                <
                LoginScreen onLogin = { handleLogin }
                /> <
                /motion.div>
            ) : ( <
                motion.div key = "app"
                className = "app"
                initial = {
                    { opacity: 0, scale: 1.02 } }
                animate = {
                    { opacity: 1, scale: 1 } }
                transition = {
                    { duration: 0.4 } } >
                <
                Sidebar activeId = { activeView }
                onMenuChange = { handleMenuChange }
                currentUser = { currentUser }
                /> <
                motion.div className = "main-content"
                key = { activeView }
                initial = {
                    { opacity: 0, x: 20 } }
                animate = {
                    { opacity: 1, x: 0 } }
                exit = {
                    { opacity: 0, x: -20 } }
                transition = {
                    { duration: 0.3, ease: "easeInOut" } } > { renderView() } <
                /motion.div> <
                /motion.div>
            )
        } <
        /AnimatePresence> <
        /SettingsProvider>
    );
}

export default App;