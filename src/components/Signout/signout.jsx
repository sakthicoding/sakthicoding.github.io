import React from "react";

import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/firebase";
//import useTimeout from "../useTimeout"

export default function Signout() {
   // useTimeout(() => alert('Your session timed out!'), 10000);

    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                alert("Thank you for using Hakuna Matata Banking Application!")
                console.log("Signed out successfully");
                navigate("/");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            {handleLogout}
        </>
    )
}