import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment';
import { ErrorMessageHandle } from '../../Utility';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import { dateyyyymmdd, HandleLogout, downloadExcel, FetchCompanyDetails } from './../../Utility'
import Loading from '../Loading/Loading'

import ReactDOM from 'react-dom';
 import { PDFViewer } from '@react-pdf/renderer';
import InvoiceEggSale from '../Invoice/InvoiceEggSale';
// import InvoiceData from '../../data/InvoiceData'


function EggSale(props) {

    let history = useNavigate();
    const { id } = useParams();
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

    const initialvalues = {
        modaltitle: "",
        Id: 0,
        CustomerId: id,
        Quantity: "",
        PurchaseDate: "",
        EggRate: "",
        TotalCost: "",
        Discount: "",
        FinalCost: "",
        Paid: "",
        Due: "",
        Comments: "",
        CreatedOn: "",
        CreatedBy: "",
        ModifiedOn: "",
        ModifiedBy: ""
    };

    const [eggsaledata, setEggSaletData] = useState(initialvalues);

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };



    const clickAddEggSale = () => {
        setAddModalShow({ addModalShow: true });
        setEggSaletData({
            modaltitle: "Add Egg Sale",
            Id: 0,
            CustomerId: id,
            Quantity: "",
            PurchaseDate: "",
            EggRate: "",
            TotalCost: "",
            Discount: "",
            FinalCost: "",
            Paid: "",
            Due: "",
            Comments: "",
            CreatedOn: new Date(),
            CreatedBy: localStorage.getItem("username"),
            ModifiedOn: "",
            ModifiedBy: ""
        })
    }

    const clickEditEggSale = (eggsale) => {
        setAddModalShow({ addModalShow: true });
        setEggSaletData({
            modaltitle: "Edit Egg Sale",
            Id: eggsale.Id,
            CustomerId: eggsale.CustomerId,
            Quantity: eggsale.Quantity,
            PurchaseDate: eggsale.PurchaseDate,
            EggRate: eggsale.EggRate,
            TotalCost: eggsale.TotalCost,
            Discount: eggsale.Discount,
            FinalCost: eggsale.FinalCost,
            Paid: eggsale.Paid,
            Due: eggsale.Due,
            Comments: eggsale.Comments,
            CreatedOn: eggsale.CreatedOn,
            CreatedBy: eggsale.CreatedBy,
            ModifiedOn: new Date(),
            ModifiedBy: localStorage.getItem("username")
        })
    }

    const quantityChange = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setEggSaletData({ ...eggsaledata, Quantity: e.target.value, TotalCost: e.target.value * eggsaledata.EggRate, FinalCost: (e.target.value * eggsaledata.EggRate) - eggsaledata.Discount });
        }
    }
    const purchaseDateChange = (e) => {
        setEggSaletData({ ...eggsaledata, PurchaseDate: e.target.value });
    }
    const eggRateChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setEggSaletData({ ...eggsaledata, EggRate: e.target.value, TotalCost: e.target.value * eggsaledata.Quantity, FinalCost: (e.target.value * eggsaledata.Quantity) - eggsaledata.Discount });
        }
    }

    const discountChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setEggSaletData({ ...eggsaledata, Discount: e.target.value, FinalCost: (eggsaledata.TotalCost - e.target.value) });
        }
    }

    const paidChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setEggSaletData({ ...eggsaledata, Paid: e.target.value, Due: eggsaledata.FinalCost - e.target.value });
        }
    }

    const commentsChange = (e) => {
        setEggSaletData({ ...eggsaledata, Comments: e.target.value });
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            setEggSaletData({ ...eggsaledata, CustomerId: id });
            fetchCustomerDetails(id);
            fetchCompanyDetails();
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, []);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchEggSaleDetails(id);
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);




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




    const fetchEggSaleDetails = async (custid) => {
        setIsLoaded(true);
        fetch(variables.REACT_APP_API + 'EggSale/GetEggSaleDetailsByCustomerId?CustId=' + custid,
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
                    setEggSaleList(data.Result);
                    setEggSaleListFilter(data.Result);
                    setTotalPages(Math.ceil(data.Result.length / variables.PAGE_PAGINATION_NO));
                    setIsLoaded(false);
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

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(variables.REACT_APP_API + 'EggSale/EggSaleAdd', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: eggsaledata.Id,
                    CustomerId: eggsaledata.CustomerId,
                    Quantity: eggsaledata.Quantity,
                    PurchaseDate: eggsaledata.PurchaseDate,
                    EggRate: eggsaledata.EggRate,
                    TotalCost: eggsaledata.TotalCost,
                    Discount: eggsaledata.Discount,
                    FinalCost: eggsaledata.FinalCost,
                    Paid: eggsaledata.Paid,
                    Due: eggsaledata.Due,
                    Comments: eggsaledata.Comments,
                    CreatedOn: eggsaledata.CreatedOn,
                    CreatedBy: eggsaledata.CreatedBy,
                    ModifiedOn: eggsaledata.ModifiedOn,
                    ModifiedBy: eggsaledata.ModifiedBy

                })
            }).then(res => res.json())
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
                    });
        }

        setValidated(true);
    }


    const handleSubmitEdit = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(variables.REACT_APP_API + 'EggSale/GetEggSaleUpdate', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: eggsaledata.Id,
                    CustomerId: eggsaledata.CustomerId,
                    Quantity: eggsaledata.Quantity,
                    PurchaseDate: eggsaledata.PurchaseDate,
                    EggRate: eggsaledata.EggRate,
                    TotalCost: eggsaledata.TotalCost,
                    Discount: eggsaledata.Discount,
                    FinalCost: eggsaledata.FinalCost,
                    Paid: eggsaledata.Paid,
                    Due: eggsaledata.Due,
                    Comments: eggsaledata.Comments,
                    CreatedOn: eggsaledata.CreatedOn,
                    CreatedBy: eggsaledata.CreatedBy,
                    ModifiedOn: eggsaledata.ModifiedOn,
                    ModifiedBy: eggsaledata.ModifiedBy

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);

                        props.showAlert("Successfully updated", "info")
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

        setValidated(true);
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
    const itemsPerPage = variables.PAGE_PAGINATION_NO;
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
            CustomerId: eggsale.CustomerId,
            Quantity: eggsale.Quantity,
            PurchaseDate: eggsale.PurchaseDate,
            EggRate: eggsale.EggRate,
            TotalCost: eggsale.TotalCost,
            Discount: eggsale.Discount,
            FinalCost: eggsale.FinalCost,
            Paid: eggsale.Paid,
            Due: eggsale.Due
        });

        setInvoiceModalShow(true);
    }

    return (

        <div>
            {isloaded && <Loading />}
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <h2>Welcome to Egg sale</h2>
            </div>
            <div className="card" style={{ marginBottom: '20px' }}>
                <div className="card-body">
                    <h5 className="card-title">Customer Name: {customerdetails.FirstName + " " + customerdetails.LastName}</h5>
                    <p className="card-title">Mobile no: {customerdetails.MobileNo}</p>
                    <p className="card-title">Email: {customerdetails.Email}</p>
                </div>
            </div>
            <div className="container" style={{ marginTop: '30px' }}>
                <div className="row align-items-center">
                    <div className="col">
                        <p><strong>From</strong></p>
                        <DateComponent date={null} onChange={onDateFilterFromChange} isRequired={false} value={filterFromDate} />
                    </div>
                    <div className="col">
                        <p><strong>To</strong></p>
                        <DateComponent date={null} onChange={onDateFilterToChange} isRequired={false} value={filterToDate} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col" style={{ textAlign: 'left', marginTop: '20px' }}>
                    <i className="fa-regular fa-file-excel fa-2xl" style={{ color: '#bea2a2' }} onClick={() => onDownloadExcel()} ></i>
                </div>

                <div className="col" style={{ textAlign: 'right' }}>
                    <Button className="mr-2" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => clickAddEggSale()}>Add</Button>
                </div>
            </div>


            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr className="tr-custom" align='center'>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Total cost</th>
                        <th>Discount</th>
                        <th>FinalCost</th>
                        <th>Paid</th>
                        <th>Due</th>
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
                                    <td align='center'>{p.Quantity}</td>
                                    <td align='center'>{p.EggRate}</td>
                                    <td align='center'>{p.TotalCost.toFixed(2)}</td>
                                    <td align='center'>{p.Discount.toFixed(2)}</td>
                                    <td align='center'>{p.FinalCost.toFixed(2)}</td>
                                    <td align='center'>{p.Paid.toFixed(2)}</td>
                                    <td align='center'>{p.Due.toFixed(2)}</td>
                                    <td align='left'>{p.Comments}</td>
                                    <td>
                                        <i className="fa-sharp fa-solid fa-receipt fa-beat" title='Invoice' style={{ color: '#086dba', marginLeft: '15px' }} onClick={() => clickInvoice(p)}></i>
                                    </td>
                                    <td align='center'>
                                        {
                                            <ButtonToolbar>

                                                <i className="fa-solid fa-pen-to-square" title='Edit' style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditEggSale(p)}></i>

                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" title='Delete' style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteEggSale(p.Id)}></i>}



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
            </Table >

            {

                eggsalelist && eggsalelist.length > variables.PAGE_PAGINATION_NO &&
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
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {eggsaledata.modaltitle}
                        </Modal.Title>
                        <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>
                    </Modal.Header>

                    <Modal.Body>
                        <Fragment>
                            <PDFViewer width="900" height="900" className="app" >

                                <InvoiceEggSale companydetails={companydetails} eggsaledata={eggsaledata} customerdetails={customerdetails} />
                            </PDFViewer>
                        </Fragment>
                    </Modal.Body>
                </Modal>

                <Modal
                    show={addModalShow}
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {eggsaledata.modaltitle}
                        </Modal.Title>
                        <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>

                                <div>
                                    <Form noValidate validated={validated} className="needs-validation">
                                        <Row className="mb-12">
                                            <Form.Group as={Col} controlId="PurchaseDate">
                                                <Form.Label>Date *</Form.Label>
                                                <DateComponent date={null} onChange={purchaseDateChange} isRequired={true} value={eggsaledata.PurchaseDate} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select date
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <InputField controlId="Quantity" label="Quantity *"
                                                type="text"
                                                value={eggsaledata.Quantity}
                                                name="Quantity"
                                                placeholder="Quantity"
                                                errormessage="Please enter quantity"
                                                required={true}
                                                disabled={false}
                                                onChange={quantityChange}
                                            />

                                            <InputField controlId="EggRate" label="Egg rate *"
                                                type="text"
                                                value={eggsaledata.EggRate}
                                                name="EggRate"
                                                placeholder="Rate"
                                                errormessage=" Please enter egg rate"
                                                required={true}
                                                disabled={false}
                                                onChange={eggRateChange}
                                            />
                                        </Row>

                                        <Row className="mb-12">


                                            <InputField controlId="TotalCost" label="Total cost *"
                                                type="number"
                                                value={eggsaledata.TotalCost !== "" ? eggsaledata.TotalCost.toFixed(2) : eggsaledata.TotalCost}
                                                name="TotalCost"
                                                placeholder="Total cost"
                                                errormessage="Please enter total cost"
                                                required={true}
                                                disabled={true}
                                            />

                                            <InputField controlId="Discount" label="Discount"
                                                type="text"
                                                value={eggsaledata.Discount}
                                                name="Discount"
                                                placeholder="Discount"
                                                errormessage="Please enter Discount"
                                                required={false}
                                                disabled={false}
                                                onChange={discountChange}
                                            />

                                            <InputField controlId="FinalCost" label="Final cost *"
                                                type="number"
                                                value={eggsaledata.FinalCost !== "" ? eggsaledata.FinalCost.toFixed(2) : eggsaledata.FinalCost}
                                                name="FinalCost"
                                                placeholder="Final cost"
                                                errormessage="Please enter final cost"
                                                required={true}
                                                disabled={true}
                                            />
                                        </Row>

                                        <Row className="mb-12">
                                            <InputField controlId="Paid" label="Paid *"
                                                type="text"
                                                value={eggsaledata.Paid}
                                                name="Paid"
                                                placeholder="Paid"
                                                errormessage="Please enter paid amount"
                                                required={true}
                                                disabled={false}
                                                onChange={paidChange}
                                            />

                                            <InputField controlId="Due" label="Due *"
                                                type="number"
                                                value={eggsaledata.Due !== "" ? eggsaledata.Due.toFixed(2) : eggsaledata.Due}
                                                name="Due"
                                                placeholder="Due"
                                                errormessage="Please enter due amount"
                                                required={true}
                                                disabled={true}
                                            />
                                        </Row>

                                        <Row className="mb-12">
                                            <Form.Group controlId="Comments" as={Col} >
                                                <Form.Label>Comments</Form.Label>

                                                <Form.Control as="textarea" rows={3} name="Comments" onChange={commentsChange} value={eggsaledata.Comments}
                                                    placeholder="Comments" />

                                            </Form.Group>
                                        </Row>

                                        <Row className="mb-3">

                                        </Row>

                                        <Form.Group as={Col}>
                                            {eggsaledata.Id <= 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                                                    Add
                                                </Button>
                                                : null
                                            }

                                            {eggsaledata.Id > 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitEdit(e)}>
                                                    Update
                                                </Button>
                                                : null
                                            }

                                            <Button variant="danger" style={{ marginTop: "30px", marginLeft: "10px" }} onClick={() => {
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

export default EggSale
