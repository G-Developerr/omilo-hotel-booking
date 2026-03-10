import React, { useState } from "react";
import "./Notifications.css";

const CheckIcon = () => ( <
    svg viewBox = "0 0 24 24"
    fill = "none"
    stroke = "currentColor"
    strokeWidth = "2"
    strokeLinecap = "round"
    strokeLinejoin = "round" >
    <
    polyline points = "20 6 9 17 4 12" / >
    <
    /svg>
);

const TagIcon = () => ( <
    svg viewBox = "0 0 24 24"
    fill = "none"
    stroke = "currentColor"
    strokeWidth = "1.8"
    strokeLinecap = "round"
    strokeLinejoin = "round" >
    <
    path d = "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" / >
    <
    line x1 = "7"
    y1 = "7"
    x2 = "7.01"
    y2 = "7" / >
    <
    /svg>
);

const ClockIcon = () => ( <
    svg viewBox = "0 0 24 24"
    fill = "none"
    stroke = "currentColor"
    strokeWidth = "1.8"
    strokeLinecap = "round"
    strokeLinejoin = "round" >
    <
    circle cx = "12"
    cy = "12"
    r = "10" / >
    <
    polyline points = "12 6 12 12 16 14" / >
    <
    /svg>
);

const ICONS = { booking: < CheckIcon / > , offer: < TagIcon / > , reminder: < ClockIcon / > };

const INIT = [{
        id: 1,
        type: "booking",
        title: "Booking Confirmed",
        msg: "Your reservation at Shikara Hotel has been confirmed.",
        time: "2 hours ago",
        read: false,
    },
    {
        id: 2,
        type: "offer",
        title: "Limited Time Offer",
        msg: "Save 45% on your next booking — expires this weekend.",
        time: "5 hours ago",
        read: false,
    },
    {
        id: 3,
        type: "reminder",
        title: "Check-in Tomorrow",
        msg: "Your check-in at Visala Hotel is scheduled for tomorrow at 14:00.",
        time: "1 day ago",
        read: true,
    },
];

const Notifications = () => {
        const [items, setItems] = useState(INIT);
        const unread = items.filter((i) => !i.read).length;

        return ( <
            div className = "notifs" >
            <
            div className = "notifs-head" >
            <
            h1 > Notifications < /h1> <
            div className = "notifs-actions" > {
                unread > 0 && < span className = "notif-count" > { unread }
                new < /span>} <
                button
                className = "mark-read-btn"
                onClick = {
                    () => setItems(items.map((i) => ({...i, read: true }))) } >
                Mark all read <
                /button> <
                /div> <
                /div>

                <
                div className = "notif-list" > {
                    items.map((n) => ( <
                        div key = { n.id }
                        className = { `notif-item${!n.read ? " unread" : ""}` }
                        onClick = {
                            () => setItems(items.map((i) => (i.id === n.id ? {...i, read: true } : i))) } >
                        <
                        div className = "notif-icon" > { ICONS[n.type] } < /div> <
                        div className = "notif-body" >
                        <
                        div className = "notif-title" > { n.title } < /div> <
                        div className = "notif-msg" > { n.msg } < /div> <
                        div className = "notif-meta" >
                        <
                        span className = "notif-time" > { n.time } < /span> <
                        button className = "notif-del"
                        onClick = {
                            (e) => {
                                e.stopPropagation();
                                setItems(items.filter((i) => i.id !== n.id));
                            }
                        } >
                        Remove <
                        /button> <
                        /div> <
                        /div> <
                        /div>
                    ))
                } <
                /div> <
                /div>
            );
        };

        export default Notifications;