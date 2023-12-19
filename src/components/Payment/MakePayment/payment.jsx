//
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import Moment from 'react-moment';
import 'moment-timezone';

//
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'

import NavBar from "../../Common/Navbar/navbar"
import Footer from "../../Common/Footer/footer"
import LogoutApplication from "../../Logout/autoLogout";
import * as CommonFunction from "../../Common/General/commonFunctions"
import Popup from "../../Common/Popup/popupFunction"
import * as databaseQuery from "../../Firebase/dbQuery"

import "../../Home/styles_home.css"
import "./styles_payment.css"
import "../../Common/General/variables"
import "../../Common/General/styles_common.css"


/*Adding authentication check*/
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../Firebase/firebase";
import { collection, addDoc, query, where, getDocs, onSnapshot, updateDoc, doc, or } from 'firebase/firestore';
import moment from 'moment-timezone';

export default function Payment() {

    const navigate = useNavigate();

    //Const for DB
    const dbRefAccount = collection(db, "userAccount");
    const dbRefAddBeneficiary = collection(db, "userBeneficiary");
    const dbRefTransaction = collection(db, "userTransaction");
    const dbRefTransactionPending = collection(db, "userTransactionPending");

    const [accountList, setAccountList] = useState([]);
    const [beneficiaryList, setBeneficiaryList] = useState([]);
    const [loading, setLoading] = useState(true);

    //Input from the Payment page
    const [valuePaymentTransferFrom, setValuePaymentTransferFrom] = useState("Chequing")
    const [valuePaymentTransferTo, setValuePaymentTransferTo] = useState("")
    const [valueBeneficiaryCount, setValueBeneficiaryCount] = useState(0)
    const [valuePaymentTransferAmount, setValuePaymentTransferAmount] = useState(0)
    const [valuePaymentTransferRemarks, setValuePaymentTransferRemarks] = useState("")
    const [valuePaymentTransferFreqRec, setValuePaymentTransferFreqRec] = useState(false)
    const [valuePaymentTransferDate, setValuePaymentTransferDate] = useState(new Date())
    const [valuePaymentRecStartDate, setValuePaymentRecStartDate] = useState(new Date())
    const [valuePaymentRecEndDate, setValuePaymentRecEndDate] = useState(new Date())
    const [valuePaymentRecInterval, setValuePaymentRecInterval] = useState("")
    const [balanceChequing, setBalanceChequing] = useState(0)
    const [balanceSavings, setBalanceSavings] = useState(0)
    const [balanceTFS, setBalanceTFS] = useState(0)
    const [valuePaymentCashDepositAmount, setValuePaymentCashDepositAmount] = useState(0)
    const [isOpen, setIsOpen] = useState(false);
    const [currentUsername, setCurrentUsername] = useState("");
    const [currentUserID, setCurrentUserID] = useState("");
    const [currentUserDocID, setCurrentUserDocID] = useState("");
    const [currentUserRole, setCurrentUserRole] = useState("user");
    const dateToday = new Date()
    let transPending = false

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is verified
                ////console.log("UID", user.uid + " - " + user.email);
                const userUID = user.uid;
                const userEmail = user.email;

                setCurrentUserID(userUID)
                setCurrentUsername(userEmail)

                console.log("My Randon Number => " +
                    CommonFunction.randomNumberInRange(5, 15))

                getAccountDetails(userEmail)
                getBeneficiaryDetails(userEmail)
                transPending = false

            } else {
                // User is signed out
                console.log("User is logged out. Please login! - Payment");
                navigate("/");
            }
        });
    }, []);

    //Fetching Account Details from Database
    function getAccountDetails(currentUsername) {

        const queryUserData = query(dbRefAccount,
            where("username", "==", (currentUsername)));

        const returnUserData = onSnapshot(queryUserData, (querySnapshot) => {

            let letUserMyAccountList = []
            querySnapshot.forEach((userDoc) => {
                letUserMyAccountList.push({ ...userDoc.data(), id: userDoc.id });

                //Initiate Account Balance
                setBalanceChequing(userDoc.data().amountChequing)
                setBalanceSavings(userDoc.data().amountSavings)
                setBalanceTFS(userDoc.data().amountTFS)
                setCurrentUserDocID(userDoc.id)
                //////console.log(userDoc.id, " => ", userDoc.data());
            });
            setAccountList(letUserMyAccountList);

        });
        return () => returnUserData();
    }

    //Fetching Beneficiary Details from Database
    function getBeneficiaryDetails(currentUsername) {

        const queryBeneficiaryData = query(dbRefAddBeneficiary,
            where("username", "==", (currentUsername)));

        const returnBeneficiaryData = onSnapshot(queryBeneficiaryData, (querySnapshot) => {

            let letMyBeneficiaryList = []
            querySnapshot.forEach((beneficiaryDoc) => {
                letMyBeneficiaryList.push({ ...beneficiaryDoc.data(), id: beneficiaryDoc.id });
                ////console.log(beneficiaryDoc.id, " ==> ", beneficiaryDoc.data());
            });

            setValuePaymentTransferAmount("")
            setBeneficiaryList(letMyBeneficiaryList);

            if (letMyBeneficiaryList.length >= 1) {
                setValuePaymentTransferTo(letMyBeneficiaryList[0].beneficiaryName)
            }
            else {
                setValuePaymentTransferTo("")
            }
            setValueBeneficiaryCount(letMyBeneficiaryList.length)

        });

        return () => returnBeneficiaryData();
    }

    //Fetching Beneficiary Account Details from Database
    async function updateBeneficiaryAccountDetails(myCurrentBeneficiaryList) {

        for (let i = 0; i < myCurrentBeneficiaryList.length; i++) {

            if (valuePaymentTransferTo == myCurrentBeneficiaryList[i].beneficiaryName) {
                let myCurrentBeneficiaryname = myCurrentBeneficiaryList[i].beneficiaryEmail

                const queryBeneficiaryAccountData = query(dbRefAccount,
                    where("username", "==", myCurrentBeneficiaryname));

                const querySnapshot = await getDocs(queryBeneficiaryAccountData);
                querySnapshot.forEach((doc) => {

                    let newUpdateAccountBalanceBeneficiary = parseInt(doc.data().amountChequing) + parseInt(valuePaymentTransferAmount)

                    updateTransactionBeneficiary(
                        newUpdateAccountBalanceBeneficiary,
                        "userAccount",
                        doc.id
                    )
                });
            }
        }

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

    //Adding Transaction Details To DB
    const addTransactionPendingToDB =
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
                await addDoc(dbRefTransactionPending,
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

    //Adding Transaction Details for Current User To DB
    const updateTransactionCurrentUserAccount =
        async (
            whatFieldToUpdate,
            enterNewUpdateVal,
            userAccountTableName,
            userDocID
        ) => {

            try {
                //Update Current User Amount
                const updateDocInput = doc(db, userAccountTableName, userDocID)
                await updateDoc(updateDocInput,

                    (whatFieldToUpdate === "Chequing") ?
                        { amountChequing: enterNewUpdateVal }
                        :
                        (whatFieldToUpdate === "Savings") ?
                            { amountSavings: enterNewUpdateVal }
                            :
                            { amountTFS: enterNewUpdateVal }

                );
            }

            catch (error) {
                console.error(error);
            };
        };

    //Adding Transaction Details for Current User To Self Transfer
    const updateTransactionCurrentUserToSelf =
        async (
            fromAccount,
            toAccount,
            newFromAccountBalance,
            newToAccountBalance,
            userAccountTableName,
            userDocID
        ) => {

            try {
                //Update Current User Amount
                const updateDocInput = doc(db, userAccountTableName, userDocID)
                await updateDoc(updateDocInput,

                    (fromAccount == "Chequing" && toAccount == "Savings") ?
                        {
                            amountChequing: newFromAccountBalance,
                            amountSavings: newToAccountBalance
                        }
                        :
                        (fromAccount == "Chequing" && toAccount == "TFS") ?
                            {
                                amountChequing: newFromAccountBalance,
                                amountTFS: newToAccountBalance
                            }
                            :
                            (fromAccount == "Savings") ?
                                {
                                    amountSavings: newFromAccountBalance,
                                    amountChequing: newToAccountBalance
                                }
                                :
                                {
                                    amountTFS: newFromAccountBalance,
                                    amountChequing: newToAccountBalance
                                }

                );
            }

            catch (error) {
                console.error(error);
            };
        };

    //Adding Transaction Details for Current User - Add Cash Deposit
    const updateTransactionAddCashDeposit =
        async (
            newUpdateAccountBalance,
            userAccountTableName,
            userDocID,
            cashDepositAmount
        ) => {

            try {
                //Update Beneficiary User Account Table
                const updateBeneficiaryDocInput = doc(db, userAccountTableName, userDocID)
                await updateDoc(updateBeneficiaryDocInput,
                    { amountChequing: newUpdateAccountBalance }
                );

                //Complete Transaction
                addTransactionToDB(
                    cashDepositAmount,
                    dateToday,
                    "Onetime",
                    "Cash Deposit",
                    dateToday,
                    "",
                    dateToday,
                    "Cash Deposit",
                    "Checking",
                    currentUsername)

                console.log("Completed add cash")
            }

            catch (error) {
                console.error(error);
            };
        };

    //Adding Transaction Details from Current User To Beneficiary
    const updateTransactionBeneficiary =
        async (
            newUpdateAccountBalance,
            userAccountTableName,
            beneficiaryDocID
        ) => {

            try {
                //Update Beneficiary User Account Table
                const updateBeneficiaryDocInput = doc(db, userAccountTableName, beneficiaryDocID)
                await updateDoc(updateBeneficiaryDocInput,
                    { amountChequing: newUpdateAccountBalance }
                );
            }

            catch (error) {
                console.error(error);
            };
        };

    function findBeneficiaryEmail(inputBeneficiaryList, beneficiaryName) {
        ////console.log("beneficiaryName =" + beneficiaryName)
        for (let i = 0; i < inputBeneficiaryList.length; i++) {
            if (beneficiaryName == inputBeneficiaryList[i].beneficiaryName) {
                return inputBeneficiaryList[i].beneficiaryEmail
            }
        }
    }

    //Functions for popup - Add cash balance
    function submitAddCashBalancePopupVisible(e) {
        setIsOpen(!isOpen);
        setValuePaymentCashDepositAmount("")
    }

    function submitAddCashBalanceCancel(e) {
        setIsOpen(!isOpen);
        setValuePaymentCashDepositAmount("")
    }

    function submitAddCashBalanceAdd(e) {
        if (valuePaymentCashDepositAmount.valueOf() == 0) {
            alert("Enter cash deposit amount to continue")
        }
        else {
            setIsOpen(!isOpen);
            setValuePaymentCashDepositAmount("")

            //Complete Transaction for Current User
            let newUpdateAccountBalance =
                parseInt(balanceChequing) + parseInt(valuePaymentCashDepositAmount);

            updateTransactionAddCashDeposit(
                parseInt(newUpdateAccountBalance),
                "userAccount",
                currentUserDocID,
                valuePaymentCashDepositAmount)

            alert("$" + valuePaymentCashDepositAmount + " added to your Chequing Account!")
        }
    }

    /**********************/
    /*Make Payment Handler*/
    /**********************/
    function submitMakePayment(e) {
        e.preventDefault();

        console.log("Current Date", Date())

        ////console.log(formJson);

        //Check the Payment from amount with the balance
        let fromAccountAmount =
            (valuePaymentTransferFrom == "Chequing") ? balanceChequing :
                (valuePaymentTransferFrom == "Savings") ? balanceSavings :
                    balanceTFS

        //Chekcing transaction today vs future date
        if (valuePaymentTransferFreqRec == false) {
            if ((moment(valuePaymentTransferDate).format('YYYY-MM-DD')) !=
                (moment(dateToday).format('YYYY-MM-DD'))) {
                transPending = true
            }
            else {
                transPending = false
            }
        }
        else {
            if ((moment(valuePaymentRecStartDate).format('YYYY-MM-DD')) !=
                (moment(dateToday).format('YYYY-MM-DD'))) {
                transPending = true
            }
            else {
                transPending = false
            }
        }

        //Alert message for balance Chequing
        if (parseInt(valuePaymentTransferAmount) > parseInt(fromAccountAmount)) {

            alert("You dont have sufficient balance in your " + valuePaymentTransferFrom
                + " account to make this payment. \n\n" +
                (fromAccountAmount == 0 ? "" : "Please enter amount less than $"
                    + fromAccountAmount + "."))
        }

        else {

            if (transPending == true) {
                //Pending Transaction to DB
                addTransactionPendingToDB(
                    valuePaymentTransferAmount,
                    valuePaymentTransferDate,
                    (valuePaymentTransferFreqRec == false ? "Onetime" : "Recurring"),
                    valuePaymentTransferFrom,
                    valuePaymentRecEndDate,
                    valuePaymentRecInterval,
                    valuePaymentRecStartDate,
                    valuePaymentTransferRemarks,
                    valuePaymentTransferTo,
                    currentUsername)

                //Setting trans Pending false for next payment    
                transPending = false

                //Pending Transaction Completed
                alert("Transaction will be done by " +
                    moment(
                        ((valuePaymentTransferFreqRec == false) ?
                            valuePaymentTransferDate :
                            valuePaymentRecStartDate)
                    ).format('ddd, MMMM DD, YYYY') +
                    " !")
            }

            else {

                //Complete Transaction
                addTransactionToDB(
                    valuePaymentTransferAmount,
                    valuePaymentTransferDate,
                    (valuePaymentTransferFreqRec == false ? "Onetime" : "Recurring"),
                    valuePaymentTransferFrom,
                    valuePaymentRecEndDate,
                    valuePaymentRecInterval,
                    valuePaymentRecStartDate,
                    valuePaymentTransferRemarks,
                    valuePaymentTransferTo,
                    currentUsername)

                //Condition for Chequing to Beneficiary
                if ((valuePaymentTransferFrom == "Chequing") &&
                    !((valuePaymentTransferTo == "Savings") ||
                        (valuePaymentTransferTo == "TFS"))) {

                    //Complete Transaction for Current User
                    let newUpdateAccountBalance = fromAccountAmount - valuePaymentTransferAmount;
                    updateTransactionCurrentUserAccount(
                        valuePaymentTransferFrom,
                        newUpdateAccountBalance,
                        "userAccount",
                        currentUserDocID
                    )

                    //Update Beneficiary Account Details
                    updateBeneficiaryAccountDetails(beneficiaryList);
                }

                //Condition for Self Account Transfer - Chequing to Savings/TFS
                else {

                    //Complete Transaction for Current User
                    let newUpdateFromAccountBalance = fromAccountAmount - valuePaymentTransferAmount;

                    let newUpdateToAccountBalance =
                        parseInt(((valuePaymentTransferTo == "Chequing") ? balanceChequing :
                            (valuePaymentTransferTo == "Savings") ? balanceSavings :
                                balanceTFS)) + parseInt(valuePaymentTransferAmount);

                    console.log("balanceChequing = " + balanceChequing)
                    console.log("balanceSavings = " + balanceSavings)
                    console.log("balanceTFS = " + balanceTFS)

                    console.log("valuePaymentTransferTo = " + valuePaymentTransferTo)
                    console.log("valuePaymentTransferAmount = " + valuePaymentTransferAmount)

                    console.log("newUpdateToAccountBalance = " + newUpdateToAccountBalance)

                    updateTransactionCurrentUserToSelf(
                        valuePaymentTransferFrom,
                        valuePaymentTransferTo,
                        newUpdateFromAccountBalance,
                        newUpdateToAccountBalance,
                        "userAccount",
                        currentUserDocID
                    )
                }

                //Transaction Completed
                alert("Transaction Completed Successfully!")
            }

            //Navigate to Home
            navigate("/home")

        }
    }

    return (

        // <LogoutApplication>
        <form method="post" onSubmit={submitMakePayment}>
            <div>

                {/*Insert NavBar*/}
                <NavBar />

                <div className="helloUser">
                    {accountList.map((myAccountDetails) => (
                        <h3>Hello
                            <span> {myAccountDetails.firstname}</span>!</h3>
                    ))}
                </div>

                <div className="paymentMain">

                    {/*Page Name*/}
                    <div className="paymentDiv">
                        <p className="paymentHeader">Enter Payment Details</p>
                    </div>

                    <div className="paymentDetails">

                        {/*Table Right - Additional info for Recurring Payment*/}
                        <div className="paymentTableRecurring">
                            {valuePaymentTransferFreqRec ?
                                <table className="paymentTableRight"
                                    id="paymentTableRightID">

                                    {/*Recurring - Payment Start Date*/}
                                    <tr>
                                        <div className="paymentRecStartDate">
                                            <label className="paymentRecStartDateLabel">
                                                <td className="column1"
                                                    id="paymentRecStartDatePick">
                                                    Start Date</td>
                                            </label>
                                            <td className="column2" id="datePickInline">
                                                <DatePicker
                                                    name="paymentRecurringStartDate"
                                                    showIcon
                                                    selected={valuePaymentRecStartDate}
                                                    placeholderText='Select Payment Start Date'
                                                    closeOnScroll={true}
                                                    required
                                                    value={valuePaymentRecStartDate}
                                                    onChange={(valuePaymentRecStartDate) => setValuePaymentRecStartDate(valuePaymentRecStartDate)}
                                                    placeholder="Select Payment Start Date"
                                                    dateFormat={"dd/MMM/yyyy"}
                                                    minDate={new Date()}
                                                    filterDate={(valuePaymentRecStartDate => (valuePaymentRecStartDate.getDay() !== 0 &&
                                                        valuePaymentRecStartDate.getDay() !== 6))} />
                                            </td>
                                        </div>
                                    </tr>

                                    {/*Recurring - Payment End Date*/}
                                    <tr>
                                        <div className="paymentRecEndDate">
                                            <label className="paymentRecEndDateLabel">
                                                <td className="column1" id="paymentRecEndDatePick1">End Date</td>
                                            </label>
                                            <td className="column2" id="datePickInline">
                                                <DatePicker
                                                    name="paymentRecurringEndtDate"
                                                    showIcon
                                                    selected={valuePaymentRecEndDate}
                                                    placeholderText='Select Payment End Date'
                                                    closeOnScroll={true}
                                                    required
                                                    value={valuePaymentRecEndDate}
                                                    onChange={(valuePaymentRecEndDate) => setValuePaymentRecEndDate(valuePaymentRecEndDate)}
                                                    dateFormat={"dd/MMM/yyyy"}
                                                    minDate={new Date(valuePaymentRecStartDate)}
                                                    filterDate={(valuePaymentRecEndDate => (valuePaymentRecEndDate.getDay() !== 0
                                                        && valuePaymentRecEndDate.getDay() !== 6))} />
                                            </td>
                                        </div>
                                    </tr>

                                    {/*Recurring - Payment Interval*/}
                                    <tr>
                                        <div className="paymentRecInterval" id="paymentRecInterval-id">
                                            <label className="paymentRecIntervalLabel">
                                                <td className="column1">Interval
                                                </td>
                                                <td className="column2">
                                                    <span id="paymentRecIntervalInput">
                                                        <select
                                                            value={valuePaymentRecInterval}
                                                            required
                                                            onChange={(e) => setValuePaymentRecInterval(e.target.value)}
                                                        >
                                                            <option value="Daily"
                                                                id="Daily">Daily</option>
                                                            <option value="Weekly"
                                                                id="Weekly">Weekly</option>
                                                            <option value="Monthly"
                                                                id="Monthly">Monthly</option>
                                                        </select>
                                                    </span>
                                                </td>
                                            </label>
                                        </div>
                                    </tr>
                                </table>
                                : null}
                        </div>


                        {/*Table Left - Payment Main Information*/}
                        <div className="paymentTableMain">
                            <table className="paymentTableLeft">
                                <tr>
                                    <div className="paymentTransferFrom" id="paymentTransferFrom">
                                        <label className="paymentLabel"
                                            title="Select Transfer From"
                                        >
                                            <td className="column1">Transfer From
                                            </td>
                                            <td className="column2">
                                                <span id="paymentInput">
                                                    <select
                                                        name="paymentTransferFrom"
                                                        autoFocus
                                                        title="Select Transfer From"
                                                        value={valuePaymentTransferFrom}
                                                        required
                                                        onChange={
                                                            (e) => {
                                                                {
                                                                    setValuePaymentTransferFrom(e.target.value)
                                                                    {
                                                                        (e.target.value != "Chequing") ?
                                                                            setValuePaymentTransferTo("Chequing") :
                                                                            setValuePaymentTransferTo(valuePaymentTransferTo)
                                                                    }

                                                                }
                                                            }}
                                                    >
                                                        {accountList.map((myAccountDetails) => (
                                                            <>
                                                                <option value="Chequing"
                                                                    id="Chequing">Chequing Account - ${(myAccountDetails.amountChequing)}</option>
                                                                <option value="Savings"
                                                                    id="Savings">Savings Account - ${(myAccountDetails.amountSavings)}</option>
                                                                <option value="TFS"
                                                                    id="TFS">TFS Account - ${(myAccountDetails.amountTFS)}</option>
                                                            </>
                                                        ))}
                                                    </select>
                                                </span>
                                            </td>
                                        </label>

                                        {
                                            (valuePaymentTransferFrom === 'Chequing')
                                                ?
                                                <button
                                                    className="paymentAddBalance"
                                                    type="button"
                                                    title="Click to Add Cash to Chequing"
                                                    onClick={submitAddCashBalancePopupVisible}
                                                    name="paymentAddBalance"
                                                ><span>+</span> Add Cash Deposit
                                                </button>
                                                : null
                                        }

                                        {isOpen && <Popup
                                            content={
                                                <div className='addCashDepositPopup'>
                                                    <div className='addCashDepositPopup-input'>
                                                        <label
                                                            title="Enter cash deposit amount"
                                                        ><b>Enter cash deposit Amount</b>
                                                            <input
                                                                name="paymentCashDepositAmount"
                                                                id="paymentCashDepositAmount"
                                                                title="Enter cash deposit amount"
                                                                value={valuePaymentCashDepositAmount}
                                                                autoFocus
                                                                type="text"
                                                                pattern="[0-9]+"
                                                                placeholder='Enter Amount'
                                                                required
                                                                onInput={F => F.target.setCustomValidity('')}
                                                                onInvalid={F => F.target.setCustomValidity('Please enter amount here')}
                                                                onChange={
                                                                    (e) =>
                                                                        setValuePaymentCashDepositAmount((v) =>
                                                                        (e.target.value == "" ? "" :
                                                                            (e.target.validity.valid ? e.target.value : v)))
                                                                }
                                                            />
                                                        </label>
                                                    </div>
                                                    <div className='addCashDepositPopup-button'>
                                                        <button
                                                            name='addCashDepositPopupCancel'
                                                            onClick={submitAddCashBalanceCancel}
                                                            title="Click to cancel transaction"
                                                        >Cancel</button>
                                                        <button
                                                            type='button'
                                                            name='addCashDepositPopupAddAmount'
                                                            onClick={submitAddCashBalanceAdd}
                                                            title="Click to add amount"
                                                        >Add Amount</button>

                                                    </div>
                                                </div>
                                            }
                                        />}

                                    </div>
                                </tr>

                                <tr>
                                    <div className="paymentTransferTo" id="paymentDiv">
                                        <label className="paymentLabel"
                                            title="Select Beneficiary"
                                        >
                                            <td className="column1">Transfer To
                                            </td>
                                            <td className="column2">
                                                <span id="paymentInput">
                                                    <select id="paymentInputList"
                                                        name="paymentTransferTo"
                                                        title="Select Beneficiary"
                                                        required
                                                        value={valuePaymentTransferTo}
                                                        onChange={
                                                            (e) => {
                                                                {
                                                                    setValuePaymentTransferTo(e.target.value)
                                                                    console.log("adding")
                                                                }
                                                            }}
                                                    >
                                                        {
                                                            (valuePaymentTransferFrom != 'Chequing')
                                                                ?
                                                                <option value="beneficiary1"
                                                                    id="beneficiary1">Chequing Account</option>
                                                                :
                                                                (parseInt(valueBeneficiaryCount) == 0)
                                                                    ?
                                                                    <>
                                                                        <option value="Savings" id="Savings">
                                                                            Savings Account (Self)</option>
                                                                        <option value="TFS" id="TFS">
                                                                            TFS Account (Self)</option>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {
                                                                            beneficiaryList.map((myBeneficiaryDetails) => (
                                                                                <option>{(myBeneficiaryDetails.beneficiaryName)}</option>

                                                                            ))
                                                                        }
                                                                        <option value="TFS" id="TFS">TFS Account - Self</option>
                                                                        <option value="Savings" id="Savings">Savings Account - Self</option>

                                                                    </>
                                                        }
                                                    </select>
                                                </span>
                                            </td>
                                        </label>
                                    </div>
                                </tr>

                                <tr>
                                    <div className="paymentAmount" id="paymentDiv">
                                        <label className="paymentLabel"
                                            title="Enter amount"
                                        >
                                            <td className="column1">Amount $</td>
                                            <td className="column2">
                                                <input
                                                    name="paymentTransferAmount"
                                                    id="paymentIDAmount"
                                                    title="Enter amount"
                                                    value={valuePaymentTransferAmount}
                                                    autoFocus
                                                    type="text"
                                                    pattern="[0-9]+"
                                                    placeholder='Enter Amount'
                                                    required
                                                    onInput={F => F.target.setCustomValidity('')}
                                                    onInvalid={F => F.target.setCustomValidity('Please enter amount here')}
                                                    onChange={
                                                        (e) =>
                                                            setValuePaymentTransferAmount((v) =>
                                                            (e.target.value == "" ? "" :
                                                                (e.target.validity.valid ? e.target.value.valueOf() : v)))
                                                    }
                                                />
                                            </td>
                                        </label>
                                    </div>
                                </tr>

                                <tr>
                                    <div className="paymentRemarks" id="paymentDiv">
                                        <label className="paymentLabel"
                                            title="Enter transaction remark"
                                        >
                                            <td className="column1">
                                                Remarks
                                            </td>
                                            <td className="column2">
                                                <input type="text"
                                                    name="paymentTransferRemarks"
                                                    id="paymentIDRemarks"
                                                    title="Enter transaction remark"
                                                    required
                                                    onInput={F => F.target.setCustomValidity('')}
                                                    onInvalid={F => F.target.setCustomValidity('Please enter remarks here')}
                                                    value={valuePaymentTransferRemarks}
                                                    onChange={(e) => setValuePaymentTransferRemarks(e.target.value)}
                                                />
                                            </td>
                                        </label>
                                    </div>
                                </tr>

                                <tr>
                                    <div className="paymentFrequency" id="paymentDiv">
                                        <div>
                                            <td className="column1">
                                                <label className="paymentLabel">
                                                    Frequency
                                                </label>
                                            </td>
                                            <td className="column2">
                                                <label className="paymentFrequencyLabel"
                                                    id="paymentIDFreqOneTime"
                                                    title="Select payment frequency">
                                                    <input type="radio"
                                                        name="PaymentTransferFreqRec"
                                                        title="Select payment frequency"
                                                        required
                                                        onInput={F => F.target.setCustomValidity('')}
                                                        onInvalid={F => F.target.setCustomValidity('Please select one of the Frequency')}
                                                        value={valuePaymentTransferFreqRec}
                                                        onClick={(e) => setValuePaymentTransferFreqRec(false)}
                                                    />
                                                    <span className="paymentFreq">One Time</span>
                                                </label>
                                                <label className="paymentFrequencyLabel"
                                                    id="paymentIDFreqRecurring"
                                                    title="Select payment frequency">
                                                    <input type="radio"
                                                        name="PaymentTransferFreqRec"
                                                        title="Select payment frequency"
                                                        value={valuePaymentTransferFreqRec}
                                                        onClick={(e) => setValuePaymentTransferFreqRec(true)} />
                                                    <span className="paymentFreq">Recurring</span>
                                                </label>
                                            </td>
                                        </div>
                                    </div>
                                </tr>

                                <tr>
                                    {valuePaymentTransferFreqRec ? null :
                                        <div className="paymentDate">
                                            <label className="paymentLabel"
                                                title="Select payment date">
                                                <td className="column1" id="paymentDatePick1">Payment Date</td>
                                            </label>
                                            <td className="column2" id="datePickInline">
                                                <DatePicker
                                                    name="paymentOnetimeDatePicked"
                                                    showIcon
                                                    title="Select payment date"
                                                    selected={valuePaymentTransferDate}
                                                    placeholderText='Select Payment Date'
                                                    closeOnScroll={true}
                                                    required
                                                    value={valuePaymentTransferDate}
                                                    onChange={(valuePaymentTransferDate) => setValuePaymentTransferDate(valuePaymentTransferDate)}
                                                    placeholder="Select Payment Date"
                                                    dateFormat={"dd/MMM/yyyy"}
                                                    minDate={new Date()}
                                                    filterDate={
                                                        valuePaymentTransferDate => (valuePaymentTransferDate.getDay() !== 0 &&
                                                            valuePaymentTransferDate.getDay() !== 6)} />
                                            </td>

                                        </div>}
                                </tr>

                            </table>
                        </div>

                    </div>

                    <div className="paymentMakePayment" id="paymentDiv">
                        <button
                            type="submit"
                            name="paymentNameMakePayment"
                            id="paymentIDMakePayment"
                            title="Click to make payment"
                        >
                            Make Payment
                        </button>
                    </div>

                </div>
            </div>

            <div className="footer">
                <footer className="footerText">
                    {/*Insert Footer*/}
                    <Footer />
                </footer>
            </div>
        </form >
        // </LogoutApplication>
    )
}
