import React from "react";
import "./Sidebar.css";
import { useSettings } from "./SettingsContext";

const icons = {
    dashboard: ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "1.8"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        rect x = "3"
        y = "3"
        width = "7"
        height = "7"
        rx = "1.5" / >
        <
        rect x = "14"
        y = "3"
        width = "7"
        height = "7"
        rx = "1.5" / >
        <
        rect x = "3"
        y = "14"
        width = "7"
        height = "7"
        rx = "1.5" / >
        <
        rect x = "14"
        y = "14"
        width = "7"
        height = "7"
        rx = "1.5" / >
        <
        /svg>
    ),
    explore: ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "1.8"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        circle cx = "12"
        cy = "12"
        r = "9" / >
        <
        polygon points = "16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88"
        fill = "currentColor"
        stroke = "none" /
        >
        <
        /svg>
    ),
    notifications: ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "1.8"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        path d = "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" / >
        <
        path d = "M13.73 21a2 2 0 0 1-3.46 0" / >
        <
        /svg>
    ),
    favorites: ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "1.8"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        path d = "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" / >
        <
        /svg>
    ),
    settings: ( <
        svg viewBox = "0 0 24 24"
        fill = "none"
        stroke = "currentColor"
        strokeWidth = "1.8"
        strokeLinecap = "round"
        strokeLinejoin = "round" >
        <
        circle cx = "12"
        cy = "12"
        r = "3" / >
        <
        path d = "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" / >
        <
        /svg>
    ),
};

const menuItems = [
    { id: "dashboard", labelKey: "dashboard" },
    { id: "explore", labelKey: "explore" },
    { id: "notifications", labelKey: "notifications", badge: true },
    { id: "favorites", labelKey: "favorites" },
    { id: "settings", labelKey: "settings" },
];

const Sidebar = ({ activeId, onMenuChange, currentUser }) => {
    const { t } = useSettings();
    const avatarColor = currentUser ? currentUser.color : "#d4a853";
    const avatarInitials = currentUser ? currentUser.initials : "?";

    return ( <
        aside className = "sidebar" >
        <
        div className = "sb-logo" >
        <
        svg viewBox = "0 0 24 24"
        fill = "currentColor" >
        <
        path d = "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" / >
        <
        /svg> <
        /div> <
        nav className = "sb-nav" > {
            menuItems.map(({ id, labelKey, badge }) => ( <
                button key = { id }
                className = { "sb-btn" + (activeId === id ? " active" : "") }
                title = { t(labelKey) }
                onClick = {
                    () => onMenuChange(id) } > { icons[id] } { badge && < span className = "sb-dot" / > } <
                /button>
            ))
        } <
        /nav> <
        button className = { "sb-avatar-btn" + (activeId === "settings" ? " active" : "") }
        title = "Profile & Settings"
        onClick = {
            () => onMenuChange("settings") } >
        <
        span style = {
            { color: avatarColor } } > { avatarInitials } < /span> <
        /button> <
        /aside>
    );
};

export default Sidebar;