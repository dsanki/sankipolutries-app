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
    Commarize, FecthEggSaleInvoiceList, GetCustomerByTypeId
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

    // const [itemsPerPage, setItemsPerPage] = useState(10);

    const initialvalues = {
        modaltitle: "",
        Id: 0,
        InvoiceNo: "",
        CustomerId: "",
        Quantity: "",
        Rate: "",
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
        UnitName: ""
    }

    const [gunnybagsaledata, setGunnyBagSaleData] = useState(initialvalues);

    const clickAddGunnyBag = () => {
        setAddModalShow({ addModalShow: true });
        setGunnyBagSaleData({
            modaltitle: "Add Gunny Bag",
            Id: 0,
            InvoiceNo: "",
            CustomerId: "",
            Quantity: "",
            Rate: "",
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
            UnitName: ""
        })
    }

    const clickEditGunnyBag = (gunnybag) => {
        setAddModalShow({ addModalShow: true });
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
            UnitName: gunnybag.UnitName
        })
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchClient();

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

    const clientChange = (e) => {
        setGunnyBagSaleData({ ...gunnybagsaledata, CustomerId: e.target.value });
    }
    const dateChange = (e) => {
        setGunnyBagSaleData({ ...gunnybagsaledata, Date: e.target.value });
    }
    const quantityChange = (e) => {
        setGunnyBagSaleData({
            ...gunnybagsaledata, Quantity: e.target.value,
            TotalAmount: Math.round(e.target.value * gunnybagsaledata.Rate),
            Due: ((e.target.value * gunnybagsaledata.Rate) - parseFloat(gunnybagsaledata.Paid || 0)).toFixed(2)
        });
    }

    const rateChange = (e) => {
        setGunnyBagSaleData({
            ...gunnybagsaledata, Rate: e.target.value,
            TotalAmount: Math.round(e.target.value * gunnybagsaledata.Quantity),
            Due: ((e.target.value * gunnybagsaledata.Quantity) - parseFloat(gunnybagsaledata.Paid || 0)).toFixed(2)
        });
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
                    PaymentDate: gunnybagsaledata.PaymentDate
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
                    PaymentDate: gunnybagsaledata.PaymentDate
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
                        ></i>
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
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Discount</th>
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
                                        <td>  {new Intl.NumberFormat('en-IN', {
                                        }).format(parseInt(gunny.Quantity))}</td>
                                        <td>{gunny.Rate}</td>
                                        <td>{gunny.Discount}</td>
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

            <div className="ContainerOverride">

                <Modal
                    show={addModalShow}
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: '18px' }}>
                            Add
                        </Modal.Title>
                        <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>

                                <Form className="needs-validation" noValidate validated={validated}>
                                    <Row className="mb-12">
                                        <Form.Group controlId="CustomerId" as={Col}>
                                            <Form.Label style={{ fontSize: '13px' }}>Client</Form.Label>
                                            <Col>

                                                <Form.Select aria-label="Default select example" style={{ fontSize: '13px' }}
                                                    onChange={clientChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {

                                                        clientlist.map((item) => {

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
                                                    Select client
                                                </Form.Control.Feedback>

                                            </Col>
                                        </Form.Group>

                                        <Form.Group controlId="Date" as={Col} >
                                            <Form.Label style={{ fontSize: '13px' }}>Date</Form.Label>
                                            <Col >
                                                <DateComponent date={null} isRequired={true}
                                                    onChange={dateChange} value={gunnybagsaledata.Date} />
                                                <Form.Control.Feedback type="invalid">
                                                    Select billing date
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-12">
                                        <InputField controlId="Quantity" label="Quantity"
                                            type="number"
                                            value={gunnybagsaledata.Quantity}
                                            name="Quantity"
                                            placeholder="Quantity"
                                            errormessage="Enter quantity"
                                            required={true}
                                            disabled={false}
                                            onChange={quantityChange}
                                        />

                                        <InputField controlId="Rate" label="Rate"
                                            type="number"
                                            value={gunnybagsaledata.Rate}
                                            name="Rate"
                                            placeholder="Rate"
                                            errormessage="Enter rate"
                                            required={true}
                                            disabled={false}
                                            onChange={rateChange}
                                        />
                                        <InputField controlId="Discount" label="Discount"
                                            type="number"
                                            value={gunnybagsaledata.Discount}
                                            name="Discount"
                                            placeholder="Discount"
                                            errormessage="Enter discount"
                                            required={false}
                                            disabled={false}
                                            onChange={discountChange}
                                        />

                                        <InputField controlId="TotalAmount" label="Total amount"
                                            type="number"
                                            value={gunnybagsaledata.TotalAmount}
                                            name="TotalAmount"
                                            placeholder="Total amount"
                                            errormessage="Please provide total amount"
                                            required={true}
                                            disabled={true}
                                        />

                                    </Row>
                                    <Row className="mb-8">

                                        <InputField controlId="Paid" label="Paid"
                                            type="number"
                                            value={gunnybagsaledata.Paid}
                                            name="Paid"
                                            placeholder="Paid"
                                            errormessage="Enter paid amount"
                                            required={false}
                                            disabled={false}
                                            onChange={paidChange}
                                        />

                                        <InputField controlId="Due" label="Due"
                                            type="number"
                                            value={gunnybagsaledata.Due}
                                            name="Due"
                                            placeholder="Due"
                                            errormessage="Due"
                                            required={false}
                                            disabled={false}
                                        />
                                    </Row>

                                    <Form.Group controlId="PaymentDate" as={Col} >
                                        <Form.Label style={{ fontSize: '13px' }}>Payment Date</Form.Label>
                                        <Col >
                                            <DateComponent date={null} isRequired={true}
                                                onChange={paymentDateChange} value={gunnybagsaledata.PaymentDate} />
                                            <Form.Control.Feedback type="invalid">
                                                Please select payment date
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>

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

                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleAddGunnyBag(e)}>
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

                                        <Button variant="danger" style={{ marginTop: "30px", marginLeft: "10px" }} onClick={() => {
                                            addModalClose();
                                        }
                                        }>Close</Button>

                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer>

                    </Modal.Footer>

                </Modal>
            </div>

        </div>
    )
}

export default GunnyBag
