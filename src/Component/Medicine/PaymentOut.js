import React, { useState, useEffect, useMemo, Fragment, useRef } from 'react'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useLocation  } from 'react-router-dom'
import { FiSearch } from "react-icons/fi";
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import { HandleLogout, GetCustomerByTypeId } from './../../Utility'
import Loading from '../Loading/Loading'
import "../../App.css";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';


function PaymentOut(props) {
    let history = useNavigate();
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [isloaded, setIsLoaded] = useState(true);
    const [paymenthistorylist, setPaymentHistoryList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [customers, setCustomerList] = useState([]);
    const [clientlist, setClientList] = useState([]);
    const [filtered, setfiltered] = useState([]);
    const [searchcustomer, setSearchCustomer] = useState("");
    const [medicinependinglist, setMedicinePurchasePendingList] = useState([]);
    const [medicinependinglistfilter, setMedicinePurchasePendingListFilter] = useState([]);
    const search = useLocation().search;
    const [customerid, setCustomerId] = useState(new URLSearchParams(search).get('uid'));
   // let his = useHistory();
    const searchRef = useRef();

    const [ucount, setUCount] = useState(0);
    const objU = useMemo(() => ({ ucount }), [ucount]);

    useEffect(() => {
        fetchClient();
    }, []);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchPendingMedcineInvoiceList(parseInt(paymentDetails.CustomerId || 0));
            fetchMedicinePaymentOutHistory(parseInt(paymentDetails.CustomerId || 0));
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);

    useEffect((e) => {
        fetchMedicinePaymentOutHistory(parseInt(paymentDetails.CustomerId || 0));
    }, [objU]);

    useEffect(() => {
        let data = customers.filter((item) =>
            item.FirstName.toLowerCase().includes(searchcustomer.toLowerCase()) ||
            item.LastName.toLowerCase().includes(searchcustomer.toLowerCase())
        )

        setfiltered(data);

        // const close = document.getElementsByClassName(
        //     "MuiAutocomplete-clearIndicator"
        // )[0];

        // // Add a Click Event Listener to the button
        // close.addEventListener("click", () => {
        //     setSearchCustomer("");
        //     setPaymentHistoryList("");
        //    // var data= medicinependinglistfilter;
        //     setMedicinePurchasePendingList(medicinependinglistfilter);
        // });

    }, [searchcustomer]);

    const customerChange = (e) => {
        setSearchCustomer(e.target.value);
        //alert(customerid);
    }
    const supplierOnChange = (e) => {
        setSearchCustomer(e.target.value);

        setPaymentDetails({ ...paymentDetails, CustomerId: e.target.value });
        history('/paymentout/?uid='+e.target.value);
        addCount(count);
    }

    const fetchClient = async () => {
        GetCustomerByTypeId(process.env.REACT_APP_CUST_TYPE_MEDICINE,
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

    const fetchCustomer = async () => {
        fetch(process.env.REACT_APP_API + 'Customer/GetCustomer',
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
                    var filterList = data.Result;

                    setCustomerList(filterList);
                }
                else if (data.StatusCode === 401) {
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

    const paymentModeChange = (e) => {
        let paymentMode = e.target.value;
        setPaymentDetails({ ...paymentDetails, PaymentMode: e.target.value });
    }

    const _paymentDetails = {
        CustomerId: customerid,
        Amount: "",
        PaymentDate: "",
        PaymentMode: "",
        Id: "",
        PaymentDate: "",

    }

    const [paymentDetails, setPaymentDetails] = useState(_paymentDetails);

    const [totalamt, setTotalAmt] = useState(0);
    let newVal = totalamt;

    const handlePaymentOut = async (e) => {

        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {
            e.preventDefault();
            setIsLoaded(true);
            for (const p of medicinependinglist) {
                if (newVal !== 0) {
                    if (parseFloat(p.Due) < parseFloat(newVal)) {
                        const response = await fetch(process.env.REACT_APP_API
                            + 'Medicine/MedicineInvoicePaymentUpdate', {
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
                                Due: 0
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
                        const response = await fetch(process.env.REACT_APP_API
                            + 'Medicine/MedicineInvoicePaymentUpdate', {
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
                                Due: parseFloat(p.Due) - parseFloat(newVal)
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

    const fetchPendingMedcineInvoiceList = async (uid) => {
        setIsLoaded(true);
        fetch(process.env.REACT_APP_API + 'Medicine/GetPendingMedicinePurchaseInvoiceList?CustId='
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
                    setMedicinePurchasePendingList(data.Result);
                    setMedicinePurchasePendingListFilter(data.Result);
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

    const UpdatePaymentHistory = async () => {
        const response = await fetch(process.env.REACT_APP_API
            + 'EggSale/UpdatePaymentHistory', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                Amount: paymentDetails.Amount,
                Date: paymentDetails.PaymentDate,
                PaymentMode: paymentDetails.PaymentMode,
                CustomerId: paymentDetails.CustomerId,
                CompanyId: localStorage.getItem('companyid')
            })
        });

        const todo = await response.json()
            .then((result) => {
                if (result.StatusCode === 200) {
                    addUCount(count);
                }
            });

        setIsLoaded(false);

    }

    

    let addUCount = (num) => {
        setUCount(num + 1);
    };

    let addCount = (num) => {
        setCount(num + 1);
    };

    let requestTimer = null;


    const fetchMedicinePaymentOutHistory = async (uid) => {
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

    return (

        <div>

            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <h4> Payment out</h4>
            </div>
            <div className="row align-items-center" style={{ fontSize: 13 }}>
                <Form noValidate validated={validated} className="needs-validation">


                    {/* <Row className="mb-12">
                <Autocomplete className="pding"
                    id="autoCustomerList"
                    options={customers}
                    getOptionLabel={option => option.FirstName + " " + option.LastName}
                    style={{ width: 500, fontSize:'13px' }}
                    renderItem={(item, isHighlighted) =>
                        <div style={{fontSize:'13px' }} className={`item ${isHighlighted ? 'selected-item' : ''}`}>
                          {item.FirstName+ " " + item.LastName}
                        </div>
                      }

                    onChange={(event, value) => {
                        setPaymentDetails({ ...paymentDetails, CustomerId: value.ID });

                     var data= medicinependinglistfilter.filter((c) => c.CustomerId === value.ID);
                     setMedicinePurchasePendingList(data);

                     fetchMedicinePaymentOutHistory(parseInt(value.ID || 0));
                    }}

                    renderInput={params => (
                        <TextField style={{fontSize:'13px' }}  {...params} label="Customers.." variant="outlined" fullWidth />
                    )}
                />
            </Row> */}


                    <Row className="mb-12">

                        <div className="col-4">

                            <Form.Group controlId="Supplier" as={Col} >
                                <Form.Label style={{ fontSize: '13px' }}>Supplier</Form.Label>
                                <Form.Select style={{ fontSize: '13px', width:'400px' }}
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

                        <div className="col-2">
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
                       <div className="col-2">
                        <Form.Group controlId="PaymentDate" as={Col} >
                            <Form.Label style={{ fontSize: '13px' }}>Payment Date *</Form.Label>
                            <DateComponent date={null} onChange={paymentDateChange}
                                isRequired={true} value={paymentDetails.PaymentDate} />
                            <Form.Control.Feedback type="invalid">
                                Please select date
                            </Form.Control.Feedback>
                        </Form.Group>
                        </div>
                        <div className="col-2">
                        <Form.Group controlId="PaymentMode" as={Col} >
                            <Form.Label style={{ fontSize: '13px' }}>Payment Mode *</Form.Label>
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
                        </div>
                        <div className="col-2">
                            <Button variant="primary" type="submit" style={{ marginTop: "25px" }} onClick={(e) => handlePaymentOut(e)}>
                                Pay
                            </Button>
                        </div>

                    </Row>

                </Form>
            </div>
            <div className="row justify-content-center"
                        style={{ textAlign: 'center', marginTop: '20px', marginBottom: '10px' }}>
                        <p style={{fontSize:'18px'}}><strong>Due List</strong></p>
                    </div>
            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr className="tr-custom" align='center'>
                        <th>Client name</th>
                        <th>Invoice Date</th>
                        <th>Invoice No</th>
                        <th>Total Amount (<span>&#8377;</span>)</th>
                        <th>Due Amount (<span>&#8377;</span>)</th>
                        {/* <th>Amount Settled (<span>&#8377;</span>)</th> */}

                    </tr>
                </thead>
                <tbody>
                    {
                        medicinependinglist && medicinependinglist.length > 0 ? medicinependinglist.map((p) => {
                            return (
                                !isloaded && <tr align='center' style={{ fontSize: 13 }} key={p.Id}>
                                    <td align='center'>{p.CustomerName}</td>
                                    <td align='center'>{moment(p.InvoiceDate).format('DD-MMM-YYYY')}</td>
                                    <td align='center'>{p.InvoiceNo}</td>
                                    <td align='center'>
                                        {new Intl.NumberFormat('en-IN', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(parseFloat(p.TotalAmount).toFixed(2))}
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



            {
                paymenthistorylist && paymenthistorylist.length > 0 &&
                <>
                    <div className="row justify-content-center"
                        style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
                       
                        <p style={{fontSize:'18px'}}><strong>Payment History</strong></p>
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

                                            <td>{p.PaymentMode}</td>
                                            {/* <td> </td> */}

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
                </>
            }
        </div>
    )
}

export default PaymentOut
