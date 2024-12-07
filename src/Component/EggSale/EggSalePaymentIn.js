import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import { HandleLogout } from './../../Utility'
import Loading from '../Loading/Loading'

function EggSalePaymentIn(props) {
    let history = useNavigate();
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [isloaded, setIsLoaded] = useState(true);
    const search = useLocation().search;
    const [uid, setUid] = useState(new URLSearchParams(search).get('uid'));
    const [paymentamount, setPaymentAmount] = useState(0);
    const [duelist, setEggSaleDueList] = useState([]);
    const [paymenthistorylist, setPaymentHistoryList] = useState([]);
    const [customerdetails, setCustomerDetails] = useState([]);
    const [validated, setValidated] = useState(false);

    let addCount = (num) => {
        setCount(num + 1);
    };

    const _paymenthistory=
    {
        Id:"",
        CustomerId: "",
        Amount: "",
        Date: "",
        PaymentMode: "",
        CompanyId: ""
    }

    const [paymenthistorydata, setPaymentHistoryData] = useState(_paymenthistory);

    const _paymentDetails = {
        CustomerId: "",
        Amount: "",
        PaymentDate: "",
        PaymentMode: "",
        Id: "",
        PaymentDate: "",
        Cash: "",
        PhonePay: "",
        NetBanking: "",
        UPI: "",
        Cheque: ""
    }

    const [paymentDetails, setPaymentDetails] = useState(_paymentDetails);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            setPaymentDetails({ ...paymentDetails, CustomerId: uid });
            fetchCustomerDetails(uid);
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchPendingEggSaleInvoiceList(uid);
            fetchEggSalePaymentHistory(uid);
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);

    const fetchCustomerDetails = async (custid) => {
        fetch(process.env.REACT_APP_API + 'Customer/GetCustomerById?id=' + custid,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.StatusCode === 200) {
                    setCustomerDetails(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                }
            });
    }

    const amountChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setPaymentDetails({ ...paymentDetails, Amount: e.target.value });
            setTotalAmt(e.target.value);
        }
    }

    const paymentDateChange = (e) => {
        setPaymentDetails({ ...paymentDetails, PaymentDate: e.target.value });
    }

    const assignPaymentDetails=(val, amt)=>{
        if (val == "Cash") {
            setPaymentDetails({ ...paymentDetails, Cash: amt, PaymentMode: val});
        }
        else if (val == "PhonePay") {
            setPaymentDetails({ ...paymentDetails, PhonePay: amt, PaymentMode: val });
        }
        else if (val == "NetBanking") {
            setPaymentDetails({ ...paymentDetails, NetBanking: amt, PaymentMode: val });
        }
        else if (val == "UPI") {
            setPaymentDetails({ ...paymentDetails, UPI: amt, PaymentMode: val });
        }
        else if (val == "Cheque") {
            setPaymentDetails({ ...paymentDetails, Cheque: amt, PaymentMode: val });
        }
    }

    const paymentModeChange = (e) => {
        let paymentMode = e.target.value;
        assignPaymentDetails(paymentMode,paymentDetails.Amount);
        // if (e.target.value == "Cash") {
        //     setPaymentDetails({ ...paymentDetails, Cash: paymentDetails.Amount });
        // }
        // else if (e.target.value == "PhonePay") {
        //     setPaymentDetails({ ...paymentDetails, PhonePay: paymentDetails.Amount });
        // }
        // else if (e.target.value == "NetBanking") {
        //     setPaymentDetails({ ...paymentDetails, NetBanking: paymentDetails.Amount });
        // }
        // else if (e.target.value == "UPI") {
        //     setPaymentDetails({ ...paymentDetails, UPI: paymentDetails.Amount });
        // }
        // else if (e.target.value == "Cheque") {
        //     setPaymentDetails({ ...paymentDetails, Cheque: paymentDetails.Amount });
        // }
    }


    const fetchEggSalePaymentHistory = async (uid) => {
        setIsLoaded(true);
        fetch(process.env.REACT_APP_API + 'EggSale/GetPaymentHistoryByCustId?CustId=' 
            + uid +'&CompanyId='+localStorage.getItem('companyid'),
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.StatusCode === 200) {
                    setPaymentHistoryList(data.Result);
                    setIsLoaded(false);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found !!", "danger")
                }
                else {
                    props.showAlert("Error occurred !!", "danger")
                }
            });

        setIsLoaded(false);
    }

    const commentsChange = (e) => {
        setPaymentDetails({ ...paymentDetails, Comments: e.target.value });
    }

    const fetchPendingEggSaleInvoiceList = async (uid) => {
        setIsLoaded(true);
        fetch(process.env.REACT_APP_API + 'EggSale/GetPendingEggSaleInvoiceListByCustId?CustId=' 
            + uid +'&CompanyId='+localStorage.getItem('companyid'),
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.StatusCode === 200) {
                    setEggSaleDueList(data.Result);
                    setIsLoaded(false);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found !!", "danger")
                }
                else {
                    props.showAlert("Error occurred !!", "danger")
                }
            });

        setIsLoaded(false);
    }

    const [totalamt, setTotalAmt] = useState(0);
    let newVal = totalamt;

    const UpdatePaymentHistory=async ()=>
    {
                        const response = await fetch(process.env.REACT_APP_API + 'EggSale/UpdatePaymentHistory', {
                            method: 'PUT',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': localStorage.getItem('token')
                            },
                            body: JSON.stringify({
                                Amount: paymentDetails.Amount,
                                Date: paymentDetails.PaymentDate,
                                PaymentMode:paymentDetails.PaymentMode,
                                CustomerId:uid,
                                CompanyId:localStorage.getItem('companyid')
                            })
                        });
                            const todo = await response.json()
                            .then((result) => {
                                if (result.StatusCode === 200) {
                                    addCount(count);
                                }
                            });
                       
    }

    const handleSettle = async (e) => {

        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {
            e.preventDefault();
            //  var form = e.target.closest('.needs-validation');
            setIsLoaded(true);
            for (const p of duelist) {
                if (newVal !== 0) {
                    if (parseFloat(p.Due) < parseFloat(newVal)) {
                        const response = await fetch(process.env.REACT_APP_API + 'EggSale/EggSaleInvoicePaymentUpdate', {
                            method: 'PUT',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': localStorage.getItem('token')
                            },
                            body: JSON.stringify({
                                Id: p.Id,
                                Amount: p.Due,
                                PaymentDate: paymentDetails.PaymentDate,
                                Cash: paymentDetails.Cash,
                                PhonePay: paymentDetails.PhonePay,
                                NetBanking: paymentDetails.NetBanking,
                                UPI: paymentDetails.UPI,
                                Cheque: paymentDetails.Cheque,
                                Due: 0,
                                PaymentMode:paymentDetails.PaymentMode
                            })
                        });

                        const todo = await response.json()
                            .then((result) => {
                                if (result.StatusCode === 200) {
                                    newVal = parseFloat(paymentDetails.Amount) - parseFloat(p.Due);
                                }
                            });
                    }
                    else {

                        assignPaymentDetails(paymentDetails.PaymentMode,newVal);
                        const response = await fetch(process.env.REACT_APP_API + 'EggSale/EggSaleInvoicePaymentUpdate', {
                            method: 'PUT',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': localStorage.getItem('token')
                            },
                            body: JSON.stringify({
                                Id: p.Id,
                                Amount: newVal,
                                PaymentDate: paymentDetails.PaymentDate,
                                Cash: paymentDetails.Cash,
                                PhonePay: paymentDetails.PhonePay,
                                NetBanking: paymentDetails.NetBanking,
                                UPI: paymentDetails.UPI,
                                Cheque: paymentDetails.Cheque,
                                Due: parseFloat(p.Due) - parseFloat(newVal),
                                PaymentMode:paymentDetails.PaymentMode

                            })
                        });
                        const todo = await response.json()
                            .then((result) => {
                                if (result.StatusCode === 200) {
                                    newVal = 0;
                                }
                            })
                    }
                }
                else {
                    break;
                }
            }

            UpdatePaymentHistory();

            addCount(count);

            setIsLoaded(false);
        }

        setValidated(true);

    }


    return (

        <div>
            {isloaded && <Loading />}
            <div className="row justify-content-center"
                style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <h2>Payment In</h2>
            </div>

            <div className="container" style={{ marginTop: '20px', marginBottom: '10px' }}>
                <div className="row align-items-center" style={{ fontSize: 13 }}>
                    <Form noValidate validated={validated} className="needs-validation">
                        <Row className="mb-12">
                            <InputField label="Amount"
                                type="text"
                                value={paymentDetails.Amount}
                                name="Amount"
                                placeholder="Amount"
                                onChange={amountChange}
                                required={true}
                                disabled={false}
                                errormessage="Enter amount"
                            />

                            <Form.Group controlId="PaymentDate" as={Col} >
                                <Form.Label>Payment Date *</Form.Label>
                                <DateComponent date={null} onChange={paymentDateChange}
                                    isRequired={true} value={paymentDetails.PaymentDate} />
                                     <Form.Control.Feedback type="invalid">
                                                Please select date
                                            </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="PaymentMode" as={Col} >
                                <Form.Label>Payment Mode *</Form.Label>
                                <Form.Select
                                    onChange={paymentModeChange} required style={{ width: "150px", fontSize: 13 }}>
                                    <option selected disabled value="">Choose...</option>
                                    <option value="Cash">Cash</option>
                                    <option value="PhonePay">PhonePay</option>
                                    <option value="NetBanking">NetBanking</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Cheque">Cheque</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Please select payment mode
                                </Form.Control.Feedback>
                            </Form.Group>
                            {/* <div className="col-2">
                                <p><strong>Payment Mode</strong></p>
                                <select className="form-select" required aria-label="Default select example"
                                    style={{ width: "150px", fontSize: 13 }} onChange={paymentModeChange}>
                                    
                                </select>
                            </div> */}
                            <div className="col-2">
                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSettle(e)}>
                                    Settle
                                </Button>
                            </div>

                        </Row>
                    </Form>
                </div>
            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr className="tr-custom" align='center'>
                        <th>Invoice Date</th>
                        <th>Invoice No</th>
                        <th>Total Amount (<span>&#8377;</span>)</th>
                        <th>Due Amount (<span>&#8377;</span>)</th>
                        {/* <th>Amount Settled (<span>&#8377;</span>)</th> */}

                    </tr>
                </thead>
                <tbody>
                    {
                        duelist && duelist.length > 0 ? duelist.map((p) => {
                            return (
                                !isloaded && <tr align='center' style={{ fontSize: 13 }} key={p.Id}>

                                    <td align='center'>{moment(p.PurchaseDate).format('DD-MMM-YYYY')}</td>
                                    <td align='center'>{p.InvoiceNo}</td>
                                    <td align='center'>
                                        {new Intl.NumberFormat('en-IN', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(parseFloat(p.FinalCostInvoice).toFixed(2))}
                                    </td>
                                    <td align='center' style={{ color: '#ff0000' }}>{new Intl.NumberFormat('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(parseFloat(p.Due).toFixed(2))}</td>
                                    {/* <td>{ }</td> */}
                                    {/* <td> </td> */}

                                </tr>
                            )
                        }) : <tr>
                            <td style={{ textAlign: "center" }} colSpan={14}>
                                No Records
                            </td>
                        </tr>
                    }
                </tbody>
            </Table>
            <div className="row justify-content-center"
                style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <h4>Payment History</h4>
            </div>
            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr className="tr-custom" align='center'>
                        <th>Date</th>
                        <th>Amount (<span>&#8377;</span>)</th>
                        <th>Mode </th>

                    </tr>
                </thead>
                <tbody>
                    {
                        paymenthistorylist && paymenthistorylist.length > 0 ? paymenthistorylist.map((p) => {
                            return (
                                !isloaded && <tr align='center' style={{ fontSize: 13 }} key={p.Id}>

                                    <td align='center'>{moment(p.Date).format('DD-MMM-YYYY')}</td>
                                    <td align='center'>
                                        {new Intl.NumberFormat('en-IN', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(parseFloat(p.Amount).toFixed(2))}
                                    </td>
                                    
                                    <td>{p.PaymentMode }</td>
                                    {/* <td> </td> */}

                                </tr>
                            )
                        }) : <tr>
                            <td style={{ textAlign: "center" }} colSpan={14}>
                                No Records
                            </td>
                        </tr>
                    }
                </tbody>
            </Table>

        </div>
    )
}

export default EggSalePaymentIn
