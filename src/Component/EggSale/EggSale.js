import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import moment from 'moment';
import { ErrorMessageHandle } from '../../Utility';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import {
    dateyyyymmdd, HandleLogout, downloadExcel,
    FetchCompanyDetails, AmountInWords, ConvertNumberToWords, ReplaceNonNumeric,
    Commarize, FecthEggSaleInvoiceList, FecthEggCategory, FetchAdvanceListByCustId, downloadExcelFilter
} from './../../Utility'

import Loading from '../Loading/Loading'
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import InvoiceEggSale from '../Invoice/InvoiceEggSale';



function EggSale(props) {

    let history = useNavigate();
    //const { uid } = useParams();
    const search = useLocation().search;
    const [uid, setUid] = useState(new URLSearchParams(search).get('uid'));
    const [eggsalelist, setEggSaleList] = useState([]);
    const [customerdetails, setCustomerDetails] = useState([]);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [validated, setValidated] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [invoiceModalShow, setInvoiceModalShow] = useState(false);
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");
    const [isloaded, setIsLoaded] = useState(true);
    const [eggsalelistfilter, setEggSaleListFilter] = useState([]);
    // const [companydetails, setCompanyDetails] = useState([]);
    const [companydetails, setCompanyDetails] = useState([JSON.parse(localStorage.getItem('companydetails'))]);
    const [eggcategory, setEggCategory] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [advancedata, setAdvanceData] = useState([]);
    const initialvalues = {
        modaltitle: "",
        Id: 0,
        InvoiceNo: "",
        CustomerId: uid,
        TotalQuantity: "",
        PurchaseDate: "",
        TotalCost: "",
        TotalDiscount: "",
        FinalCostInvoice: "",
        Paid: "",
        Due: "",
        EggSale: [],
        VehicleNo: "",
        AdditionalCharge: "",
        Cash: "",
        PhonePay: "",
        NetBanking: "",
        CashDeposite: "",
        Cheque: "",
        Complimentary: ""
    }

    const [eggsaledata, setEggSaletData] = useState(initialvalues);

    const clickAddEggSale = (p) => {
        history("/eggsalemodule/" + uid);
    }

    const clickEditEggSale = (p) => {
        history("/eggsalemodule/" + uid + "/" + p.Id);
    }

    const _bankdetails = {
        BankName: "",
        AccountNo: "",
        IfscCode: "",
        BankName: ""

    }

    const [bankdetails, setBankDetails] = useState(_bankdetails);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            setEggSaletData({ ...eggsaledata, CustomerId: uid });
            fetchCustomerDetails(uid);
            // fetchCompanyDetails();
            fetchEggCategory();

            setBankDetails({
                ...bankdetails, BankName: process.env.REACT_APP_BANK_NAME,
                AccountNo: process.env.REACT_APP_ACCOUNT_NO, IfscCode: process.env.REACT_APP_IFSC_CODE
                ,
                BranchName: process.env.REACT_APP_BRANCH_NAME
            });
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, []);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchEggSaleDetails(uid);
            fetchAdvanceListByCustId(uid);
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);


    const fetchEggCategory = async () => {
        FecthEggCategory(process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setEggCategory(data.Result);
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
    }

    const fetchCompanyDetails = async () => {
        FetchCompanyDetails(process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setCompanyDetails(data.Result);
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
    }

    const [_totalquantity, _setTotalQuantity] = useState(0);
    const [_totalcost, _setTotalCost] = useState(0);
    const [_totaldiscount, _setTotalDiscount] = useState(0);
    const [_finalcost, _setFinalCost] = useState(0);
    const [_totalPaid, _setTotalPaid] = useState(0);
    const [_totalDue, _setTotalDue] = useState(0);
    const [_totaladvance, _setTotalAdvance] = useState(0);
    const [_totalcomplementory, _setTotalComplementory] = useState(0);

    const fetchEggSaleDetails = async (custid) => {
        setIsLoaded(true);
        FecthEggSaleInvoiceList(custid, process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setEggSaleList(data.Result);
                    setEggSaleListFilter(data.Result);
                    setTotalPages(Math.ceil(data.Result.length / itemsPerPage));
                    setIsLoaded(false);

                    calculateValues(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                    setIsLoaded(false);
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                    setIsLoaded(false);
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                    setIsLoaded(false);
                }
            });
    }

    const calculateValues = (data) => {
        const { totalCost, totalQuantity, totalDiscount, totalFinalCost,
            totalPaid, totalDue, totalComplementory }
            = data.reduce((accumulator, item) => {
                accumulator.totalCost += item.TotalCost;
                accumulator.totalQuantity += parseInt(item.TotalQuantity);
                accumulator.totalDiscount += item.TotalDiscount;
                accumulator.totalFinalCost += item.FinalCostInvoice;
                accumulator.totalPaid += item.Paid;
                accumulator.totalDue += item.Due;
                accumulator.totalComplementory += parseFloat(item.Complimentary || 0);
                return accumulator;
            }, {
                totalCost: 0, totalQuantity: 0, totalDiscount: 0,
                totalFinalCost: 0, totalPaid: 0, totalDue: 0, totalComplementory: 0
            })

        _setTotalQuantity(totalQuantity);
        _setTotalCost(totalCost);
        _setTotalDiscount(totalDiscount);
        _setFinalCost(totalFinalCost);
        _setTotalPaid(totalPaid);
        _setTotalDue(totalDue);
       // _setTotalAdvance(totalAdvance);
        _setTotalComplementory(totalComplementory);
    }

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

    const deleteEggSaleInv = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'EggSale/DeleteEggSaleInvoice/?id=' + id, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        props.showAlert("Successfully deleted", "info");
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
                    });

        }
    }

    let addCount = (num) => {
        setCount(num + 1);
    };


    const handleSubmitAdd = (id) => {
        history("/eggsalemodule?id=" + id);
    }
    const handleSubmitEdit = (id) => {
        history("/eggsalemodule?id=" + id);
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

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const preDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = eggsalelist && eggsalelist.length > 0 ? eggsalelist.slice(startIndex, endIndex) : [];
    if (itemsToDiaplay.length === 0 && eggsalelist.length > 0) {
        setCurrentPage(currentPage - 1);
    }

    const onDateFilterFromChange = (e) => {
        setFilterFromDate(e.target.value);
        getFilterData(e.target.value, filterToDate);
    }

    const getFilterData = (fromDate, toDate) => {
        let _filterList = [];
        if (fromDate !== "" && toDate !== "") {
            _filterList = eggsalelistfilter.filter((c) => dateyyyymmdd(c.PurchaseDate) >= dateyyyymmdd(fromDate) && dateyyyymmdd(c.PurchaseDate) <= dateyyyymmdd(toDate));
        }
        else if (fromDate === "" && toDate !== "") {
            _filterList = eggsalelistfilter.filter((c) => dateyyyymmdd(c.PurchaseDate) <= dateyyyymmdd(toDate));
        }
        else if (fromDate !== "" && toDate === "") {
            _filterList = eggsalelistfilter.filter((c) => dateyyyymmdd(c.PurchaseDate) >= dateyyyymmdd(fromDate));
        }
        else {
            _filterList = eggsalelistfilter;
        }

        setEggSaleList(_filterList);
        calculateValues(_filterList);
    }

    const onDateFilterToChange = (e) => {
        setFilterToDate(e.target.value);
        getFilterData(filterFromDate, e.target.value);
    }

    const onDownloadExcel = () => {
        const _list = eggsalelist.map((p) => {
          return ({
                          Date: moment(p.Date).format('DD-MMM-YYYY'),
                         // InvoiceNo:p.InvoiceNo,
                          CustomerName: p.CustomerName,
                          //Quantity: p.TotalQuantity, 
                          TotalCost: parseFloat(p.TotalCost||0).toFixed(2), 
                        //   Discount: parseFloat(p.TotalDiscount||0).toFixed(2), 
                        //   FinalCost: parseFloat(p.FinalCostInvoice||0).toFixed(2),
                        //   Paid: parseFloat(p.Paid||0).toFixed(2),
                        //   Due: parseFloat(p.Due||0).toFixed(2), 
                        //   Comments: p.Comments
                      });
        });

      //  downloadExcel(_list, "EggSale");
      downloadExcelFilter(_list, "EggSale", companydetails[0].CompanyName,filterFromDate,filterToDate);
    }

    const clickInvoice = (eggsale) => {

        setEggSaletData({
            Id: eggsale.Id,
            InvoiceNo: eggsale.InvoiceNo,
            CustomerId: eggsale.CustomerId,
            TotalQuantity: eggsale.TotalQuantity,
            PurchaseDate: eggsale.PurchaseDate,
            TotalCost: eggsale.TotalCost,
            TotalDiscount: eggsale.TotalDiscount,
            FinalCostInvoice: eggsale.FinalCostInvoice,
            Paid: eggsale.Paid,
            Due: eggsale.Due,
            AmountInWords: ConvertNumberToWords(parseFloat(eggsale.FinalCostInvoice || 0)),
            EggSale: eggsale.EggSaleList,
            VehicleNo: eggsale.VehicleNo,
            AdditionalCharge: eggsale.AdditionalCharge,
            Cash: eggsale.Cash,
            PhonePay: eggsale.PhonePay,
            NetBanking: eggsale.NetBanking,
            CashDeposite: eggsale.CashDeposite,
            Cheque: eggsale.Cheque,
            Complimentary: eggsale.Complimentary
        });

        setInvoiceModalShow(true);
    }

    const selectPaginationChange = (e) => {
        setItemsPerPage(e.target.value);
        addCount(count);
    }


    let addInvoiceModalClose = () => {
        setInvoiceModalShow(false);
    };

    //  const fetchPendingEggSaleInvoiceList = async (uid) => {
    //         setIsLoaded(true);
    //         fetch(process.env.REACT_APP_API + 'EggSale/GetPendingEggSaleInvoiceListByCustId?CustId='
    //             + uid + '&CompanyId=' + localStorage.getItem('companyid'),
    //             {
    //                 method: 'GET',
    //                 headers: {
    //                     'Accept': 'application/json',
    //                     'Content-Type': 'application/json',
    //                     'Authorization': localStorage.getItem('token')
    //                 }
    //             })
    //             .then(response => response.json())
    //             .then(data => {
    //                 if (data.StatusCode === 200) {
    //                     setEggSaleDueList(data.Result);
    //                     setIsLoaded(false);
    //                 }
    //                 else if (data.StatusCode === 401) {
    //                     HandleLogout();
    //                     history("/login")
    //                 }
    //                 else if (data.StatusCode === 404) {
    //                     props.showAlert("Data not found !!", "danger")
    //                 }
    //                 else {
    //                     props.showAlert("Error occurred !!", "danger")
    //                 }
    //             });
    
    //         setIsLoaded(false);
    //     }

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

    return (

        <div>
            {isloaded && <Loading />}
            <div className="container" style={{ marginTop: '10px'}}>
                <div className="row">
                <div className="col-6">
                    <div className="card" style={{ fontSize: 13 }}>
                        <div className="card-body">
                            <h5 className="card-title" style={{ fontSize: 15, marginBottom: 2 }}>Customer Name: {customerdetails.FirstName + " " + customerdetails.LastName}</h5>
                            <p className="card-title" style={{ marginBottom: 2 }}>Mobile no: {customerdetails.MobileNo}</p>
                            <p className="card-title" style={{ marginBottom: 2 }}>Address: {customerdetails.Address}</p>
                            {/* <p className="card-title" style={{ marginBottom: 2 }}>Email: {customerdetails.Email??""}</p> */}
                        </div>
                        </div>
                        </div>
                        {
                            advancedata != null && advancedata.Amount > 0 &&
                            <div className="row col-6">
                                <div className="alert alert-success" role="alert">
                                    <p><strong>Advance Rs:  
                                        {parseFloat(advancedata.Amount || 0).toFixed(2)}</strong></p>


                                </div>
                            </div>
                        }

                   
                </div>
            </div>
            <div className="container" style={{ marginTop: '20px', marginBottom: '10px' }}>
                <div className="row align-items-center" style={{ fontSize: 13 }}>
                    <div className="col-2">
                        <p><strong>From</strong></p>
                        <DateComponent date={null} onChange={onDateFilterFromChange} isRequired={false} value={filterFromDate} />
                    </div>
                    <div className="col-2">
                        <p><strong>To</strong></p>
                        <DateComponent date={null} onChange={onDateFilterToChange} isRequired={false} value={filterToDate} />
                    </div>

                    <div className="col-6" style={{ textAlign: 'right', marginTop: 30 }}>
                        <i className="fa-regular fa-file-excel fa-2xl"
                            style={{ color: '#bea2a2', marginRight: 30 }}
                            title='Download Egg Sale List' onClick={() => onDownloadExcel()} ></i>
                        <Button className="mr-2" variant="primary"
                            style={{ marginRight: "17.5px" }}
                            onClick={() => clickAddEggSale()}>Add</Button>

                        <a className="mr-2 btn btn-primary" href={`/eggsalepaymentin/?uid=${uid}`} 
                        style={{ marginRight: "17.5px" }}>Payment</a>

                        <a className="mr-2 btn btn-primary" href={`/eggsaleinvoicelist/`}>Return to Sales</a>

                    </div>
                    <div className="col-2" style={{ textAlign: 'right', marginTop: 30 }}>
                        <select className="form-select" aria-label="Default select example"
                            style={{ width: "80px" }} onChange={selectPaginationChange}>
                            <option selected value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                        </select>
                    </div>
                </div>
            </div>


            {/* <div class="row">
                <div class="col-md-9">  <i className="fa-regular fa-file-excel fa-2xl" style={{ color: '#bea2a2' }} title='Download Egg Sale List' onClick={() => onDownloadExcel()} ></i></div>
                <div class="col-md-3"> <div class="row"><div class="col-md-6" style={{ textAlign: 'right' }}> <Button className="mr-2" variant="primary"
                    style={{ marginRight: "17.5px" }}
                    onClick={() => clickAddEggSale()}>Add</Button></div>

                    <div class="col-md-6">
                        <select className="form-select" aria-label="Default select example" style={{ width: "80px" }} onChange={selectPaginationChange}>
                            <option selected value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                        </select></div></div></div>
            </div> */}

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr className="tr-custom" align='center'>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Total cost (<span>&#8377;</span>)</th>
                        <th>Discount (<span>&#8377;</span>)</th>
                        <th>Final cost (<span>&#8377;</span>)</th>
                        <th>Paid (<span>&#8377;</span>)</th>
                        <th>Due (<span>&#8377;</span>)</th>
                        <th>Complimentary</th>
                        <th align='center'>Invoice</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {

                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {
                            return (
                                !isloaded && <tr align='center' style={{ fontSize: 13 }} key={p.Id}>

                                    <td align='center'>{moment(p.PurchaseDate).format('DD-MMM-YYYY')}</td>
                                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                                    }).format(p.TotalQuantity.toFixed(2))}
                                    </td>
                                    <td align='center'> {new Intl.NumberFormat('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(parseFloat(p.TotalCost).toFixed(2))}
                                    </td>
                                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(parseFloat(parseFloat(p.TotalDiscount).toFixed(2)))}</td>

                                    <td align='center'>
                                        {new Intl.NumberFormat('en-IN', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }).format(parseFloat(p.FinalCostInvoice).toFixed(2))}
                                    </td>
                                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(p.Paid.toFixed(2))}</td>
                                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(parseFloat(p.Due).toFixed(2))}</td>

                                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(parseFloat(p.Complimentary || 0).toFixed(2))}</td>

                                    {/* <td align='center'>{new Intl.NumberFormat('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(parseFloat(p.Advance || 0).toFixed(2))}</td> */}

                                    <td>
                                        <i className="fa-sharp fa-solid fa-receipt fa-beat" title='Invoice' style={{ color: '#086dba', marginLeft: '15px' }} onClick={() => clickInvoice(p)}></i>
                                    </td>
                                    <td align='center'>
                                        {
                                            <ButtonToolbar>

                                                <i className="fa-solid fa-pen-to-square" title='Edit' style={{ color: '#0545b3', marginLeft: '15px' }}
                                                    onClick={() => clickEditEggSale(p)}></i>

                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" title='Delete' style={{ color: '#f81616', marginLeft: '15px' }}
                                                        onClick={() => deleteEggSaleInv(p.Id)}></i>}



                                            </ButtonToolbar>
                                        }
                                    </td>
                                </tr>
                            )
                        }) : <tr>
                            <td style={{ textAlign: "center" }} colSpan={14}>
                                No Records
                            </td>
                        </tr>
                    }
                </tbody>
                <tfoot style={{ backgroundColor: '#cccccc', fontWeight: 'bold', fontSize: 13 }}>
                    <td align='center'>Total</td>

                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }).format(parseInt(_totalquantity || 0))}</td>

                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(parseFloat(_totalcost || 0).toFixed(2))}</td>

                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(parseFloat(_totaldiscount || 0).toFixed(2))}</td>

                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(parseFloat(_finalcost || 0).toFixed(2))}</td>

                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(parseFloat(_totalPaid || 0).toFixed(2))}</td>
                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(parseFloat(_totalDue || 0).toFixed(2))}</td>

                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(parseFloat(_totalcomplementory || 0).toFixed(2))}</td>

                    {/* <td align='center'>{new Intl.NumberFormat('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(parseFloat(_totaladvance || 0).toFixed(2))}</td> */}


                    <td></td>
                    <td></td>
                    <td></td>
                </tfoot>
            </Table >

            {
                eggsalelist && eggsalelist.length > itemsPerPage &&
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
                    show={invoiceModalShow}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    size="xl"
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {eggsaledata.modaltitle}
                        </Modal.Title>
                        <button type="button" className="btn-close" aria-label="Close" onClick={addInvoiceModalClose}> </button>
                    </Modal.Header>

                    <Modal.Body>
                        <Fragment>
                            <PDFViewer width="900" height="900" className="app" >

                                <InvoiceEggSale companydetails={companydetails}
                                    eggsaledata={eggsaledata}
                                    customerdetails={customerdetails}
                                    eggcategory={eggcategory}
                                    bankdetails={bankdetails} advancedata={advancedata}/>
                            </PDFViewer>
                        </Fragment>
                    </Modal.Body>
                </Modal>
            </div>



        </div >
    )
}

export default EggSale
