import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../Firebase/firebase";
import { NavLink, useNavigate } from "react-router-dom";

import Footer from "../Common/Footer/footer";
import "./styles_login.css"
import ImageLogo from "../../img/logo.svg"
import "../Common/General/styles_common.css"
import * as FunctionCommon from "../Common/General/commonFunctions"
//import * as commonFunctionJS from "../Common/General/commonFun_JS"
import * as databaseQuery from "../Firebase/dbQuery"
import { doc, collection, addDoc, query, where, getDocs, DocumentSnapshot, onSnapshot, QuerySnapshot, getDoc } from 'firebase/firestore';

export default function Login() {
    function oncanplay(event) {
        this.play()
    }

    function onloadedmetadata(event) {
        this.muted = true
    }

    const randomNumberInRange = (min, max) => {
        return Math.floor(Math.random()
            * (max - min + 1)) + min;
    };

    const randomNumberZeroToMax = (max) => {
        return Math.floor(Math.random() * max);
    }

    /*----------------------
    Login Click Event Handle
    ----------------------*/
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [currentUserRole, setCurrentUserRole] = useState("");
    let userAvailable = false
    const dbRefRole = collection(db, "userRole");

    const submitLogin = (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);

        //Signin with email and password
        signInWithEmailAndPassword(auth, username, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                /*console.log("before getUserRole " + userAvailable)
                getUserRole(username)
                console.log("after getUserRole => " + userAvailable)*/


                navigateUserHome(username)

                //navigateUser(username)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                const loginErrorMsg = "Login unsuccessful! \n\nYour login details do not match."
                alert(loginErrorMsg)
                //commonFunctionJS.alert()
            })

        //Clear email and password
        form.reset();
    };

    //Get userRole from userRole
    function getUserRole(currentUsername) {

        const queryUserData = query(dbRefRole,
            where("userName", "==", currentUsername));

        const returnData = onSnapshot(queryUserData, (querySnapshot) => {

            let letMyUserRole = []
            querySnapshot.forEach((doc) => {

                letMyUserRole.push({ ...doc.data(), id: doc.id });
                console.log(doc.id, " => ", doc.data());

                let myUserRoleReturn = doc.data().userRole

                setCurrentUserRole(myUserRoleReturn)
                console.log("myUserRoleReturn => " + myUserRoleReturn)
                userAvailable = true

                console.log("userAvailable = true => " + userAvailable)
            });
        });
    }

    //Get navigateUserHome from userRole
    async function navigateUserHome(currentUsername) {

        const docRefUserRole = doc(db, "userRole", currentUsername);

        const myUserRoleReturn = onSnapshot(docRefUserRole, (doc) => {

            console.log("Current userRole: " + doc.data());

            if (doc.data() == undefined) {
                alert("Username '" + username + "' is deactivated by the administrator. \n\n" +
                    "Please contact bank to reactivate your account.")
            }
            else {
                navigate((doc.data().userRole == "user") ? "/home" : "/homeadmin")
            }
        })

        /*const queryUserData = query(dbRefRole,
            where("username", "==", currentUsername));

        const querySnapshot = await getDocs(queryUserData);

        querySnapshot.forEach((myUserRole) => {

            
            let myUserRoleReturn = myUserRole.data().userRole

            navigate((myUserRoleReturn == "user") ? "/home" : "/homeadmin")
        });*/
    }

    return (
        <div id="pagewrap">
            <form method="post" onSubmit={submitLogin}>
                <div className="imageLogoFrame">
                    <img className="imageLogo" src={ImageLogo} alt="errorImage" />
                </div>

                <div className="loginFrame">

                    {/*video player*/}
                    <div className="side_Left_BankingVideo">
                        <div className="videoFrame">
                            <video className="video_box" width="1200"
                                loop muted autoPlay controls=''
                                poster={"./img/" + randomNumberInRange(1, 12) + ".png"}
                                oncanplay onloadedmetadata >
                                <source src={"/video/" + randomNumberInRange(1, 12) + ".mp4"}
                                    type="video/mp4" />
                            </video>
                        </div>
                    </div>

                    <div className="side_Right_Login">
                        <div className="loginInput">
                            <div className="loginWelcome">
                                <h2 className="loginWelcomeMessage">Welcome to</h2>
                            </div>

                            <div className="loginBankName">
                                <h1 className="loginBankNameText">Hakuna Matata Bank</h1>
                            </div>

                            <div className="login_input_info">
                                <div className="login_input_username">
                                    <label className="label_Username">

                                        <input type="email" name="login_Username"
                                            id="login_Username_ID"
                                            autoCapitalize={"none"}
                                            autoComplete={"off"}
                                            placeholder="Username or email"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                            autoFocus
                                        />
                                    </label>
                                </div>

                                <div className="login_input_password">
                                    <label className="label_Password">
                                        <input type="password" name="login_Password"
                                            id="login_Password_ID"
                                            autoCapitalize={"none"}
                                            autoComplete={"off"}
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </label>
                                </div>

                                <div className="login_login" id="loginDiv">
                                    <button type="submit" name="loginNameLogin"
                                        id="loginNameLogin_ID" >
                                        Login
                                    </button>
                                </div>
                            </div>

                            <div className="signupInfo">
                                <p className="signupInfoText">Don't have an username and password?</p>
                                <a className="signupInfoPage" href="/signup">
                                    Set them up right now.</a>
                            </div>


                        </div>
                    </div>
                </div>

                {/*
                <div>
                    <a id="goHome" href="/home">Go Home.</a>
                </div>
                */}

                <div className="footer">
                    <footer className="footerText">
                        {/*Insert Footer*/}
                        <Footer />
                    </footer>
                </div>
            </form>
        </div>
    )
}