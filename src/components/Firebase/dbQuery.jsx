import { getAuth } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from "./firebase";
import { useState } from "react";

export const currentUID = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        return user
    }
    else {
        return null
    }
}

/* --------------------- */
/* Working with Firebase */
/* --------------------- */

//DB Reference and Table name
const dbRefAddBeneficiary = collection(db, "userBeneficiary");
const dbRefAccount = collection(db, "userAccount");
const dbRefTransaction = collection(db, "userTransaction");
const dbRefRole = collection(db, "userRole");

//Get userRole from userRole
export function getUserRole(currentUsername) {
    
    const queryUserData = query(dbRefRole,
        where("userName", "==", (currentUsername)));

    const returnUserRole = onSnapshot(queryUserData, (querySnapshot) => {

        let myUserRole = []
        querySnapshot.forEach((userDoc) => {
            myUserRole.push({ ...userDoc.data(), id: userDoc.id });
            
            return (myUserRole[0].userRole)
        });
    });    

}

//Adding addBeneficiary To DB
export const addBeneficiaryToDB =
    async (
        beneficiaryName,
        beneficiaryEmail,
        beneficiaryRemarks) => {

        try {
            await addDoc(dbRefAddBeneficiary,
                {
                    username: currentUID().email,
                    beneficiaryName: beneficiaryName,
                    beneficiaryEmail: beneficiaryEmail,
                    beneficiaryRemarks: beneficiaryRemarks
                });
            //console.log(dbRefAddBeneficiary);
            alert(beneficiaryName + " added to your database.")
        }

        catch (error) {
            console.error(error);
        };
    };

