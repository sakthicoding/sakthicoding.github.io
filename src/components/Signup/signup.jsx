import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from "../Firebase/firebase";


import Footer from "../Common/Footer/footer"
import "./styles_signup.css"
import * as FunctionCommon from "../Common/General/commonFunctions"
import ImageLogo from "../../img/logo.svg"

export default function Signup() {

    /*------------
    Signup Handler
    ------------*/
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [amountChequing, setAmountChequing] = useState(0);
    const [amountSavings, setAmountSavings] = useState(0);
    const [amountTFS, setAmountTFS] = useState(0);
    const [statusSavings, setStatusSavings] = useState(false);
    const [statusTFS, setStatusTFS] = useState(false);
    const dateToday = new Date()

    const dbRefTransaction = collection(db, "userTransaction");

    const userAccountRef = collection(db, "userAccount");
    const userRoleRef = collection(db, "userRole");

    const submitSignup = async (e) => {
        e.preventDefault();

        if (amountChequing > 0) {
            /*const form = e.target;
            const formData = new FormData(form);

            const formJson = Object.fromEntries(formData.entries());
            console.log(formJson);*/

            // Signing up
            let loginMsg;
            await createUserWithEmailAndPassword(auth, username, password)
                .then((userCredential) => {

                    //Adding Signup Data to DB
                    addSignupToDB();

                    // Signed in confirmation
                    loginMsg = "Successfully signed up! Please login to continue."

                    const user = userCredential.user;
                    console.log(user.uid);
                    navigate("/");
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log("error code " + errorCode + " error message " + errorMessage);

                    if (errorCode == "auth/email-already-in-use") {
                        loginMsg = "Signup unsuccessful! \n\n" +
                            "Useremail is already in use. Please try with a new email or login to proceed."
                    }

                    else {
                        loginMsg = "Signup unsuccessful! \nPlease try again later."
                    }

                });
            alert(loginMsg)
        }
        else {
            alert("Please select Chequing amount")
        }
    }

    //Adding signin values to database
    const addSignupToDB = async () => {
        try {
            //Add user details to userAccount
            await addDoc(userAccountRef,
                {
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    amountChequing: parseInt(amountChequing),
                    amountSavings: parseInt(amountSavings),
                    amountTFS: parseInt(amountTFS),
                    statusSavings: (parseInt(amountSavings) === 0 ? false : true),
                    statusTFS: (parseInt(amountTFS) === 0 ? false : true) //amountTFS === "0" ? false : true
                });

            //Add Initial Transaction to Transaction Table
            for (let i = 1; i <= 3; i++) {
                let accountName = ((i == 1) ? "Checking" : (i == 2) ? "Savings" : "TFS");
                let accountAmount = parseInt(((i == 1) ? amountChequing : (i == 2) ? amountSavings : amountTFS));

                if (accountAmount != 0) {
                    addTransactionToDB(
                        accountAmount,
                        dateToday,
                        "Onetime",
                        "Signup Cash Deposit",
                        dateToday,
                        "",
                        dateToday,
                        "Signup Cash Deposit",
                        accountName,
                        username)
                }
            }
            //Add user role to userRole
            await setDoc(doc(db, "userRole", username), {
                userRole: "user"
            });
            console.log("Document written with ID: ", doc.id);

        }
        catch (error) {
            console.error(error);
        };
    }

    //Adding Transaction Details To DB
    const addTransactionToDB =
        async (
            transAmount,
            transDate,
            transFreq,
            transFrom,
            transRecEndDate,
            transRecInterval,
            transRecStartDate,
            transRemarks,
            transTo,
            transUsername
        ) => {

            try {
                await addDoc(dbRefTransaction,
                    {
                        transAmount: transAmount,
                        transDate: transDate,
                        transFreq: transFreq,
                        transFrom: transFrom,
                        transRecEndDate: transRecEndDate,
                        transRecInterval: transRecInterval,
                        transRecStartDate: transRecStartDate,
                        transRemarks: transRemarks,
                        transTo: transTo,
                        transUsername: transUsername
                    });
                //console.log(dbRefTransaction);
            }

            catch (error) {
                console.error(error);
            };
        };


    return (
        <form method="post" onSubmit={submitSignup}>
            <div className="imageLogoFrame">
                <img className="imageLogo" src={ImageLogo} alt="errorImage" />
            </div>

            <div className="signupFrame">

                {/*video player*/}
                <div className="side_Left_BankingVideo">
                    <div className="videoFrame">
                        <video className="video_box" width="1200"
                            loop muted autoPlay controls=''
                            poster={"./img/" + FunctionCommon.randomNumberInRange(1, 12) + ".png"}
                            oncanplay onloadedmetadata >
                            <source src={"/video/" + FunctionCommon.randomNumberInRange(1, 12) + ".mp4"}
                                type="video/mp4" />
                        </video>
                    </div>
                </div>

                <div className="side_Right_signup">
                    <div className="signupInput">

                        <div className="signupHeadBankDetails">
                            <div className="signupWelcome">
                                <h2 className="signupWelcomeMessage">Welcome to</h2>
                            </div>

                            <div className="signupBankName">
                                <h1 className="signupBankNameText">Hakuna Matata Bank</h1>
                            </div>
                        </div>

                        <div className="signup_input_info">
                            {/*Table Left - signup Main Information*/}
                            <div className="signupClassTableMain">
                                <table className="signupClassTable">
                                    <tr>
                                        <div className="signupClassFirstName" id="signupIDFirstName">
                                            <label className="signupClassLabel"
                                                title="Enter your Firstname">
                                                <td className="column1">Firstname
                                                </td>
                                                <td className="column2">
                                                    <input type="text" name="signupFirstName"
                                                        id="signupFirstNameID"
                                                        placeholder="Firstname"
                                                        required
                                                        onInput={F => F.target.setCustomValidity('')}
                                                        onInvalid={F => F.target.setCustomValidity('Mandatory: Please enter your Firstname')}
                                                        value={firstname}
                                                        onChange={(e) => setFirstname(e.target.value)}
                                                        autoFocus />
                                                </td>
                                            </label>
                                        </div>
                                    </tr>

                                    <tr>
                                        <div className="signupClassLastName" id="signupIDLastName">
                                            <label className="signupClassLabel"
                                                title="Enter your Lastname">
                                                <td className="column1">Lastname
                                                </td>
                                                <td className="column2">
                                                    <input type="text" name="signupLastName"
                                                        id="signupLastNameID"
                                                        value={lastname}
                                                        required
                                                        onInput={F => F.target.setCustomValidity('')}
                                                        onInvalid={F => F.target.setCustomValidity('Mandatory: Please enter your Lastname')}
                                                        onChange={(e) => setLastname(e.target.value)}
                                                        placeholder="Lastname" />
                                                </td>
                                            </label>
                                        </div>
                                    </tr>

                                    <tr>
                                        <div className="signupClassUserName" id="signupIDUserName">
                                            <label className="signupClassLabel"
                                                title="Enter your Username or email">
                                                <td className="column1">Username
                                                </td>
                                                <td className="column2">
                                                    <input type="email" name="signupUserName"
                                                        id="signupUserNameID"
                                                        value={username}
                                                        required
                                                        onInput={F => F.target.setCustomValidity('')}
                                                        onInvalid={F => F.target.setCustomValidity('Mandatory: Please enter your email')}
                                                        onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                                        placeholder="User email" />
                                                </td>
                                            </label>
                                        </div>
                                    </tr>

                                    <tr>
                                        <div className="signupClassPassword" id="signupIDPassword">
                                            <label className="signupClassLabel"
                                                title="Enter your password">
                                                <td className="column1">Password
                                                </td>
                                                <td className="column2">
                                                    <input type="password" name="signupPassword"
                                                        id="signupPasswordID"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        onInput={F => F.target.setCustomValidity('')}
                                                        onInvalid={F => F.target.setCustomValidity('Mandatory: Please enter your password')}
                                                        placeholder="Password" />
                                                </td>
                                            </label>
                                        </div>
                                    </tr>

                                    <div className="signupAccountSelection">
                                        <div className="signupAccountSelectionTitle">Select account options</div>
                                        <tr>
                                            <div className="signupClassChequing" id="signupClassChequingID">
                                                <label className="signupClassChequingLabel"
                                                    title="Select cash deposit amount for your Chequing Account"
                                                >
                                                    <td className="column1">Chequing A/C
                                                    </td>
                                                    <td className="column2">
                                                        <span id="signupInputChequing">
                                                            <select name="signupInputChequingList"
                                                                onChange={(e) => setAmountChequing(e.target.value)}>
                                                                <option value={0} selected>Chequing Amount</option>
                                                                <option value={500}>$ 500</option>
                                                                <option value={1000}>$ 1000</option>
                                                                <option value={1500}>$ 1500</option>
                                                                <option value={2000}>$ 2000</option>
                                                                <option value={2500}>$ 2500</option>
                                                                <option value={3000}>$ 3000</option>
                                                            </select>
                                                        </span>
                                                    </td>
                                                </label>
                                            </div>
                                        </tr>

                                        <tr>
                                            <div className="signupClassSaving" id="signupClassSavingID">
                                                <label className="signupClassSavingLabel"
                                                    title="Select cash deposit amount for your Savings Account">
                                                    <td className="column1">Savings Account
                                                    </td>
                                                    <td className="column2">
                                                        <span id="signupInputSaving">
                                                            <select name="signupInputSavingList"
                                                                onChange={(e) => setAmountSavings(e.target.value)}>
                                                                <option value={0} selected>No Savings Account</option>
                                                                <option value={500}>$ 500</option>
                                                                <option value={1000}>$ 1000</option>
                                                                <option value={1500}>$ 1500</option>
                                                                <option value={2000}>$ 2000</option>
                                                                <option value={2500}>$ 2500</option>
                                                                <option value={3000}>$ 3000</option>
                                                            </select>
                                                        </span>
                                                    </td>
                                                </label>
                                            </div>
                                        </tr>

                                        <tr>
                                            <div className="signupClassTFS" id="signupClassTFSID">
                                                <label className="signupClassTFSLabel"
                                                    title="Select cash deposit amount for your TFSA">
                                                    {/*<input type="checkbox" id="signupCheckboxTFS" defaultChecked={false} />*/}
                                                    <td className="column1">Tax Free Saving
                                                    </td>
                                                    <td className="column2">
                                                        <span id="signupInputTFS">
                                                            <select name="signupInputTFSList"
                                                                onChange={(e) => setAmountTFS(e.target.value)}>
                                                                <option value={0} selected>No TFS Account</option>
                                                                <option value={500}>$ 500</option>
                                                                <option value={1000}>$ 1000</option>
                                                                <option value={1500}>$ 1500</option>
                                                                <option value={2000}>$ 2000</option>
                                                                <option value={2500}>$ 2500</option>
                                                                <option value={3000}>$ 3000</option>
                                                            </select>
                                                        </span>
                                                    </td>
                                                </label>
                                            </div>
                                        </tr>

                                    </div>
                                </table>
                            </div>

                            <div className="signup_signup" id="signupDiv">
                                <button type="submit" name="signupNamesignup"
                                    id="signupNamesignup_ID" >
                                    Signup
                                </button>
                            </div>
                        </div>

                        <div className="signupInfo">
                            <p className="signupInfoText">Do you have an username and password?</p>
                            <a className="signupInfoPage" href="/">
                                Login to view your account details!</a>
                        </div>


                    </div>
                </div>
            </div>


            <div>
                <a id="goHome" href="/home">Go Home.</a>
            </div>

            <div className="footer">
                <footer className="footerText">
                    {/*Insert Footer*/}
                    <Footer />
                </footer>
            </div>
        </form>
    )
}