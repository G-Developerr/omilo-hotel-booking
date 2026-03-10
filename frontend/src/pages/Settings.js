import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiGlobe,
    FiDollarSign,
    FiNavigation,
    FiBell,
    FiMail,
    FiMoon,
    FiUser,
    FiLock,
    FiPhone,
    FiShield,
    FiTrash2,
    FiSave,
    FiLogOut,
    FiCheck,
    FiClock,
    FiSettings,
    FiSun,
} from "react-icons/fi";
import { useSettings } from "../components/SettingsContext";
import "./Settings.css";

const Toggle = ({ checked, onChange }) => ( <
    label className = "toggle" >
    <
    input type = "checkbox"
    checked = { checked }
    onChange = { onChange }
    /> <
    div className = "toggle-track" / >
    <
    div className = "toggle-thumb" / >
    <
    /label>
);

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    }),
};

const Settings = ({ currentUser, onLogout }) => {
    const { language, setLanguage, darkMode, setDarkMode } = useSettings();

    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);
    const [currency, setCurrency] = useState("USD");
    const [distanceUnit, setDistanceUnit] = useState("km");
    const [timezone, setTimezone] = useState("UTC+0");

    const [toast, setToast] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setToast(true);
            setTimeout(() => setToast(false), 3000);
        }, 600);
    };

    const handleReset = () => {
        if (window.confirm("Reset all settings to defaults?")) {
            setLanguage("english");
            setDarkMode(true);
            setNotifications(true);
            setEmailUpdates(true);
            setTwoFactor(false);
            setCurrency("USD");
            setDistanceUnit("km");
            setTimezone("UTC+0");
        }
    };

    const accountItems = [
        { label: "Email", value: "user@example.com", icon: < FiUser / > },
        { label: "Password", value: "••••••••••", icon: < FiLock / > },
        { label: "Phone", value: "+62 123 4567 890", icon: < FiPhone / > },
    ];

    return ( <
        div className = "settings" >
        <
        AnimatePresence > {
            toast && ( <
                motion.div className = "settings-toast"
                initial = {
                    { opacity: 0, x: 40, scale: 0.9 } }
                animate = {
                    { opacity: 1, x: 0, scale: 1 } }
                exit = {
                    { opacity: 0, x: 40, scale: 0.9 } }
                transition = {
                    { type: "spring", damping: 20 } } >
                <
                span className = "toast-icon" >
                <
                FiCheck / >
                <
                /span>
                Settings saved successfully <
                /motion.div>
            )
        } <
        /AnimatePresence>

        <
        motion.div className = "settings-head"
        initial = {
            { opacity: 0, y: -10 } }
        animate = {
            { opacity: 1, y: 0 } }
        transition = {
            { duration: 0.4 } } >
        <
        div className = "settings-head-icon" >
        <
        FiSettings / >
        <
        /div> <
        div >
        <
        h1 > Settings < /h1> <
        p > Manage your preferences and account < /p> <
        /div> <
        /motion.div>

        <
        motion.div className = "settings-profile-card"
        custom = { 0 }
        variants = { sectionVariants }
        initial = "hidden"
        animate = "visible" >
        <
        div className = "profile-avatar"
        style = {
            {
                background: currentUser ? currentUser.color + "22" : undefined,
                border: currentUser ? "2px solid " + currentUser.color : undefined,
                color: currentUser ? currentUser.color : undefined,
            }
        } > { currentUser ? currentUser.initials : "?" } <
        /div> <
        div className = "profile-info" >
        <
        h3 > { currentUser ? currentUser.name : "Guest" } < /h3> <
        p > { currentUser ? currentUser.email : "" } < /p> <
        span className = "profile-badge" > ✦{ currentUser ? currentUser.badge : "Member" } < /span> <
        /div> <
        div className = "profile-meta" >
        <
        span >
        <
        FiClock / > Joined Jan 2024 <
        /span> <
        /div> <
        /motion.div>

        { /* Appearance */ } <
        motion.div className = "settings-section"
        custom = { 1 }
        variants = { sectionVariants }
        initial = "hidden"
        animate = "visible" >
        <
        div className = "settings-section-title" >
        <
        span className = "section-icon" >
        <
        FiMoon / >
        <
        /span>
        Appearance <
        /div> <
        div className = "setting-row" >
        <
        div className = "setting-info" >
        <
        h4 > { darkMode ? < FiMoon / > : < FiSun / > }
        Dark Mode < /h4> <
        p > { darkMode ? "Currently active — dark theme" : "Currently active — light theme" } < /p> <
        /div> <
        Toggle checked = { darkMode }
        onChange = {
            () => setDarkMode(!darkMode) }
        /> <
        /div> <
        /motion.div>

        { /* Preferences */ } <
        motion.div className = "settings-section"
        custom = { 2 }
        variants = { sectionVariants }
        initial = "hidden"
        animate = "visible" >
        <
        div className = "settings-section-title" >
        <
        span className = "section-icon" >
        <
        FiGlobe / >
        <
        /span>
        Preferences <
        /div>

        <
        div className = "setting-row" >
        <
        div className = "setting-info" >
        <
        h4 >
        <
        FiGlobe / > Language <
        /h4> <
        p > Interface display language < /p> <
        /div> <
        select className = "settings-select"
        value = { language }
        onChange = {
            (e) => setLanguage(e.target.value) } >
        <
        option value = "english" > English < /option> <
        option value = "spanish" > Español < /option> <
        option value = "french" > Français < /option> <
        option value = "german" > Deutsch < /option> <
        option value = "japanese" > 日本語 < /option> <
        option value = "greek" > Ελληνικά < /option> <
        /select> <
        /div>

        <
        div className = "setting-row" >
        <
        div className = "setting-info" >
        <
        h4 >
        <
        FiDollarSign / > Currency <
        /h4> <
        p > Display prices in < /p> <
        /div> <
        select className = "settings-select"
        value = { currency }
        onChange = {
            (e) => setCurrency(e.target.value) } >
        <
        option value = "USD" > USD($) < /option> <
        option value = "EUR" > EUR(€) < /option> <
        option value = "GBP" > GBP(£) < /option> <
        option value = "JPY" > JPY(¥) < /option> <
        option value = "IDR" > IDR(Rp) < /option> <
        /select> <
        /div>

        <
        div className = "setting-row" >
        <
        div className = "setting-info" >
        <
        h4 >
        <
        FiNavigation / > Distance Unit <
        /h4> <
        p > Shown in nearby searches < /p> <
        /div> <
        select className = "settings-select"
        value = { distanceUnit }
        onChange = {
            (e) => setDistanceUnit(e.target.value) } >
        <
        option value = "km" > Kilometers(km) < /option> <
        option value = "miles" > Miles(mi) < /option> <
        /select> <
        /div>

        <
        div className = "setting-row" >
        <
        div className = "setting-info" >
        <
        h4 >
        <
        FiClock / > Timezone <
        /h4> <
        p > Your local timezone < /p> <
        /div> <
        select className = "settings-select"
        value = { timezone }
        onChange = {
            (e) => setTimezone(e.target.value) } >
        <
        option value = "UTC-12" > UTC− 12: 00 < /option> <
        option value = "UTC-8" > UTC− 08: 00(PST) < /option> <
        option value = "UTC-5" > UTC− 05: 00(EST) < /option> <
        option value = "UTC+0" > UTC± 00: 00(GMT) < /option> <
        option value = "UTC+1" > UTC + 01: 00(CET) < /option> <
        option value = "UTC+2" > UTC + 02: 00(EET) < /option> <
        option value = "UTC+5:30" > UTC + 05: 30(IST) < /option> <
        option value = "UTC+7" > UTC + 07: 00(WIB) < /option> <
        option value = "UTC+8" > UTC + 08: 00(CST) < /option> <
        option value = "UTC+9" > UTC + 09: 00(JST) < /option> <
        /select> <
        /div> <
        /motion.div>

        { /* Notifications */ } <
        motion.div className = "settings-section"
        custom = { 3 }
        variants = { sectionVariants }
        initial = "hidden"
        animate = "visible" >
        <
        div className = "settings-section-title" >
        <
        span className = "section-icon" >
        <
        FiBell / >
        <
        /span>
        Notifications <
        /div> <
        div className = "setting-row" >
        <
        div className = "setting-info" >
        <
        h4 >
        <
        FiBell / > Push Notifications <
        /h4> <
        p > Booking updates and offers < /p> <
        /div> <
        Toggle checked = { notifications }
        onChange = {
            () => setNotifications(!notifications) }
        /> <
        /div> <
        div className = "setting-row" >
        <
        div className = "setting-info" >
        <
        h4 >
        <
        FiMail / > Email Updates <
        /h4> <
        p > Newsletters and promotions < /p> <
        /div> <
        Toggle checked = { emailUpdates }
        onChange = {
            () => setEmailUpdates(!emailUpdates) }
        /> <
        /div> <
        /motion.div>

        { /* Account */ } <
        motion.div className = "settings-section"
        custom = { 4 }
        variants = { sectionVariants }
        initial = "hidden"
        animate = "visible" >
        <
        div className = "settings-section-title" >
        <
        span className = "section-icon" >
        <
        FiUser / >
        <
        /span>
        Account <
        /div> {
            accountItems.map(({ label, value, icon }) => ( <
                div key = { label }
                className = "setting-row" >
                <
                div className = "setting-info" >
                <
                h4 > { icon } { label } <
                /h4> <
                p > { value } < /p> <
                /div> <
                motion.button className = "settings-change-btn"
                whileHover = {
                    { scale: 1.05 } }
                whileTap = {
                    { scale: 0.95 } } >
                Change <
                /motion.button> <
                /div>
            ))
        } <
        div className = "setting-row" >
        <
        div className = "setting-info" >
        <
        h4 >
        <
        FiShield / > Two - Factor Authentication <
        /h4> <
        p > {
            twoFactor ?
            "Enabled — extra security active" :
                "Disabled — enable for extra security"
        } <
        /p> <
        /div> <
        Toggle checked = { twoFactor }
        onChange = {
            () => setTwoFactor(!twoFactor) }
        /> <
        /div> <
        /motion.div>

        { /* Danger Zone */ } <
        motion.div className = "settings-section danger-zone"
        custom = { 5 }
        variants = { sectionVariants }
        initial = "hidden"
        animate = "visible" >
        <
        div className = "settings-section-title danger" >
        <
        span className = "section-icon danger" >
        <
        FiTrash2 / >
        <
        /span>
        Danger Zone <
        /div> <
        div className = "setting-row" >
        <
        div className = "setting-info" >
        <
        h4 > Delete Account < /h4> <
        p > Permanently remove your account and all data < /p> <
        /div> <
        motion.button className = "delete-account-btn"
        whileHover = {
            { scale: 1.05 } }
        whileTap = {
            { scale: 0.95 } }
        onClick = {
            () => window.confirm("Are you sure?") && alert("Account deletion requested.") } >
        <
        FiTrash2 / > Delete <
        /motion.button> <
        /div> <
        /motion.div>

        { /* Actions */ } <
        motion.div className = "settings-actions"
        custom = { 6 }
        variants = { sectionVariants }
        initial = "hidden"
        animate = "visible" >
        <
        motion.button className = "save-btn"
        onClick = { handleSave }
        disabled = { saving }
        whileHover = {
            { y: -2 } }
        whileTap = {
            { scale: 0.97 } } > {
            saving ? ( <
                span className = "save-spinner" / >
            ) : ( <
                >
                <
                FiSave / > Save Changes <
                />
            )
        } <
        /motion.button> <
        motion.button className = "reset-btn"
        onClick = { handleReset }
        whileHover = {
            { y: -2 } }
        whileTap = {
            { scale: 0.97 } } >
        Reset <
        /motion.button> <
        motion.button className = "logout-btn"
        whileHover = {
            { y: -2 } }
        whileTap = {
            { scale: 0.97 } }
        onClick = {
            () => window.confirm("Log out?") && onLogout && onLogout() } >
        <
        FiLogOut / > Log Out <
        /motion.button> <
        /motion.div> <
        /div>
    );
};

export default Settings;