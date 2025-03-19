import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import moment from 'moment';
import { ErrorMessageHandle } from '../../Utility';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import {
    dateyyyymmdd, HandleLogout, downloadExcel, FetchGunnyBagSaleList,
    FetchCompanyDetails, AmountInWords, ConvertNumberToWords, ReplaceNonNumeric,
    Commarize, FecthEggSaleInvoiceList, GetCustomerByTypeId, GetGunnybagTypeList, downloadExcelFilter
} from './../../Utility'

import Loading from '../Loading/Loading'
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import InvoiceEggSale from '../Invoice/InvoiceEggSale';



function GunnyBag(props) {

    let history = useNavigate();
    //const { uid } = useParams();
    const search = useLocation().search;
    const [uid, setUid] = useState(new URLSearchParams(search).get('uid'));
    const [gunnybagsalelist, setGunnyBagSaleList] = useState([]);
    const [customerdetails, setCustomerDetails] = useState([]);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [validated, setValidated] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [invoiceModalShow, setInvoiceModalShow] = useState(false);
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");
    const [isloaded, setIsLoaded] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [clientlist, setClientList] = useState([]);
    const [gunnybagsalelistfilter, setGunnyBagSaleListFilter] = useState([]);
    const [companydetails, setCompanyDetails] = useState([JSON.parse(localStorage.getItem('companydetails'))]);
    const [gunnybagtypelist, setGunnyBagTypeList] = useState([]);
    const [ucount, setUCount] = useState(0);
    const [newcount, setAddNewCount] = useState(0);
    const objAddNew = useMemo(() => ({ newcount }), [newcount]);
    const objupdate = useMemo(() => ({ ucount }), [ucount]);

     const [companydetailsfromlocal, setCompanyDetailsFromLocal] = 
         useState(JSON.parse(localStorage.getItem('companydetails')));
    
    // const [itemsPerPage, setItemsPerPage] = useState(10);

    const initialGunnyBagSubvalues = {
        Id: '0',
        GunnyBagTypeId: '',
        Quantity: '',
        Rate: '',
        GST: '',
        Amount: '',
        ParentId: '0'
    }

    let addNewCount = (num) => {
        setAddNewCount(num + 1);
    };

    const addFields = (e) => {
        let object = {
            Id: '0',
            GunnyBagTypeId: '',
            Quantity: '',
            Rate: '',
            GST: '',
            Amount: '',
            ParentId: '0'
        }
        setGunnyBagFields([...formGunnyBagFields, object]);
        addNewCount(newcount);
    }

    let addUCount = (num) => {
        setUCount(num + 1);
    };

    const removeFields = (index) => {
        let data = [...formGunnyBagFields];
        data.splice(index, 1);
        setGunnyBagFields(data);
        addUCount(ucount);
    }

    const [formGunnyBagFields, setGunnyBagFields] = useState([
        {
            Id: '0',
            GunnyBagTypeId: '',
            Quantity: '',
            Rate: '',
            GST: '',
            Amount: '',
            ParentId: '0'
        }
    ])

    const initialvalues = {
        modaltitle: "",
        Id: 0,
        InvoiceNo: "",
        CustomerId: "",
        // Quantity: "",
        // Rate: "",
        Date: "",
        TotalAmount: "",
        Discount: "",
        Paid: "",
        Due: "",
        Comments: "",
        CompanyId: "",
        UnitId: "",
        PaymentDate: "",
        CustomerName: "",
        UnitName: "",
        GunnyBagSubValues: [initialGunnyBagSubvalues]
    }

    const [gunnybagsaledata, setGunnyBagSaleData] = useState(initialvalues);

    const clickAddGunnyBag = () => {
        setAddModalShow({ addModalShow: true });
        setGunnyBagFields([initialGunnyBagSubvalues]);
        setGunnyBagSaleData({
            modaltitle: "Add Gunny Bag",
            Id: 0,
            InvoiceNo: "",
            CustomerId: "",
            //sQuantity: "",
            //Rate: "",
            Date: "",
            TotalAmount: "",
            Discount: "",
            Paid: "",
            Due: "",
            Comments: "",
            CompanyId: "",
            UnitId: "",
            PaymentDate: "",
            CustomerName: "",
            UnitName: "",
            GunnyBagSubValues: [initialGunnyBagSubvalues]
        })
    }

    const clickEditGunnyBag = (gunnybag) => {
        setAddModalShow({ addModalShow: true });
        setGunnyBagFields(gunnybag.GunnyBagSubValues);
        setGunnyBagSaleData({
            modaltitle: "Edit Gunny Bag",
            Id: gunnybag.Id,
            InvoiceNo: gunnybag.InvoiceNo,
            CustomerId: gunnybag.CustomerId,
            Quantity: gunnybag.Quantity,
            Rate: gunnybag.Rate,
            Date: gunnybag.Date,
            TotalAmount: gunnybag.TotalAmount,
            Discount: gunnybag.Discount,
            Paid: gunnybag.Paid,
            Due: gunnybag.Due,
            Comments: gunnybag.Comments,
            CompanyId: gunnybag.CompanyId,
            UnitId: gunnybag.UnitId,
            PaymentDate: gunnybag.PaymentDate,
            CustomerName: gunnybag.CustomerName,
            UnitName: gunnybag.UnitName,
            GunnyBagSubValues: gunnybag.GunnyBagSubValues
        })
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchClient();
            fetchGunnyBagTypeList();

        }
        else {
            HandleLogout();
            history("/login")
        }
    }, []);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchGunnyBagSaleList(gunnybagsaledata.CustomerId, gunnybagsaledata.Id);
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            setGunnyBagSaleData({
                ...gunnybagsaledata, GunnyBagSubValues: formGunnyBagFields
            });
        }
        else {
        }
    }, [objAddNew]);

    useEffect((e) => {
        const { totalCost } =
            formGunnyBagFields.reduce((accumulator, item) => {
                accumulator.totalCost += item.Amount;
                return accumulator;
            }, { totalCost: 0 })


        setGunnyBagSaleData({
            ...gunnybagsaledata, Due: parseFloat(Math.round(totalCost -
                parseFloat(gunnybagsaledata.Paid || 0))).toFixed(2),
            TotalAmount: parseFloat(Math.round(totalCost)).toFixed(2), GunnyBagSubValues: formGunnyBagFields
        });

    }, [objupdate]);


    const fetchGunnyBagTypeList = async () => {
        setIsLoaded(true);
        GetGunnybagTypeList(process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setGunnyBagTypeList(data.Result);
                    setIsLoaded(false);
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
            })

        setIsLoaded(false);
    }

    const fetchGunnyBagSaleList = async (uid, id) => {
        setIsLoaded(true);
        FetchGunnyBagSaleList(uid, id, process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setGunnyBagSaleList(data.Result);
                    setGunnyBagSaleListFilter(data.Result);
                    setCount(data.Result.length);
                    setTotalPages(Math.ceil(data.Result.length / process.env.REACT_APP_PAGE_PAGINATION_NO));
                    setIsLoaded(false);
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
            })

        setIsLoaded(false);
    }

    const fetchClient = async () => {
        GetCustomerByTypeId(process.env.REACT_APP_CUST_TYPE_GUNNYBAG,
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


    const getFilterData = (fromDate, toDate) => {
        let _filterList = [];
        if (fromDate !== "" && toDate !== "") {
            _filterList = gunnybagsalelistfilter.filter((c) =>
                dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate)
                && dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
        }
        else if (fromDate === "" && toDate !== "") {
            _filterList = gunnybagsalelistfilter.filter((c) =>
                dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
        }
        else if (fromDate !== "" && toDate === "") {
            _filterList = gunnybagsalelistfilter.filter((c) =>
                dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate));
        }
        else {
            _filterList = gunnybagsalelistfilter;
        }
        setGunnyBagSaleList(_filterList);
    }

    const onDateFilterFromChange = (e) => {
        setFilterFromDate(e.target.value);
        getFilterData(e.target.value, filterToDate);
    }

    const onDateFilterToChange = (e) => {
        setFilterToDate(e.target.value);
        getFilterData(filterFromDate, e.target.value);
    }

    let addCount = (num) => {
        setCount(num + 1);
    };

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
    const itemsPerPage = process.env.REACT_APP_PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = gunnybagsalelist.slice(startIndex, endIndex);

    if (itemsToDiaplay.length === 0 && gunnybagsalelist.length > 0) {
        setCurrentPage(currentPage - 1);
    }

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    const deleteGunnyBag = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'GunnyBagSale/' + id, {
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

    // const invoiceDateChange = (e) => {
    //     setGunnyBagSaleData({ ...gunnybagsaledata, InvoiceDate: e.target.value });
    //   }

    //   const invoiceNoChange = (e) => {
    //     setGunnyBagSaleData({ ...meddata, InvoiceNo: e.target.value });
    //   }

    const clientChange = (e) => {
        setGunnyBagSaleData({ ...gunnybagsaledata, CustomerId: e.target.value });
    }
    const dateChange = (e) => {
        setGunnyBagSaleData({ ...gunnybagsaledata, Date: e.target.value });
    }

    const gunybagTypeChange = (e, index) => {
        let data = [...formGunnyBagFields];
        data[index]["GunnyBagTypeId"] = e.target.value;
        setGunnyBagFields(data);
        addUCount(ucount);
        //setGunnyBagSaleData({ ...gunnybagsaledata, Date: e.target.value });
    }

    const gstChange = (e, index) => {
        const re = /^\d*\.?\d{0,2}$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            let data = [...formGunnyBagFields];

            data[index]["GST"] = e.target.value;


            let gstpercentage = parseFloat(e.target.value || 0) / 100;

            let totalamount = (parseFloat(data[index]["Rate"] || 0))
                * parseInt(data[index]["Quantity"] || 0);

            let totalgst = totalamount * gstpercentage;
            let totalinclGST = totalamount + totalgst;

            data[index]["Amount"] = totalinclGST;

            setGunnyBagFields(data);
            addUCount(ucount);
        }
    }


    const quantityChange = (e, index) => {

        const re = /^[0-9\b]+$/;
        let data = [...formGunnyBagFields];

        if (e.target.value === '' || re.test(e.target.value)) {

            let _unitprice = data[index]["Rate"];
            let totalamount = (parseFloat(_unitprice || 0)) * parseInt(e.target.value);

            let gstpercentage = data[index]["GST"] / 100;

            let totalgst = totalamount * gstpercentage;
            let totalinclGST = totalamount + totalgst;

            data[index]["Quantity"] = e.target.value;
            data[index]["Amount"] = totalinclGST;

            setGunnyBagFields(data);

            addUCount(ucount);

        }
        // setGunnyBagSaleData({
        //     ...gunnybagsaledata, Quantity: e.target.value,
        //     TotalAmount: Math.round(e.target.value * gunnybagsaledata.Rate),
        //     Due: ((e.target.value * gunnybagsaledata.Rate) - parseFloat(gunnybagsaledata.Paid || 0)).toFixed(2)
        // });
    }

    const rateChange = (e, index) => {

        const re = /^\d*\.?\d{0,2}$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            let data = [...formGunnyBagFields];

            data[index]["Rate"] = e.target.value;

            let gstpercentage = parseFloat(data[index]["GST"] || 0) / 100;
            let totalamount = (parseFloat(e.target.value)) * parseFloat(data[index]["Quantity"] || 0);
            let totalgst = totalamount * gstpercentage;
            let totalinclGST = totalamount + totalgst;

            data[index]["Amount"] = totalinclGST;

            setGunnyBagFields(data);

            addUCount(ucount);

        }


        // setGunnyBagSaleData({
        //     ...gunnybagsaledata, Rate: e.target.value,
        //     TotalAmount: Math.round(e.target.value * gunnybagsaledata.Quantity),
        //     Due: ((e.target.value * gunnybagsaledata.Quantity) - parseFloat(gunnybagsaledata.Paid || 0)).toFixed(2)
        // });
    }

    const paidChange = (e) => {
        setGunnyBagSaleData({
            ...gunnybagsaledata, Paid: e.target.value,
            Due: (parseFloat(gunnybagsaledata.TotalAmount || 0) - parseFloat(e.target.value || 0)).toFixed(2)
        });
    }

    const paymentDateChange = (e) => {
        setGunnyBagSaleData({ ...gunnybagsaledata, PaymentDate: e.target.value });
    }

    const commentsChange = (e) => {
        setGunnyBagSaleData({ ...gunnybagsaledata, Comments: e.target.value });
    }

    const discountChange = (e) => {
        setGunnyBagSaleData({
            ...gunnybagsaledata, Discount: e.target.value,
            TotalAmount: Math.round((gunnybagsaledata.Quantity * gunnybagsaledata.Rate)
                - parseFloat(e.target.value || 0)),
            Due: (((gunnybagsaledata.Quantity * gunnybagsaledata.Rate) - parseFloat(e.target.value || 0))
                - parseFloat(gunnybagsaledata.Paid || 0)).toFixed(2)
        });
    }

    //

    const handleAddGunnyBag = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'GunnyBagSale/GunnyBagSaleAdd', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: gunnybagsaledata.Id,
                    InvoiceNo: gunnybagsaledata.InvoiceNo,
                    CustomerId: gunnybagsaledata.CustomerId,
                    Quantity: gunnybagsaledata.Quantity,
                    Rate: gunnybagsaledata.Rate,
                    Date: gunnybagsaledata.Date,
                    TotalAmount: gunnybagsaledata.TotalAmount,
                    Discount: gunnybagsaledata.Discount,
                    Paid: gunnybagsaledata.Paid,
                    Due: gunnybagsaledata.Due,
                    Comments: gunnybagsaledata.Comments,
                    CompanyId: localStorage.getItem('companyid'),
                    // UnitId: gunnybagsaledata.UnitId,
                    PaymentDate: gunnybagsaledata.PaymentDate,
                    GunnyBagSubValues: gunnybagsaledata.GunnyBagSubValues
                    // CustomerName: gunnybagsaledata.CustomerName,
                })
            })
                .then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
                    }
                    else if (result.StatusCode === 401) {
                        HandleLogout();
                        history("/login")
                    }
                    else if (result.StatusCode === 404) {
                        props.showAlert("Data not found!!", "danger")
                    }
                    else {
                        props.showAlert("Error occurred!!", "danger")
                    }
                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    })

            setValidated(false);
        }
    }

    const handleEditGunnyBag = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'GunnyBagSale/UpdateGunnyBagSale', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({

                    Id: gunnybagsaledata.Id,
                    InvoiceNo: gunnybagsaledata.InvoiceNo,
                    CustomerId: gunnybagsaledata.CustomerId,
                    Quantity: gunnybagsaledata.Quantity,
                    Rate: gunnybagsaledata.Rate,
                    Date: gunnybagsaledata.Date,
                    TotalAmount: gunnybagsaledata.TotalAmount,
                    Discount: gunnybagsaledata.Discount,
                    Paid: gunnybagsaledata.Paid,
                    Due: gunnybagsaledata.Due,
                    Comments: gunnybagsaledata.Comments,
                    CompanyId: localStorage.getItem('companyid'),
                    // UnitId: gunnybagsaledata.UnitId,
                    PaymentDate: gunnybagsaledata.PaymentDate,
                    // CustomerName: gunnybagsaledata.CustomerName,
                    GunnyBagSubValues: gunnybagsaledata.GunnyBagSubValues

                })
            })
                .then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
                    }
                    else if (result.StatusCode === 401) {
                        HandleLogout();
                        history("/login")
                    }
                    else if (result.StatusCode === 404) {
                        props.showAlert("Data not found!!", "danger")
                    }
                    else {
                        props.showAlert("Error occurred!!", "danger")
                    }
                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    })

            setValidated(false);
        }
    }

    const onDownloadExcel = () => {
                const _list = gunnybagsalelist.map((p) => {
                  return ({
                                  Date: moment(p.Date).format('DD-MMM-YYYY'),
                                  CustomerName: p.CustomerName,
                                  TotalCost: parseFloat(p.TotalAmount ||0).toFixed(2)
                              });
                });
    
                
    
              downloadExcelFilter(_list, "GunnyBag", companydetailsfromlocal.CompanyName,filterFromDate,filterToDate);
            }


    return (
        <div>
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <h4>Gunny Bag Sale Tracker</h4>
            </div>

            <div className="container" style={{ marginTop: '30px' }}>
                <div className="row align-items-center">
                    <div className="col-2">
                        <p style={{ fontSize: '13px' }}><strong>From</strong></p>
                        <DateComponent date={null} onChange={onDateFilterFromChange}
                            isRequired={false} value={filterFromDate} />
                    </div>
                    <div className="col-2">
                        <p style={{ fontSize: '13px' }}><strong>To</strong></p>
                        <DateComponent date={null} onChange={onDateFilterToChange}
                            isRequired={false} value={filterToDate} />
                    </div>
                    <div className="col-6" style={{ textAlign: 'right', marginTop: '38px' }}>

                    <i className="fa-regular fa-file-excel fa-2xl"
                            style={{ color: '#bea2a2', marginRight: 30 }}
                            title='Download Gunny Bag List' onClick={() => onDownloadExcel()} ></i>

                        {/* <i className="fa-regular fa-file-excel fa-2xl"
                            style={{ color: '#bea2a2', marginRight: 30 }} 
                        ></i> */}
                        <Button className="mr-2" variant="primary"
                            style={{ marginRight: "17.5px" }}
                            onClick={() => clickAddGunnyBag()}>Add</Button>
                    </div>
                </div>

            </div>

            {
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr align='center' className="tr-custom">
                            <th>Date</th>
                            <th>Invoice no</th>
                            <th>Customer name</th>
                            <th>Total amount</th>
                            <th>Paid</th>
                            <th>Due</th>
                            <th>PaymentDate</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((gunny) => {
                                return (
                                    !isloaded && <tr key={gunny.Id} align='center' style={{ fontSize: 13 }} >
                                        <td align='center'>{moment(gunny.Date).format('DD-MMM-YYYY')}</td>
                                        <td>{gunny.InvoiceNo}</td>
                                        <td>{gunny.CustomerName}</td>
                                        {/* <td>  {new Intl.NumberFormat('en-IN', {
                                        }).format(parseInt(gunny.Quantity))}</td> */}
                                        {/* <td>{gunny.Rate}</td>
                                        <td>{gunny.Discount}</td> */}
                                        <td>{gunny.TotalAmount}</td>
                                        <td>{gunny.Paid}</td>
                                        <td>{gunny.Due}</td>
                                        <td>{moment(gunny.PaymentDate).format('DD-MMM-YYYY')}</td>




                                        <td align='center'>
                                            {
                                                <ButtonToolbar>
                                                    <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditGunnyBag(gunny)}></i>

                                                    {localStorage.getItem('isadmin') === 'true' &&
                                                        <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteGunnyBag(gunny.Id)}></i>}

                                                </ButtonToolbar>
                                            }
                                        </td>
                                    </tr>
                                )
                            }) : <tr>
                                <td style={{ textAlign: "center", fontSize: '13px' }} colSpan={14}>
                                    No Records
                                </td>
                            </tr>
                        }
                    </tbody>
                </Table >
            }

            {
                gunnybagsalelist && gunnybagsalelist.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
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

            <div className="container" id="exampleModal">
                <Modal
                    show={addModalShow}
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: '18px' }}>
                            {gunnybagsaledata.modaltitle}
                        </Modal.Title>
                        <button type="button" class="btn-close" aria-label="Close"
                            onClick={addModalClose}> </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <div>
                                    <Form noValidate validated={validated} className="needs-validation">

                                        <Row className="mb-12">

                                            <Form.Group as={Col} controlId="Date">
                                                <Form.Label style={{ fontSize: 13 }}>Date</Form.Label>
                                                <DateComponent date={null} onChange={dateChange}
                                                    isRequired={true} value={gunnybagsaledata.Date} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select date
                                                </Form.Control.Feedback>

                                            </Form.Group>
                                            <Form.Group controlId="ClientId" as={Col} >
                                                <Form.Label style={{ fontSize: 13 }}>Customer</Form.Label>
                                                <Form.Select style={{ fontSize: 13 }}
                                                    onChange={clientChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {

                                                        clientlist.length > 0 && clientlist.map((item) => {

                                                            let fullname = (item.MiddleName != "" && item.MiddleName != null) ?
                                                                item.FirstName + " " + item.MiddleName + " " + item.LastName :
                                                                item.FirstName + " " + item.LastName;
                                                            return (
                                                                <option value={item.ID} key={item.ID}
                                                                    selected={item.ID === gunnybagsaledata.CustomerId}>{fullname}</option>)
                                                        })


                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select customer
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <div className="row">
                                                <form>
                                                    <Row className="mb-12" style={{ fontSize: '12px', marginTop: '10px' }}>
                                                        <div class="col-3"><p class="form-label">Gunnybag Type</p></div>
                                                        <div class="col"><p class="form-label">Quantity</p></div>
                                                        <div class="col"><p class="form-label">Unit Price</p></div>
                                                        <div class="col"><p class="form-label">GST</p></div>
                                                        <div class="col-2"><p class="form-label">Amount</p></div>
                                                        <div class="col"><p class="form-label" ing>Delete</p></div>
                                                        <hr className="line" />
                                                    </Row>


                                                    {gunnybagsaledata != null && gunnybagsaledata.GunnyBagSubValues != null
                                                        && gunnybagsaledata.GunnyBagSubValues.map((form, index) => {
                                                            return (
                                                                <div key={index} style={{ marginTop: 10 }}>
                                                                    <Row className="mb-12">
                                                                        <Form.Group controlId="GunnyBagTypeName" as={Col} className="col-3">
                                                                            {/* <Form.Label style={{ fontSize: 13 }}>Medicine name</Form.Label> */}
                                                                            <Form.Select style={{ fontSize: 13 }}
                                                                                onChange={event => gunybagTypeChange(event, index)} required>
                                                                                <option selected disabled value="">Choose Gunnybag type</option>
                                                                                {
                                                                                    //const [gunnybagtypelist, setGunnyBagTypeList] = useState([]);
                                                                                    gunnybagtypelist.map((item) => {
                                                                                        return (
                                                                                            <option
                                                                                                key={item.Id}
                                                                                                defaultValue={item.Id == null ? null : item.Id}
                                                                                                selected={item.Id === form.GunnyBagTypeId}
                                                                                                value={item.Id}
                                                                                            >{item.Name}</option>
                                                                                        );
                                                                                    })
                                                                                }
                                                                            </Form.Select>
                                                                            <Form.Control.Feedback type="invalid">
                                                                                Please select Gunnybag type
                                                                            </Form.Control.Feedback>
                                                                        </Form.Group>

                                                                        <InputField controlId="Quantity" label=""
                                                                            type="text"
                                                                            value={form.Quantity}
                                                                            name="Quantity"
                                                                            placeholder="Quantity"
                                                                            errormessage="Please enter quantity"
                                                                            required={true}
                                                                            disabled={false}
                                                                            onChange={event => quantityChange(event, index)}
                                                                        />

                                                                        <InputField controlId="Rate" label=""
                                                                            type="text"
                                                                            value={form.Rate}
                                                                            name="Rate"
                                                                            placeholder="Unit price"
                                                                            errormessage="Please enter unit price"
                                                                            required={true}
                                                                            disabled={false}
                                                                            onChange={event => rateChange(event, index)}
                                                                        />

                                                                        <InputField controlId="GST" label=""
                                                                            type="text"
                                                                            value={form.GST}
                                                                            name="GST"
                                                                            placeholder="GST"
                                                                            errormessage="Please enter GST"
                                                                            required={false}
                                                                            disabled={false}
                                                                            onChange={event => gstChange(event, index)}
                                                                        //
                                                                        />

                                                                        <InputField controlId="Amount" label=""
                                                                            type="number"
                                                                            value={parseFloat(Math.round(form.Amount)).toFixed(2)}
                                                                            name="Amount"
                                                                            placeholder="Amount"
                                                                            errormessage="Enter amount"
                                                                            required={true}
                                                                            disabled={true}
                                                                            collength="col-2"
                                                                        />

                                                                        <div className="col">
                                                                            <i className="fa-solid fa-trash" style={{
                                                                                color: '#f81616',
                                                                                marginLeft: '15px'
                                                                            }}
                                                                                onClick={() => removeFields(index)}></i>

                                                                        </div>
                                                                    </Row>
                                                                </div>
                                                            )
                                                        })}
                                                </form>
                                            </div>
                                            <i class="fa-solid fa-circle-plus" style={{ marginTop: '5px', width: '25px' }}
                                                onClick={(e) => addFields(e)}></i>
                                            <hr className="line" style={{ marginTop: '20px' }} />
                                        </Row>

                                        <Row className="mb-12">
                                            <div className="col-8">
                                                <p class="form-label">Total :</p>
                                            </div>
                                            <div className="col-4" style={{ textAlign: 'left' }}>
                                                <p class="form-label"><span>&#8377;</span> {parseFloat(gunnybagsaledata.TotalAmount || 0).toFixed(2)}</p>
                                            </div>
                                            <hr className="line" style={{ marginTop: '10px' }} />
                                        </Row>

                                        {/* {

                                            parseFloat(meddata.AdvanceAmount || 0) > 0 ?
                                                <Row className="mb-12">
                                                    <div className="col-6">
                                                        <p class="form-label" style={{ color: 'green' }}>
                                                            Advance payment done Rs: {parseFloat(meddata.AdvanceAmount || 0).toFixed(2)}</p>
                                                    </div>
                                                    <div className="col-6">
                                                        <Form.Check
                                                            type="checkbox"
                                                            id="chkIsActive"
                                                            label="Settle advance amount"
                                                            onChange={settleAdvancePayment}
                                                            value={gunnybagsaledata.IsSettle}
                                                            checked={gunnybagsaledata.IsSettle}
                                                            style={{ fontSize: '13px', fontWeight: 'bold' }}
                                                        />
                                                    </div>
                                                    <hr className="line" style={{ marginTop: '10px' }} />
                                                </Row> : ""
                                        } */}
                                        <Row className="mb-12">

                                            <InputField controlId="Paid" label="Paid"
                                                type="number"
                                                value={gunnybagsaledata.Paid}
                                                name="Paid"
                                                placeholder="Paid"
                                                errormessage="Please enter paid amount"
                                                required={false}
                                                disabled={false}
                                                onChange={paidChange}
                                            />

                                            <InputField controlId="Due" label="Due"
                                                type="number"
                                                value={parseFloat(gunnybagsaledata.Due || 0).toFixed(2)}
                                                name="Due"
                                                placeholder="Due"
                                                errormessage="Please enter due amount"
                                                required={false}
                                                disabled={true}
                                            />

                                            <Form.Group as={Col} controlId="PaymentDate">
                                                <Form.Label style={{ fontSize: 13 }}>Payment date</Form.Label>
                                                <DateComponent date={null} onChange={paymentDateChange}
                                                    isRequired={false} value={gunnybagsaledata.PaymentDate} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select payment date
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        {/* 
                                        <Row className="mb-12">

                                            <InputField controlId="ChequeRefNo" label="Cheque Ref No"
                                                type="text"
                                                value={meddata.ChequeRefNo}
                                                name="ChequeRefNo"
                                                placeholder="Cheque Ref No"
                                                errormessage="Enter Cheque Ref No"
                                                required={false}
                                                disabled={false}
                                                onChange={chequeRefNoChange}
                                            />

                                        </Row> */}
                                        <Row className="mb-12">
                                            <Form.Group controlId="Comments" as={Col} >
                                                <Form.Label style={{ fontSize: 13 }}>Comments</Form.Label>
                                                <Form.Control as="textarea" rows={3} style={{ fontSize: 13 }}
                                                    name="Comments" onChange={commentsChange} value={gunnybagsaledata.Comments}
                                                    placeholder="Comments" />
                                            </Form.Group>
                                        </Row>

                                        <Form.Group as={Col}>
                                            {gunnybagsaledata.Id <= 0 ?

                                                <Button variant="primary" className="btn-primary-custom"
                                                    type="submit" style={{ marginTop: "30px" }}
                                                    onClick={(e) => handleAddGunnyBag(e)}>
                                                    Add
                                                </Button>
                                                : null
                                            }

                                            {gunnybagsaledata.Id > 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }}
                                                    onClick={(e) => handleEditGunnyBag(e)}>
                                                    Update
                                                </Button>
                                                : null
                                            }

                                            <Button variant="danger" className="btn-danger-custom"
                                                style={{ marginTop: "30px", marginLeft: "10px" }} onClick={() => {
                                                    addModalClose();
                                                }
                                                }>Close</Button>

                                        </Form.Group>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
            </div >

        </div>
    )
}

export default GunnyBag
