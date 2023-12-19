import React, { useEffect } from "react";


const events = [
    "load",
    "mousemove",
    "mousedown",
    "click",
    "scroll",
    "keypress",
];

export default function LogoutApplication ({ children }) {
    let timer;

    useEffect(() => {
        Object.values(events).forEach((item) => {
            window.addEventListener(item, () => {
                resetTimer();
                handleTimer();
            });
        });
    }, []);

    const resetTimer = () => {
        if (timer) clearTimeout(timer);
    };

    const handleTimer = () => {
        timer = setTimeout(() => {
            resetTimer();
            Object.values(events).forEach((item) => {
                window.removeEventListener(item, resetTimer);
            });
            logoutAction();
        }, ((1000)*(60*5))); //1000 ms = 1 sec
    };

    const logoutAction = () => {
        localStorage.clear();
        window.location.pathname = "/";
    };

    return children;
};