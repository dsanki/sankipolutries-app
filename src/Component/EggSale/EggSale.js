import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment';
import { ErrorMessageHandle } from '../../Utility';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import {
    dateyyyymmdd, HandleLogout, downloadExcel,
    FetchCompanyDetails, AmountInWords, ReplaceNonNumeric, Commarize, FecthEggSaleInvoiceList,FecthEggCategory
} from './../../Utility'

import Loading from '../Loading/Loading'
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import InvoiceEggSale from '../Invoice/InvoiceEggSale';



function EggSale(props) {

    let history = useNavigate();
    const { uid } = useParams();
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
    const [companydetails, setCompanyDetails] = useState([]);
    const [eggcategory, setEggCategory] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);


    // const initialvalues = {
    //     modaltitle: "",
    //     Id: 0,
    //     CustomerId: uid,
    //     Quantity: "",
    //     PurchaseDate: "",
    //     EggRate: "",
    //     TotalCost: "",
    //     Discount: "",
    //     FinalCost: "",
    //     Paid: "",
    //     Due: "",
    //     Comments: ""
    // };
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
    EggSale: []
    }

    const [eggsaledata, setEggSaletData] = useState(initialvalues);

    const clickAddEggSale = (p) => {
        history("/eggsalemodule/" + uid);
    }

    const clickEditEggSale = (p) => {
        history("/eggsalemodule/" + uid + "/" + p.Id);
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            setEggSaletData({ ...eggsaledata, CustomerId: uid });
            fetchCustomerDetails(uid);
            fetchCompanyDetails();
            fetchEggCategory();
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, []);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchEggSaleDetails(uid);
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);


    const fetchEggCategory = async () => {
        FecthEggCategory()
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
        FetchCompanyDetails()
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

    //FecthEggSaleInvoiceList
    // const fetchEggSaleDetails = async (custid) => {
    //     setIsLoaded(true);
    //     fetch(variables.REACT_APP_API + 'EggSale/GetEggSaleDetailsByCustomerId?CustId=' + custid,
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
    //                 setEggSaleList(data.Result);
    //                 setEggSaleListFilter(data.Result);
    //                 setTotalPages(Math.ceil(data.Result.length / itemsPerPage));
    //                 setIsLoaded(false);
    //             }
    //             else if (data.StatusCode === 401) {
    //                 HandleLogout();
    //                 history("/login")
    //                 setIsLoaded(false);
    //             }
    //             else if (data.StatusCode === 404) {
    //                 props.showAlert("Data not found!!", "danger")
    //                 setIsLoaded(false);
    //             }
    //             else {
    //                 props.showAlert("Error occurred!!", "danger")
    //                 setIsLoaded(false);
    //             }
    //         });
    // }

    const [_totalquantity, _setTotalQuantity] = useState(0);
    const [_totalcost, _setTotalCost] = useState(0);
    const [_totaldiscount, _setTotalDiscount] = useState(0);
    const [_finalcost, _setFinalCost] = useState(0);
    const [_totalPaid, _setTotalPaid] = useState(0);
    const [_totalDue, _setTotalDue] = useState(0);

    const fetchEggSaleDetails = async (custid) => {
        setIsLoaded(true);
        FecthEggSaleInvoiceList(custid)
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
        const { totalCost, totalQuantity, totalDiscount, totalFinalCost, totalPaid, totalDue } = data.reduce((accumulator, item) => {
            accumulator.totalCost += item.TotalCost;
            accumulator.totalQuantity += parseInt(item.TotalQuantity);
            accumulator.totalDiscount += item.TotalDiscount;
            accumulator.totalFinalCost += item.FinalCostInvoice;
            accumulator.totalPaid += item.Paid;
            accumulator.totalDue += item.Due;
            return accumulator;
        }, { totalCost: 0, totalQuantity: 0, totalDiscount: 0, totalFinalCost: 0, totalPaid: 0, totalDue: 0 })

        _setTotalQuantity(totalQuantity);
        _setTotalCost(totalCost);
        _setTotalDiscount(totalDiscount);
        _setFinalCost(totalFinalCost);
        _setTotalPaid(totalPaid);
        _setTotalDue(totalDue);
    }

    const fetchCustomerDetails = async (custid) => {
        fetch(variables.REACT_APP_API + 'Customer/GetCustomerById?id=' + custid,
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

    const deleteEggSale = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.REACT_APP_API + 'EggSale/' + id, {
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
    // const itemsPerPage = variables.PAGE_PAGINATION_NO;
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
                Quantity: p.Quantity, Rate: p.EggRate, TotalCost: p.TotalCost.toFixed(2), Discount: p.Discount.toFixed(2), FinalCost: p.FinalCost.toFixed(2),
                Paid: p.Paid.toFixed(2), Due: p.Due.toFixed(2), Comments: p.Comments
            });
        });

        downloadExcel(_list, "EggSale");
    }

    const clickInvoice = (eggsale) => {

        setEggSaletData({
            Id: eggsale.Id,
            InvoiceNo:eggsale.InvoiceNo,
            CustomerId: eggsale.CustomerId,
            TotalQuantity: eggsale.TotalQuantity,
            PurchaseDate: eggsale.PurchaseDate,
            TotalCost: eggsale.TotalCost,
            TotalDiscount: eggsale.TotalDiscount,
            FinalCostInvoice: eggsale.FinalCostInvoice,
            Paid: eggsale.Paid,
            Due: eggsale.Due,
            AmountInWords: AmountInWords(eggsale.FinalCostInvoice),
            EggSale:eggsale.EggSaleList
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

    return (

        <div>
            {isloaded && <Loading />}
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <h2>Egg sale tracker</h2>
            </div>
            <div className="card" style={{ marginBottom: '20px' }}>
                <div className="card-body">
                    <h5 className="card-title">Customer Name: {customerdetails.FirstName + " " + customerdetails.LastName}</h5>
                    <p className="card-title">Mobile no: {customerdetails.MobileNo}</p>
                    <p className="card-title">Email: {customerdetails.Email}</p>
                </div>
            </div>
            <div className="container" style={{ marginTop: '30px', marginBottom: '15px' }}>
                <div className="row align-items-center">
                    <div className="col-4">
                        <p><strong>From</strong></p>
                        <DateComponent date={null} onChange={onDateFilterFromChange} isRequired={false} value={filterFromDate} />
                    </div>
                    <div className="col-4">
                        <p><strong>To</strong></p>
                        <DateComponent date={null} onChange={onDateFilterToChange} isRequired={false} value={filterToDate} />
                    </div>
                </div>
            </div>
            {/* <div className="row">
                <div className="col" style={{ textAlign: 'left', marginTop: '20px', marginLeft: '20px' }}>
                  

                </div>
            </div> */}

            <div class="row">
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
            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr className="tr-custom" align='center'>
                        <th>Date</th>
                        <th>Quantity</th>
                        {/* <th>Rate (<span>&#8377;</span>)</th> */}
                        <th>Total cost (<span>&#8377;</span>)</th>
                        <th>Discount (<span>&#8377;</span>)</th>
                        <th>Final cost (<span>&#8377;</span>)</th>
                        <th>Paid (<span>&#8377;</span>)</th>
                        <th>Due (<span>&#8377;</span>)</th>
                        <th>Comments</th>
                        <th align='center'>Invoice</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {

                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {
                            return (
                                !isloaded && <tr align='center' key={p.Id}>

                                    <td align='center'>{moment(p.PurchaseDate).format('DD-MMM-YYYY')}</td>
                                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                                    }).format(p.TotalQuantity.toFixed(2))}
                                    </td>
                                    {/* <td align='center'>{p.EggRate}</td> */}
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
                                    <td align='left'>{p.Comments}</td>
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
                                                    onClick={() => deleteEggSale(p.Id)}></i>}



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
                <tfoot style={{ backgroundColor: '#cccccc', fontWeight: 'bold' }}>
                    <td align='center'>Total</td>

                    <td align='center'>{_totalquantity}</td>
                    <td align='center'>{parseFloat(_totalcost).toFixed(2)}</td>

                    <td align='center'>{parseFloat(_totaldiscount).toFixed(2)}</td>
                    <td align='center'>{parseFloat(_finalcost).toFixed(2)}</td>
                    <td align='center'>{parseFloat(_totalPaid).toFixed(2)}</td>
                    <td align='center'>{parseFloat(_totalDue).toFixed(2)}</td>
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

                                <InvoiceEggSale companydetails={companydetails} eggsaledata={eggsaledata} customerdetails={customerdetails} eggcategory={eggcategory} />
                            </PDFViewer>
                        </Fragment>
                    </Modal.Body>
                </Modal>
</div>



        </div >
    )
}

export default EggSale
