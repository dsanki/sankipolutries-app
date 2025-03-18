import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import { HandleLogout, FetchAdvanceListByCustId, GetCustomerByTypeId } from './../../Utility'
import Loading from '../Loading/Loading'



function BirdSalePaymentIn(props) {
    let history = useNavigate();
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [isloaded, setIsLoaded] = useState();
    const search = useLocation().search;
    const [uid, setUid] = useState(new URLSearchParams(search).get('uid'));
    const [customertype, setCustomerType] = useState(process.env.REACT_APP_CUST_TYPE_BIRD);
    //const [customertype, setCustomerType] = useState(new URLSearchParams(search).get('custtype'));
    const [paymentamount, setPaymentAmount] = useState(0);
    const [duelist, setBirdSaleDueList] = useState([]);
    const [paymenthistorylist, setPaymentHistoryList] = useState([]);
    const [customerdetails, setCustomerDetails] = useState([]);
    const [validated, setValidated] = useState(false);
    const [advancedata, setAdvanceData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchcustomer, setSearchCustomer] = useState("");
    const [clientlist, setClientList] = useState([]);

    const [userid, setUserId] = useState();

    let addCount = (num) => {
        setCount(num + 1);
    };

    const _paymenthistory =
    {
        Id: "",
        CustomerId: uid,
        Amount: "",
        Date: "",
        PaymentMode: "",
        CompanyId: ""
    }

    const [paymenthistorydata, setPaymentHistoryData] = useState(_paymenthistory);

    const _paymentDetails = {
        CustomerId: uid,
        Amount: "",
        PaymentDate: "",
        PaymentMode: "",
        Id: "",
        PaymentDate: "",
        Cash: "",
        PhonePay: "",
        NetBanking: "",
        UPI: "",
        Cheque: "",
        CashDeposite: ""
    }

    const [paymentDetails, setPaymentDetails] = useState(_paymentDetails);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            setPaymentDetails({ ...paymentDetails, CustomerId: uid });
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);

    // useEffect((e) => {
    //     console.log(uid);
    // }, [uid]);


    // useEffect((e) => {

    //     if (localStorage.getItem('token')) {

    //         //fetchCustomerDetails(userid);
    //         //fetchAdvanceListByCustId(userid);
    //         //fetchPendingBirdSaleList(userid);
    //         //fetchBirdSalePaymentHistory(userid);
    //     }
    //     else {
    //         HandleLogout();
    //         history("/login")
    //     }
    // }, [userid]);

    useEffect((e) => {

        if (localStorage.getItem('token')) {

            //  fetchCustomerDetails(uid);
            if (uid != null) {
                fetchAdvanceListByCustId(uid);
                fetchPendingBirdSaleList(uid);
                fetchBirdSalePaymentHistory(uid);
            }

        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);


    useEffect(() => {
        fetchClient(process.env.REACT_APP_CUST_TYPE_BIRD);
    }, []);


    const fetchClient = async (customertype) => {
        GetCustomerByTypeId(customertype,
            process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setClientList(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found to fetch sheds!!", "danger")
                }
                else {
                    props.showAlert("Error occurred to fetch sheds!!", "danger")
                }

            });
    }

    const supplierOnChange = (e) => {
        //const [uid, setUid] = useState(new URLSearchParams(search).get('uid'));
        setUid(e.target.value);
        setSearchCustomer(e.target.value);
        setPaymentDetails({ ...paymentDetails, CustomerId: e.target.value });
        history('/birdsalepaymentin/?custtype=' + customertype + '&uid=' + e.target.value);
        addCount(count);
    }


    // const fetchCustomerDetails = async (custid) => {
    //     // if(custid=!null)
    //     // {
    //     fetch(process.env.REACT_APP_API + 'Customer/GetCustomerById?id=' + custid,
    //         {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': localStorage.getItem('token')
    //             }
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.StatusCode === 200) {
    //                 setCustomerDetails(data.Result);
    //             }
    //             else if (data.StatusCode === 401) {
    //                 HandleLogout();
    //                 history("/login")
    //             }
    //             else if (data.StatusCode === 404) {
    //                 props.showAlert("Data not found!!", "danger")
    //             }
    //             else {
    //                 props.showAlert("Error occurred!!", "danger")
    //             }
    //         });
    //     // }

    // }

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

    const assignPaymentDetails = (val, amt) => {
        if (val == "Cash") {
            setPaymentDetails({ ...paymentDetails, Cash: amt, PaymentMode: val });
        }
        else if (val == "PhonePay") {
            setPaymentDetails({ ...paymentDetails, PhonePay: amt, PaymentMode: val });
        }
        else if (val == "NetBanking") {
            setPaymentDetails({ ...paymentDetails, NetBanking: amt, PaymentMode: val });
        }
        else if (val == "CashDeposite") {
            setPaymentDetails({ ...paymentDetails, CashDeposite: amt, PaymentMode: val });
        }
        else if (val == "Cheque") {
            setPaymentDetails({ ...paymentDetails, Cheque: amt, PaymentMode: val });
        }
    }

    const paymentModeChange = (e) => {
        let paymentMode = e.target.value;
        assignPaymentDetails(paymentMode, paymentDetails.Amount);
    }


    const fetchBirdSalePaymentHistory = async (uid) => {
        setIsLoaded(true);
        fetch(process.env.REACT_APP_API + 'EggSale/GetPaymentHistoryByCustId?CustId='
            + uid + '&CompanyId=' + localStorage.getItem('companyid'),
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
                    setCount(data.Result.length);
                    setTotalPages(Math.ceil(data.Result.length / itemsPerPage));
                    setIsLoaded(false);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found fetchBirdSalePaymentHistory !!", "danger")
                }
                else {
                    props.showAlert("Error occurred  fetchBirdSalePaymentHistory !!", "danger")
                }
            });

        setIsLoaded(false);
    }

    // const commentsChange = (e) => {
    //     setPaymentDetails({ ...paymentDetails, Comments: e.target.value });
    // }

    const fetchPendingBirdSaleList = async (uid) => {
        setIsLoaded(true);
        fetch(process.env.REACT_APP_API + 'BirdSale/GetPendingBirdSaleInvoiceListByCustId?CustId='
            + uid + '&CompanyId=' + localStorage.getItem('companyid'),
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
                    setBirdSaleDueList(data.Result);
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

    const UpdatePaymentHistory = async (val) => {
        const response = await fetch(process.env.REACT_APP_API + 'EggSale/UpdatePaymentHistory', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({

                Amount: paymentDetails.Amount || val,
                Date: paymentDetails.PaymentDate || new Date(),
                PaymentMode: paymentDetails.PaymentMode || 'Cash',
                CustomerId: paymentDetails.CustomerId,
                CompanyId: localStorage.getItem('companyid'),
                PaymentType: 'In'
            })
        });
        const todo = await response.json()
            .then((result) => {
                if (result.StatusCode === 200) {
                    addCount(count);
                }
            });

    }

    const handlePayment = async (e) => {

        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {
            e.preventDefault();
            setIsLoaded(true);
            for (const p of duelist) {
                if (newVal !== 0) {
                    if (parseFloat(p.Due) < parseFloat(newVal)) {
                        const response = await fetch(process.env.REACT_APP_API
                            + 'BirdSale/BirdSalePaymentUpdate', {
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
                                PaymentMode: paymentDetails.PaymentMode
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

                        assignPaymentDetails(paymentDetails.PaymentMode, newVal);
                        const response = await fetch(process.env.REACT_APP_API + 'BirdSale/BirdSalePaymentUpdate', {
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
                                PaymentMode: paymentDetails.PaymentMode

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

            if (newVal > 0) {
                addAdvancePayment(newVal)
            }

            UpdatePaymentHistory(totalamt);

            addCount(count);

            setIsLoaded(false);
        }

        setValidated(true);

    }

    const addAdvancePayment = async (val) => {
        const response = await fetch(process.env.REACT_APP_API
            + 'AdvancePayment/AddAdvancePayment', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                Id: 0,
                Amount: val,
                Date: paymentDetails.PaymentDate || new Date(),
                PaymentMode: paymentDetails.PaymentMode || 'Cash',
                CustomerId: paymentDetails.CustomerId,
                CompanyId: localStorage.getItem('companyid'),
                AdvanceSettlement: false
            })
        });

        const todo = await response.json()
            .then((result) => {
                if (result.StatusCode === 200) {
                    addCount(count);
                }
            });

        //setIsLoaded(false);

    }

    const fetchAdvanceListByCustId = async (custid) => {

        FetchAdvanceListByCustId(custid)
            .then(data => {
                if (data.StatusCode === 200) {
                    setAdvanceData(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();

                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    setIsLoaded(false);
                    setAdvanceData("");
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                    setIsLoaded(false);
                    setAdvanceData("");
                }
            });
    }

    const settleAdvancePayment = async (e) => {
        let newAdvVal = advancedata.Amount;
        e.preventDefault();
        setIsLoaded(true);
        for (const p of duelist) {
            if (newAdvVal !== 0) {
                if (parseFloat(p.Due) < parseFloat(newAdvVal)) {
                    const response = await fetch(process.env.REACT_APP_API
                        + 'BirdSale/BirdSalePaymentUpdate', {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            Id: p.Id,
                            Amount: p.Due,
                            PaymentDate: new Date(),
                            Due: 0,
                            PaymentMode: 'Cash'
                        })
                    });

                    const todo = await response.json()
                        .then((result) => {
                            if (result.StatusCode === 200) {

                                updateAdvancePayment(p.Due);
                                UpdatePaymentHistory(p.Due);
                                newAdvVal = parseFloat(newAdvVal) - parseFloat(p.Due);
                            }
                        });
                }
                else {
                    const response = await fetch(process.env.REACT_APP_API
                        + 'BirdSale/BirdSalePaymentUpdate', {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            Id: p.Id,
                            Amount: newAdvVal,
                            PaymentDate: new Date(),
                            Due: parseFloat(p.Due) - parseFloat(newAdvVal),
                            PaymentMode: 'Cash'
                        })
                    });
                    const todo = await response.json()
                        .then((result) => {
                            if (result.StatusCode === 200) {
                                updateAdvancePayment(newAdvVal);
                                UpdatePaymentHistory(newAdvVal);
                                newAdvVal = 0;
                            }
                        })
                }
            }
            else {
                break;
            }
        }

        addCount(count);
        setIsLoaded(false);
    }


    const updateAdvancePayment = async (val) => {
        const response = await fetch(process.env.REACT_APP_API
            + 'AdvancePayment/UpdateAdvancePayment', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                Id: 0,
                Amount: val,
                Date: paymentDetails.PaymentDate || new Date(),
                PaymentMode: paymentDetails.PaymentMode || 'Cash',
                CustomerId: paymentDetails.CustomerId,
                CompanyId: localStorage.getItem('companyid'),
                AdvanceSettlement: true
            })
        });

        const todo = await response.json()
            .then((result) => {
                if (result.StatusCode === 200) {
                    //addUCount(count);
                }
            });

        //setIsLoaded(false);

    }


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }
    const handleNextClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }
    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }
    const preDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages
    //const itemsPerPage = variables.PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
    const endIndex = startIndex + parseInt(itemsPerPage);
    const itemsToDiaplay = paymenthistorylist.slice(startIndex, endIndex);

    if (itemsToDiaplay.length === 0 && paymenthistorylist.length > 0) {
        setCurrentPage(currentPage - 1);
    }

    const selectPaginationChange = (e) => {
        setItemsPerPage(e.target.value);
        addCount(count);
    }

    // const [searchcustomer, setSearchCustomer] = useState("");

    // const [customerid, setCustomerId] = useState(new URLSearchParams(search).get('uid'));
    // const [customertype, setCustomerType] = useState(new URLSearchParams(search).get('custtype'));

    const deletePaymentHistory = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'PaymentHistory/DeletePaymentHistory?id=' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => res.json())
                .then((data) => {
                    if (data.StatusCode === 200) {
                        addCount(count);
                        props.showAlert("Successfully deleted", "info")
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
                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    });
        }
    }

    return (

        <div>
            {isloaded && <Loading />}
            <div className="row justify-content-center"
                style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <h2>Payment In</h2>
            </div>

            <div class="row justify-content-center">
                <div class="col-4">
                    <Form noValidate validated={validated} className="needs-validation">
                        <div class="overflow-y-visible"
                            style={{ backgroundColor: '#dee2e6', padding: '7px' }}>

                            <div class="row justify-content-start">

                                <Form.Group controlId="Supplier" as={Col} >
                                    <Form.Label style={{ fontSize: '13px' }}>Supplier</Form.Label>
                                    <Form.Select style={{ fontSize: '13px' }}
                                        value={paymentDetails.CustomerId} onChange={supplierOnChange}>
                                        <option selected value="">Choose...</option>
                                        {
                                            clientlist.map((item) => {
                                                return (
                                                    <option
                                                        key={item.ID}
                                                        defaultValue={item.ID == null ? null : item.ID}
                                                        value={item.ID}

                                                    >{item.FirstName + " " + item.LastName}</option>
                                                );
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>

                            </div>
                            <div class="row justify-content-start">

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

                            </div>

                            <div class="row justify-content-start">

                                <Form.Group controlId="PaymentDate" as={Col} >
                                    <Form.Label>Payment Date *</Form.Label>
                                    <DateComponent date={null} onChange={paymentDateChange}
                                        isRequired={true} value={paymentDetails.PaymentDate} />
                                    <Form.Control.Feedback type="invalid">
                                        Please select date
                                    </Form.Control.Feedback>
                                </Form.Group>

                            </div>
                            <div class="row justify-content-start">

                                <Form.Group controlId="PaymentMode" as={Col} >
                                    <Form.Label>Payment Mode *</Form.Label>
                                    <Form.Select
                                        onChange={paymentModeChange} required style={{ width: "150px", fontSize: 13 }}>
                                        <option selected disabled value="">Choose...</option>
                                        <option value="Cash">Cash</option>
                                        <option value="PhonePay">PhonePay / UPI </option>
                                        <option value="NetBanking">Net Banking</option>
                                        <option value="CashDeposite">Cash Deposite</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Please select payment mode
                                    </Form.Control.Feedback>
                                </Form.Group>

                            </div>

                            <div class="row justify-content-start">
                                <div className="col-2">
                                    <Button variant="primary" type="submit"
                                        style={{ marginTop: "25px" }} onClick={(e) => handlePayment(e)}>
                                        Pay
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>

                <div class="col-8">
                    {
                        advancedata != null && advancedata.Amount > 0 && <div className="row justify-content-center">
                            <div className="alert alert-success" role="alert">
                                <strong>  Advance payment done of Rs: {parseFloat(advancedata.Amount || 0).toFixed(2)}</strong>
                                {
                                    duelist && duelist.length > 0 &&
                                    <Button variant="primary" type="submit" style={{ marginLeft: '20px' }}
                                        onClick={(e) => settleAdvancePayment(e)}>
                                        Settle
                                    </Button>
                                }

                            </div>
                        </div>
                    }

                    <div className="row justify-content-center"
                        style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>

                    </div>
                    <div className="row justify-content-center">
                        <p style={{ fontSize: '18px', textAlign: 'center' }}><strong>Due List</strong></p>
                        <div class="overflow-y-visible">
                            <Table className="mt-4" striped bordered hover size="sm">
                                <thead>
                                    <tr className="tr-custom" align='center'>
                                        <th>Invoice Date</th>
                                        <th>Invoice No</th>
                                        <th>Total Amount (<span>&#8377;</span>)</th>
                                        <th>Due Amount (<span>&#8377;</span>)</th>
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
                                                        }).format(parseFloat(p.FinalCost || 0).toFixed(2))}
                                                    </td>
                                                    <td align='center' style={{ color: '#ff0000' }}>{new Intl.NumberFormat('en-IN', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }).format(parseFloat(p.Due || 0).toFixed(2))}</td>
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
                    </div>

                    <div className="row justify-content-center">
                        {
                            itemsToDiaplay && itemsToDiaplay.length > 0 &&
                            <>
                                <div className="row justify-content-center"
                                    style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>

                                    <p style={{ fontSize: '18px' }}><strong>Payment History</strong></p>
                                </div>

                                <div class="overflow-y-visible">
                                    <Table striped bordered hover size="sm">
                                        <thead>
                                            <tr className="tr-custom" align='center'>
                                                <th>Date</th>
                                                <th>Amount (<span>&#8377;</span>)</th>
                                                <th>Mode </th>
                                                <th>Option</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {
                                                    return (
                                                        !isloaded && <tr align='center' style={{ fontSize: 13 }} key={p.Id}>

                                                            <td align='center'>{moment(p.Date).format('DD-MMM-YYYY')}</td>
                                                            <td align='center'>
                                                                {new Intl.NumberFormat('en-IN', {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                }).format(parseFloat(p.Amount).toFixed(2))}
                                                            </td>

                                                            <td>{p.PaymentMode}</td>
                                                            <td> {localStorage.getItem('isadmin') === 'true' &&
                                                                <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }}
                                                                    onClick={() => deletePaymentHistory(p.Id)}></i>}</td>
                                                        </tr>
                                                    )
                                                }) : <tr>
                                                    <td style={{ textAlign: "center", fontSize: '13px' }} colSpan={14}>
                                                        No Records
                                                    </td>
                                                </tr>
                                            }
                                        </tbody>
                                    </Table>
                                    {
                                        paymenthistorylist && paymenthistorylist.length > itemsPerPage &&
                                        <>
                                            <button
                                                onClick={handlePrevClick}
                                                disabled={preDisabled}
                                            >
                                                Prev
                                            </button>

                                            {

                                                Array.from({ length: totalPages }, (_, i) => {
                                                    return (
                                                        <button
                                                            onClick={() => handlePageChange(i + 1)}
                                                            key={i}
                                                            disabled={i + 1 === currentPage}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    )
                                                })
                                            }


                                            <button
                                                onClick={handleNextClick}
                                                disabled={nextDisabled}
                                            >
                                                Next
                                            </button>
                                        </>
                                    }
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BirdSalePaymentIn
