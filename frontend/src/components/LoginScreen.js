import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight, FiStar } from "react-icons/fi";
import "./LoginScreen.css";

const ACCOUNTS = [{
        id: 1,
        name: "Katherine Smith",
        email: "katherine@omilo.com",
        password: "kate123",
        initials: "KS",
        role: "Traveler Enthusiast",
        badge: "Gold Member",
        color: "#d4a853",
        trips: 12,
    },
    {
        id: 2,
        name: "Alex Papadopoulos",
        email: "alex@omilo.com",
        password: "alex123",
        initials: "AP",
        role: "Business Traveler",
        badge: "Platinum Member",
        color: "#8b5cf6",
        trips: 28,
    },
    {
        id: 3,
        name: "Sofia Nakamura",
        email: "sofia@omilo.com",
        password: "sofia123",
        initials: "SN",
        role: "Adventure Seeker",
        badge: "Silver Member",
        color: "#3b82f6",
        trips: 6,
    },
];

const LoginScreen = ({ onLogin }) => {
        const [mode, setMode] = useState("accounts"); // "accounts" | "manual"
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [showPass, setShowPass] = useState(false);
        const [error, setError] = useState("");
        const [loading, setLoading] = useState(false);

        const doLogin = (account) => {
            setLoading(true);
            setError("");
            setTimeout(() => {
                setLoading(false);
                onLogin(account);
            }, 700);
        };

        const handleManualLogin = (e) => {
            e.preventDefault();
            const found = ACCOUNTS.find(
                (a) => a.email === email && a.password === password
            );
            if (found) {
                doLogin(found);
            } else {
                setError("Invalid email or password.");
            }
        };

        return ( <
            div className = "login-root" > { /* Background blobs */ } <
            div className = "login-blob login-blob-1" / >
            <
            div className = "login-blob login-blob-2" / >
            <
            div className = "login-blob login-blob-3" / >

            <
            motion.div className = "login-card"
            initial = {
                { opacity: 0, y: 32, scale: 0.96 } }
            animate = {
                { opacity: 1, y: 0, scale: 1 } }
            transition = {
                { duration: 0.5, ease: [0.4, 0, 0.2, 1] } } >
            { /* Logo */ } <
            div className = "login-logo" >
            <
            svg viewBox = "0 0 24 24"
            fill = "currentColor" >
            <
            path d = "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" / >
            <
            /svg> <
            span > Omilo < /span> <
            /div>

            <
            h1 className = "login-title" > Welcome back < /h1> <
            p className = "login-sub" > Sign in to
            continue your journey < /p>

            { /* Tab switcher */ } <
            div className = "login-tabs" >
            <
            button className = { `login-tab${mode === "accounts" ? " active" : ""}` }
            onClick = {
                () => { setMode("accounts");
                    setError(""); } } >
            <
            FiUser / > Quick Login <
            /button> <
            button className = { `login-tab${mode === "manual" ? " active" : ""}` }
            onClick = {
                () => { setMode("manual");
                    setError(""); } } >
            <
            FiMail / > Email & Password <
            /button> <
            /div>

            <
            AnimatePresence mode = "wait" > {
                mode === "accounts" ? ( <
                    motion.div key = "accounts"
                    initial = {
                        { opacity: 0, x: -16 } }
                    animate = {
                        { opacity: 1, x: 0 } }
                    exit = {
                        { opacity: 0, x: 16 } }
                    transition = {
                        { duration: 0.25 } } >
                    <
                    p className = "login-hint" > Choose an account to sign in: < /p> <
                    div className = "login-account-list" > {
                        ACCOUNTS.map((acc, i) => ( <
                            motion.button key = { acc.id }
                            className = "login-account-card"
                            onClick = {
                                () => doLogin(acc) }
                            initial = {
                                { opacity: 0, y: 16 } }
                            animate = {
                                { opacity: 1, y: 0 } }
                            transition = {
                                { delay: i * 0.08 } }
                            whileHover = {
                                { scale: 1.02, x: 4 } }
                            whileTap = {
                                { scale: 0.98 } }
                            disabled = { loading } >
                            <
                            div className = "login-acc-avatar"
                            style = {
                                { background: `${acc.color}22`, border: `2px solid ${acc.color}` } } >
                            <
                            span style = {
                                { color: acc.color } } > { acc.initials } < /span> <
                            /div> <
                            div className = "login-acc-info" >
                            <
                            strong > { acc.name } < /strong> <
                            span > { acc.role } < /span> <
                            div className = "login-acc-meta" >
                            <
                            span className = "login-badge"
                            style = {
                                { color: acc.color, background: `${acc.color}20` } } > ✦{ acc.badge } <
                            /span> <
                            span className = "login-trips" > < FiStar / > { acc.trips }
                            trips < /span> <
                            /div> <
                            /div> <
                            FiArrowRight className = "login-acc-arrow" / >
                            <
                            /motion.button>
                        ))
                    } <
                    /div> <
                    /motion.div>
                ) : ( <
                        motion.div key = "manual"
                        initial = {
                            { opacity: 0, x: 16 } }
                        animate = {
                            { opacity: 1, x: 0 } }
                        exit = {
                            { opacity: 0, x: -16 } }
                        transition = {
                            { duration: 0.25 } } >
                        <
                        p className = "login-hint" > Or sign in with your credentials: < /p> <
                        form className = "login-form"
                        onSubmit = { handleManualLogin } >
                        <
                        div className = "login-field" >
                        <
                        FiMail className = "login-field-icon" / >
                        <
                        input type = "email"
                        placeholder = "Email address"
                        value = { email }
                        onChange = {
                            (e) => setEmail(e.target.value) }
                        autoComplete = "email"
                        required /
                        >
                        <
                        /div> <
                        div className = "login-field" >
                        <
                        FiLock className = "login-field-icon" / >
                        <
                        input type = { showPass ? "text" : "password" }
                        placeholder = "Password"
                        value = { password }
                        onChange = {
                            (e) => setPassword(e.target.value) }
                        required /
                        >
                        <
                        button type = "button"
                        className = "login-eye"
                        onClick = {
                            () => setShowPass(!showPass) } > { showPass ? < FiEyeOff / > : < FiEye / > } <
                        /button> <
                        /div>

                        {
                            error && ( <
                                motion.p className = "login-error"
                                initial = {
                                    { opacity: 0, y: -8 } }
                                animate = {
                                    { opacity: 1, y: 0 } } > { error } <
                                /motion.p>
                            )
                        }

                        <
                        div className = "login-creds-hint" >
                        <
                        p > Demo accounts: < /p> {
                            ACCOUNTS.map(a => ( <
                                span key = { a.id }
                                onClick = {
                                    () => { setEmail(a.email);
                                        setPassword(a.password); } } > { a.email } <
                                /span>
                            ))
                        } <
                        /div>

                        <
                        motion.button type = "submit"
                        className = "login-submit"
                        whileHover = {
                            { y: -2 } }
                        whileTap = {
                            { scale: 0.97 } }
                        disabled = { loading } >
                        {
                            loading ? < span className = "login-spinner" / > : < > Sign In < FiArrowRight / > < />} <
                                /motion.button> <
                                /form> <
                                /motion.div>
                        )
                    } <
                    /AnimatePresence> <
                    /motion.div> <
                    /div>
            );
        };

        export { ACCOUNTS };
        export default LoginScreen;