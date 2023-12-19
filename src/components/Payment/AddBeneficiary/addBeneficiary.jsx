import React, { useState } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'

import NavBar from "../../Common/Navbar/navbar"
import Footer from "../../Common/Footer/footer"
import LogoutApplication from "../../Logout/autoLogout";

import "../../Home/styles_home.css"
import "./styles_addBeneficiary.css"
import "../../Common/General/variables"

import * as FunctionCommon from "../../Common/General/commonFunctions"
import * as databaseQuery from "../../Firebase/dbQuery"

import { Navigate } from "react-router-dom";
/*Adding authentication check*/
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../Firebase/firebase";
import { collection, addDoc, query, where, getDocs, DocumentSnapshot, onSnapshot, QuerySnapshot } from 'firebase/firestore';


export default function AddBeneficiary() {

    const navigate = useNavigate();

    const dbRefAccount = collection(db, "userAccount");
    const dbRefAddBeneficiary = collection(db, "userBeneficiary");
    const dbRefTransaction = collection(db, "userTransaction");
    const [accountList, setAccountList] = useState([]);
    const [loading, setLoading] = useState(true);

    let currentUserID = null
    let currentUseremail = null

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is verified
                console.log("UID", user.uid + " - " + user.email);
                currentUserID = user.uid
                currentUseremail = user.email

                //Fetching Account Balances from Database
                const queryData = query(dbRefAccount,
                    where("username", "==", (currentUseremail)));
                const returnData = onSnapshot(queryData, (querySnapshot) => {
                    let letMyAccountList = []
                    querySnapshot.forEach((doc) => {
                        letMyAccountList.push({ ...doc.data(), id: doc.id });
                        console.log(doc.id, " ==> ", doc.data());
                    });
                    setAccountList(letMyAccountList);
                    console.log(accountList)
                });
                return () => returnData();

            } else {
                // User is signed out
                console.log("User is logged out. Please login! - addBen");
                navigate("/");
            }
        });
    }, []);

    const [beneficiaryName, setBeneficiaryName] = useState("");
    const [beneficiaryEmail, setBeneficiaryEmail] = useState("");
    const [beneficiaryRemarks, setBeneficiaryRemarks] = useState("");

    /*Add Beneficiary*/
    const submitAddBeneficiary = (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);

        let username = databaseQuery.currentUID().email
        console.log(username)

        //Adding Beneficiary Details To DB
        databaseQuery.addBeneficiaryToDB(
            beneficiaryName,
            beneficiaryEmail,
            beneficiaryRemarks)

        navigate("/payment")
    }


    return (
        <LogoutApplication>
            <form method="post" onSubmit={submitAddBeneficiary}>
                <div>
                    {/*Insert NavBar*/}
                    <NavBar />

                    <div className="helloUser">
                        {accountList.map((myAccountDetails) => (
                            <h3>Hello
                                <span> {myAccountDetails.firstname}</span>!</h3>
                        ))}
                    </div>

                    <div className="beneficiaryMain">

                        {/*Page Name*/}
                        <div className="beneficiaryDiv">
                            <p className="beneficiaryHeader">Add Beneficiary</p>
                        </div>

                        <div className="beneficiaryDetails">

                            {/*Table Left - beneficiary Main Information*/}
                            <div className="beneficiaryTableMain">
                                <table className="beneficiaryTableLeft">
                                    <tbody>
                                        <tr>
                                            <div className="beneficiaryName" id="beneficiaryNameID">
                                                <label className="beneficiaryNameLabel"
                                                    title="Enter beneficiary name">
                                                    <td className="column1">Beneficiary Name</td>
                                                    <td className="column2">
                                                        <input type="text" name="beneficiaryNameAmount"
                                                            title="Enter beneficiary name"
                                                            id="beneficiaryIDAmount"
                                                            value={beneficiaryName}
                                                            onChange={(e) => setBeneficiaryName(e.target.value)}
                                                            autoFocus
                                                            required
                                                            placeholder="Beneficiary name"
                                                            onInput={F => F.target.setCustomValidity('')}
                                                            onInvalid={F => F.target.setCustomValidity('Please enter beneficiary name here')}
                                                        />
                                                    </td>
                                                </label>
                                            </div>
                                        </tr>


                                        <tr>
                                            <div className="beneficiaryAccountNo" id="beneficiaryDiv">
                                                <label className="beneficiaryLabel"
                                                    title="Enter beneficiary email">
                                                    <td className="column1">Beneficiary Email</td>
                                                    <td className="column2">
                                                        <input type="email" name="beneficiaryNameAccountNo"
                                                            title="Enter beneficiary email"
                                                            id="beneficiaryIDAccountNo"
                                                            value={beneficiaryEmail}
                                                            onChange={(e) => setBeneficiaryEmail(e.target.value)}
                                                            placeholder="Beneficiary email"
                                                            required
                                                            onInput={F => F.target.setCustomValidity('')}
                                                            onInvalid={F => F.target.setCustomValidity('Please enter beneficiary email here')}

                                                        />
                                                    </td>
                                                </label>
                                            </div>
                                        </tr>

                                        <tr>
                                            <div className="beneficiaryRemarks" id="beneficiaryDiv">
                                                <label className="beneficiaryLabel"
                                                    title="Enter remarks (optional)">
                                                    <td className="column1">
                                                        Remarks <span className="optional">(Optional)</span>
                                                    </td>
                                                    <td className="column2">
                                                        <input type="text" name="beneficiaryNameRemarks"
                                                            id="beneficiaryIDRemarks"
                                                            value={beneficiaryRemarks}
                                                            onChange={(e) => setBeneficiaryRemarks(e.target.value)}
                                                            placeholder="Remarks (optional)" />
                                                    </td>
                                                </label>
                                            </div>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="beneficiaryMakebeneficiary" id="beneficiaryDiv">
                                <button type="submit" name="beneficiaryNameMakebeneficiary"
                                    id="beneficiaryIDMakebeneficiary">
                                    Add beneficiary
                                </button>
                            </div>
                        </div>
                    </div >
                </div >

                <div className="footer">
                    <footer className="footerText">
                        {/*Insert Footer*/}
                        <Footer />
                    </footer>
                </div>
            </form>
        </LogoutApplication>
    )
}