const optionsAmount = [
    {value: '500', label: '$ 500'},
    {value: '1000', label: '$ 1000'},
    {value: '1500', label: '$ 1500'},
    {value: '2000', label: '$ 2000'},
    {value: '2500', label: '$ 2500'},
    {value: '3000', label: '$ 3000'}
]



{/*Table Left - signup Main Information*/ }
<div className="signupClassTableMain">
    <table className="signupClassTable">
        <tr>
            <div className="signupClassFirstName" id="signupIDFirstName">
                <label className="signupClassLabel">
                    <td className="column1">First Name:
                    </td>
                    <td className="column2">
                        <input type="text" name="signupFirstName"
                            id="signupFirstNameID" />
                    </td>
                </label>
            </div>
        </tr>

        <tr>
            <div className="signupClassLastName" id="signupIDLastName">
                <label className="signupClassLabel">
                    <td className="column1">Last Name:
                    </td>
                    <td className="column2">
                        <input type="text" name="signupLastName"
                            id="signupLastNameID" />
                    </td>
                </label>
            </div>
        </tr>

        <tr>
            <div className="signupClassUserName" id="signupIDUserName">
                <label className="signupClassLabel">
                    <td className="column1">User Name:
                    </td>
                    <td className="column2">
                        <input type="text" name="signupUserName"
                            id="signupUserNameID" />
                    </td>
                </label>
            </div>
        </tr>

        <tr>
            <div className="signupClassPassword" id="signupIDPassword">
                <label className="signupClassLabel">
                    <td className="column1">Password:
                    </td>
                    <td className="column2">
                        <input type="password" name="signupPassword"
                            id="signupPasswordID" />
                    </td>
                </label>
            </div>
        </tr>

        <tr>
            <div className="signupClassChecking" id="signupDiv">
                <label className="signupClassLabel">
                    <td className="column1">Checking A/C:
                    </td>
                    <td className="column2">
                        <span id="signupInput">
                            <select name="signupInputList">
                                <option value="500">$ 500</option>
                                <option value="1000">$ 1000</option>
                                <option value="1500">$ 1500</option>
                                <option value="2000">$ 2000</option>
                                <option value="2500">$ 2500</option>
                                <option value="3000">$ 3000</option>
                            </select>
                        </span>
                    </td>
                </label>
            </div>
        </tr>













        <tr>
            <div className="signupClassTransferTo" id="signupDiv">
                <label className="signupClassLabel">
                    <td className="column1">Transfer To:
                    </td>
                    <td className="column2">
                        <span id="signupInput">
                            <select id="signupInputList" name="Select Beneficiary">
                                <option value="beneficiary1"
                                    id="beneficiary1" >Beneficiary 1</option>
                                <option value="beneficiary2"
                                    id="beneficiary2">Beneficiary 2</option>
                                <option value="beneficiary3"
                                    id="beneficiary3">Beneficiary 3</option>
                                <option value="beneficiary4"
                                    id="beneficiary4">Beneficiary 4</option>
                                <option value="beneficiary5"
                                    id="beneficiary5">Beneficiary 5</option>
                            </select>
                        </span>
                    </td>
                </label>
            </div>
        </tr>

        <tr>
            <div className="signupClassAmount" id="signupDiv">
                <label className="signupClassLabel">
                    <td className="column1">Amount $:</td>
                    <td className="column2">
                        <input type="text" name="signupNameAmount"
                            id="signupIDAmount" />
                    </td>
                </label>
            </div>
        </tr>

        <tr>
            <div className="signupClassRemarks" id="signupDiv">
                <label className="signupClassLabel">
                    <td className="column1">
                        Remarks:
                    </td>
                    <td className="column2">
                        <input type="text" name="signupNameRemarks"
                            id="signupIDRemarks" />
                    </td>
                </label>
            </div>
        </tr>

        <tr>
            <div className="signupClassFrequency" id="signupDiv">
                <div>
                    <td className="column1">
                        <label className="signupClassLabel">
                            Frequency:
                        </label>
                    </td>
                    <td className="column2">
                        <label className="signupClassFrequencyLabel"
                            id="signupIDFreqOneTime">
                            <input type="radio"
                                name="signupNameFrequency"
                                value="onetime"
                                onClick={() => setsignupFreq(false)}
                            />
                            <span className="signupClassFreq">One Time</span>
                        </label>
                        <label className="signupClassFrequencyLabel"
                            id="signupIDFreqRecurring">
                            <input type="radio"
                                name="signupNameFrequency"
                                value="recurring"
                                onClick={() => setsignupFreq(true)}
                            />
                            <span className="signupClassFreq">Recurring</span>
                        </label>
                    </td>
                </div>
            </div>
        </tr>

        <tr>
            {signupFreq ? null :
                <div className="signupClassDate">
                    <label className="signupClassLabel">
                        <td className="column1" id="signupDatePick1">signup Date:</td>
                    </label>
                    <td className="column2" id="datePickInline">
                        <DatePicker
                            name="signupOnetimeDatePicked"
                            showIcon
                            selected={signupDate}
                            closeOnScroll={true}
                            onChange={(signupDate) => setsignupDate(signupDate)}
                            dateFormat={"dd/MMM/yyyy"}
                            minDate={new Date()}
                            filterDate={((signupDate => signupDate.getDay() !== 2)
                                && (signupDate => signupDate.getDay() !== 6))}
                        />
                    </td>
                </div>
            }
        </tr>

    </table>
</div>