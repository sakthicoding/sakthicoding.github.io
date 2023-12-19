import NavBar from "../Common/Navbar/navbar"
import NavBarAdmin from "../Common/Navbar/navbarAdmin"
import "../Home/styles_home.css"
import Footer from "../Common/Footer/footer"
import LogoutApplication from "../Logout/autoLogout";
import * as databaseQuery from "../Firebase/dbQuery"


/*Adding authentication check*/
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../Firebase/firebase";
import { collection, addDoc, query, where, getDocs, DocumentSnapshot, onSnapshot, QuerySnapshot, orderBy, limit } from 'firebase/firestore';
import moment from "moment";

export default function Home() {

    const navigate = useNavigate();

    const dbRefAccount = collection(db, "userAccount");
    const dbRefTransaction = collection(db, "userTransaction");
    const dbRefTransactionPending = collection(db, "userTransactionPending");

    const [accountList, setAccountList] = useState([]);
    const [transactionList, setTransactionList] = useState([]);
    const [pendingTransactionList, setPendingTransactionList] = useState([]);
    const [transactionPendingList, setTransactionPendingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState("");
    const [currentUseremail, setCurrentUseremail] = useState("")
    const [allTransaction, setAllTransaction] = useState(false)
    const [pendingTransaction, setPendingTransaction] = useState(false)

    let currentUserID = null
    //let currentUseremail = null

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is verified
                console.log("my user UID", user.uid + " - " + user.email);
                currentUserID = user.uid
                setCurrentUseremail(user.email)

                getAccountDetails(user.email)
                getTransactionDetailsPending(user.email, true)
                getTransactionDetails(user.email, 5)

            } else {
                // User is signed out
                console.log("User is logged out. Please login! - home");
                navigate("/");
            }
        });
    }, []);

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

    //Fetching Account Details from Database
    function getAccountDetails(currentUseremailID) {

        const queryData = query(dbRefAccount,
            where("username", "==", (currentUseremailID)));

        const returnData = onSnapshot(queryData, (querySnapshot) => {

            let letMyAccountList = []
            querySnapshot.forEach((doc) => {
                letMyAccountList.push({ ...doc.data(), id: doc.id });
                console.log(doc.id, " => ", doc.data());
            });

            setAccountList(letMyAccountList);
        });

        //return () => returnData();
    }

    //Fetching Account Details from Database
    function getTransactionDetails(currentUseremailID, transLimit) {

        console.log("Entering getTransactionDetails");

        let queryData = ""

        if (transLimit == "all") {
            queryData = query(dbRefTransaction,
                where("transUsername", "==", currentUseremailID),
                orderBy("transDate", "desc"));
            console.log("translimit = all")
            console.log(currentUseremailID)
            setAllTransaction(true)
        }
        else {
            queryData = query(dbRefTransaction,
                where("transUsername", "==", currentUseremailID),
                orderBy("transDate", "desc"),
                limit(5));
            console.log("translimit = something")
            setAllTransaction(false)
        }

        const returnData = onSnapshot(queryData, (querySnapshot) => {

            let letMyTransactionList = []
            querySnapshot.forEach((doc) => {
                letMyTransactionList.push({ ...doc.data(), id: doc.id });
                console.log(doc.id, " => ", doc.data());
            });

            console.log(letMyTransactionList)
            setTransactionList(letMyTransactionList);
        });

        setPendingTransaction(false)

        //return () => returnData();
    }

    function getTransactionDetailsPending(currentUseremailID, pendingTransactionBoolean) {

        if (pendingTransactionBoolean == true) {
            console.log("Entering getTransactionDetailsPending");

            let queryData = ""

            queryData = query(dbRefTransactionPending,
                where("transUsername", "==", currentUseremailID),
                orderBy("transDate"));

            const returnData = onSnapshot(queryData, (querySnapshot) => {

                let letMyTransactionPendingList = []
                querySnapshot.forEach((doc) => {
                    letMyTransactionPendingList.push({ ...doc.data(), id: doc.id });
                    console.log(doc.id, " => ", doc.data());
                });

                console.log(letMyTransactionPendingList)
                setTransactionPendingList(letMyTransactionPendingList);
                setTransactionList(letMyTransactionPendingList)
            });
        }

        setAllTransaction(true)
        setPendingTransaction(true)

        //return () => returnData();
    }

    return (
        <LogoutApplication>

            <div>
                <div className="homeUser">
                    <nav>
                        {/*Insert NavBar*/}
                        <NavBar />
                    </nav>

                    <div className="helloUser">
                        {accountList.map((myAccountDetails) => (
                            <h3>Hello
                                <span> {myAccountDetails.firstname}</span>!</h3>
                        ))}
                    </div>

                    <div className="assetAndTrans">
                        {/*Asset and Transaction Header*/}
                        <div className="rowAssetTransHeader">
                            {/*Asset*/}
                            <div className="colAssetHeader">
                                <p>Assets (CAD)</p>
                            </div>

                            <div className="colEmptyHeader">
                                <p></p>
                            </div>

                            <div className="colTransHeader">
                                <p>Last 5 Transactions (CAD)</p>
                            </div>
                        </div>

                        {/*Asset and Transaction*/}
                        <div className="rowAssetTrans">
                            <div className="colMain">
                                {/*Asset*/}
                                <div className="colAsset">
                                    <table className="transAsset">
                                        <tr>
                                            <th className="colHeadAsset1" id="colHeadAsset1">Account</th>
                                            <th className="colHeadAsset2" id="colHeadAsset2">Balance</th>
                                        </tr>

                                        {accountList.map((myAccountDetails) => (
                                            <>
                                                <tr>
                                                    <td className="col1">Chequing</td>
                                                    <td className="col2">{(myAccountDetails.amountChequing)}</td>
                                                </tr >
                                                <tr>
                                                    <td className="col1">Savings</td>
                                                    <td className="col2">{myAccountDetails.amountSavings}</td>
                                                </tr>
                                                <tr>
                                                    <td className="col1">Tax-Free Savings</td>
                                                    <td className="col2">{myAccountDetails.amountTFS}</td>
                                                </tr >
                                            </>
                                        ))}
                                    </table>
                                </div>

                                <div className="colEmpty">
                                    <p></p>
                                </div>

                                <div className="colTrans">
                                    <table className="transTable">
                                        <tr className="rowHeader">
                                            <th className="colHead1" id="header1">Date</th>
                                            <th className="colHead2" id="header2">Transaction Details</th>
                                            <th className="colHead3" id="header3">$ CAD</th>
                                            <th className="colHead4" id="header4">Remarks</th>
                                        </tr>
                                        {transactionList.map((transaction) => (
                                            <>
                                                <tr>
                                                    <td className="col1">
                                                        {moment(new Date(transaction.transDate.seconds * 1000).toLocaleDateString("en-US")).format("YYYY-MMM-DD")}
                                                    </td>
                                                    <td className="col2">
                                                        {transaction.transFrom} to {transaction.transTo}
                                                    </td>
                                                    <td className="col3">
                                                        {transaction.transAmount}
                                                    </td>
                                                    <td className="col4">
                                                        {transaction.transRemarks}
                                                    </td>
                                                </tr>
                                            </>
                                        ))}
                                    </table>
                                    <br></br>
                                    <a className="transAll" href="#" onClick={() =>
                                        getTransactionDetails(currentUseremail, (allTransaction ? 5 : "all")
                                        )}>
                                        {allTransaction ?
                                            "view last 5 transactions" :
                                            "view all transactions"}
                                    </a>
                                    <a className="transPending" href="#" onClick={() =>
                                        getTransactionDetailsPending(currentUseremail, true)}>
                                        view pending transactions
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>

                </div >
                <footer className="footerText">
                    {/*Insert Footer*/}
                    <Footer />
                </footer>

            </div >
        </LogoutApplication >
    )
}