import React, { Component, useState } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'

//import { auth } from '../../Firebase/firebase'
//import { onAuthStateChanged } from "firebase/auth";


//Custom alert
//https://github.com/gusrb3164/react-custom-alert

/*-----------------
Default File Pathts
-------------------*/



/*---------------
Payment Functions
-----------------*/

export function oncanplay(event) {
    return this.play()
}

export function onloadedmetadata(event) {
    this.muted = true
    return this
}

export const randomNumberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomNumberZeroToMax = (max) => {
    return Math.floor(Math.random() * max);
}

/*export function currentUserID () {
    console.log("I am at currentUSerID");
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("I am inside if");
            console.log(user.uid);
            return user.uid
        } else {
            console.log("I am inside else");
            console.log("User is logged out. Please login!");
        }
        console.log("I am exited");
    })
}*/

export function confirmAction(confirmMessage) {
    let confirmAction;
    if (window.confirm(confirmMessage) == true) {
        confirmAction = true
    } else {
        confirmAction = false
    }
    return confirmAction
}

export const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
