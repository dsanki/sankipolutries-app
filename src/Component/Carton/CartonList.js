import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import Moment from 'moment';
import { useNavigate } from 'react-router-dom'
import DateComponent from '../DateComponent';
import InputField from '../ReuseableComponent/InputField'
import Loading from '../Loading/Loading'
import { HandleLogout, dateyyyymmdd, downloadExcel, GetCustomerByTypeId } from './../../Utility'
import moment from 'moment';

const CartonList = (props) => {
    let history = useNavigate();

    const [cartons, setCartons] = useState([]);
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [cartonId, setCartonId] = useState(0);
    const [addModalShow, setAddModalShow] = useState(false);
    const [count, setCount] = useState(0);
    const [validated, setValidated] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isloaded, setIsLoaded] = useState(true);
    const initialvalues = {
        modaltitle: "",
        Id: 0,
        Quantity: "",
        BillingDate: "",
        Rate: "",
        TotalAmount: "",
        Payment: "",
        PaymentDate: "",
        UnloadingCharge: "",
        ClientId: "",
        ClientName: "",
        GST: "",
        Due: ""
    };

    const [cartonsdata, setCartonsData] = useState(initialvalues);


    const clickAddCarton = () => {
        setAddModalShow({ addModalShow: true });
        setCartonsData({
            modaltitle: "Add Carton",
            Id: 0,
            Quantity: "",
            BillingDate: "",
            Rate: "",
            TotalAmount: "",
            Payment: "",
            PaymentDate: "",
            UnloadingCharge: "",
            ClientId: "",
            ClientName: "",
            GST: "",
            Due: ""
        })
    }

    const clickEditCarton = (cart) => {
        setAddModalShow({ addModalShow: true });
        setCartonsData({
            modaltitle: "Edit Carton",
            Id: cart.Id,
            Quantity: cart.Quantity,
            BillingDate: cart.BillingDate,
            Rate: cart.Rate,
            TotalAmount: cart.TotalAmount,
            Payment: cart.Payment,
            PaymentDate: cart.PaymentDate,
            UnloadingCharge: cart.UnloadingCharge,
            ClientId: cart.ClientId,
            ClientName: cart.ClientName,
            GST: cart.GST,
            Due: cart.Due
        })
    }

    const obj = useMemo(() => ({ count }), [count]);
    useEffect(() => {
        fetchClient();
    }, [])

    useEffect((e) => {
        if (localStorage.getItem('token')) {
            fetchCarton();
        }
        else {
            history("/login")
        }
    }, [obj]);

    const fetchClient = async () => {
        GetCustomerByTypeId(process.env.REACT_APP_CUST_TYPE_ID_PKG,
            process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setClients(data.Result);
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

    const fetchCarton = async () => {
        setIsLoaded(true);
        await fetch(process.env.REACT_APP_API + 'carton/GetCartonByCompanyId?CompanyId='
            + localStorage.getItem('companyid'),
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(result => {

                if (result.StatusCode === 200) {
                    setCartons(result.Result);
                    if (result.Result.length > 0) {
                        setCount(result.Result.length);
                        setTotalPages(Math.ceil(result.Result.length / itemsPerPage));
                    }

                    setIsLoaded(false);
                }
                else if (result.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (result.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                    setIsLoaded(false);
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                    setIsLoaded(false);
                }
            });
    }

    let addCount = (num) => {
        setCount(num + 1);
    };
    const deleteCarton = (cartonid) => {
        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'carton/' + cartonid, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => res.json())
                .then((result) => {

                    if (result.StatusCode === 200) {
                        setCount(1);
                        props.showAlert("Successfully deleted", "info")
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

            addCount(count);
        }
    }

    // current pages function
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

    // const itemsPerPage = variables.PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = cartons.slice(startIndex, endIndex);

    const selectPaginationChange = (e) => {
        setItemsPerPage(e.target.value);
        addCount(count);
    }

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    const handleAddCarton = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'Carton', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: cartonsdata.Id,
                    BillingDate: cartonsdata.BillingDate,
                    Quantity: cartonsdata.Quantity,
                    TotalAmount: cartonsdata.TotalAmount,
                    Payment: cartonsdata.Payment,
                    Rate: cartonsdata.Rate,
                    UnloadingCharge: cartonsdata.UnloadingCharge,
                    ClientId: cartonsdata.ClientId,
                    PaymentDate: cartonsdata.PaymentDate,
                    GST: cartonsdata.GST,
                    CompanyId: localStorage.getItem('companyid'),
                    Due: cartonsdata.Due
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

    const handleEditCarton = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'Carton', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: cartonsdata.Id,
                    BillingDate: cartonsdata.BillingDate,
                    Quantity: cartonsdata.Quantity,
                    TotalAmount: cartonsdata.TotalAmount,
                    Payment: cartonsdata.Payment,
                    Rate: cartonsdata.Rate,
                    UnloadingCharge: cartonsdata.UnloadingCharge,
                    ClientId: cartonsdata.ClientId,
                    PaymentDate: cartonsdata.PaymentDate,
                    GST: cartonsdata.GST,
                    CompanyId: localStorage.getItem('companyid'),
                    Due: cartonsdata.Due
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


    const clientChange = (e) => {
        setCartonsData({ ...cartonsdata, ClientId: e.target.value });
    }
    const billingDateChange = (e) => {
        setCartonsData({ ...cartonsdata, BillingDate: e.target.value });
    }
    const quantityChange = (e) => {
        setCartonsData({
            ...cartonsdata, Quantity: e.target.value,
            TotalAmount: (e.target.value * cartonsdata.Rate),
            Due: (e.target.value * cartonsdata.Rate) - parseFloat(cartonsdata.Payment || 0)
        });
    }

    const cartonsRateChange = (e) => {
        setCartonsData({
            ...cartonsdata, Rate: e.target.value,
            TotalAmount: (e.target.value * cartonsdata.Quantity),
            Due: (e.target.value * cartonsdata.Quantity) - parseFloat(cartonsdata.Payment || 0)
        });
    }


    const gstChange = (e) => {
        let gstpercentage = parseFloat(e.target.value || 0) / 100;

        let totalamount = parseFloat(cartonsdata.Quantity || 0) *
            parseFloat(cartonsdata.Rate || 0);

        let totalgst = totalamount * gstpercentage;

        let totalinclGST = Math.round(totalamount + totalgst).toFixed(2);

        setCartonsData({
            ...cartonsdata, GST: e.target.value,
            TotalAmount: totalinclGST,

            Due: totalinclGST - parseFloat(cartonsdata.Payment || 0)
        });
    }




    const paidChange = (e) => {
        setCartonsData({
            ...cartonsdata, Payment: e.target.value,
            Due: parseFloat(cartonsdata.TotalAmount || 0) - parseFloat(e.target.value || 0)
        });
    }

    const unloadingChargeChange = (e) => {
        setCartonsData({ ...cartonsdata, UnloadingCharge: e.target.value });
    }

    const paymentDateChange = (e) => {
        setCartonsData({ ...cartonsdata, PaymentDate: e.target.value });
    }

    const onDownloadExcel = () => {
        const _list = cartons.map((p) => {
            return ({
                Date: moment(p.BillingDate).format('DD-MMM-YYYY'),
                ClientName: p.ClientName,
                Quantity: p.Quantity,
                Rate: p.UnitPrice.toFixed(2),
                TotalAmount: p.TotalAmount.toFixed(2),
                Payment: p.Payment.toFixed(2),
                UnloadingCharge: p.UnloadingCharge.toFixed(2),
                PaymentDate: moment(p.PaymentDate).format('DD-MMM-YYYY'),
                Due: p.Due.toFixed(2)

            });
        });

        downloadExcel(_list, "CartonList");
    }

    return (

        <>
            {isloaded && <Loading />}
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h4>Cartons</h4>
            </div>

            <div class="row">
                <div class="col-md-9">  <i className="fa-regular fa-file-excel fa-2xl" style={{ color: '#bea2a2' }} title='Download Egg Sale List' onClick={() => onDownloadExcel()} ></i></div>
                <div class="col-md-3"> <div class="row"><div class="col-md-6" style={{ textAlign: 'right' }}> <Button className="mr-2" variant="primary"
                    style={{ marginRight: "17.5px" }}
                    onClick={() => clickAddCarton()}>Add</Button></div>

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

            {<Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center' className="tr-custom">
                        <th>Quantity</th>
                        <th>Billing Date</th>
                        <th>Client Name</th>
                        <th>Rate (<span>&#8377;</span>)</th>
                        <th>GST</th>
                        <th>Total Amount (<span>&#8377;</span>)</th>
                        <th>Payment (<span>&#8377;</span>)</th>
                        <th>Unloading Charge (<span>&#8377;</span>)</th>
                        <th>Due (<span>&#8377;</span>)</th>
                        <th>Payment Date</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((carton) => {
                            const _supp = clients.filter((c) => c.ID === carton.ClientId);
                            const filterByClientName = _supp.length > 0 ? (_supp[0].MiddleName != "" && _supp[0].MiddleName != null) ?
                                _supp[0].FirstName + " " + _supp[0].MiddleName + " " + _supp[0].LastName :
                                _supp[0].FirstName + " " + _supp[0].LastName : "";
                            carton.ClientName = filterByClientName;



                            return (
                                !isloaded && <tr key={carton.Id} align='center' style={{ fontSize: '13px' }}>
                                 
                                    <td>{carton.Quantity}</td>
                                    <td>{Moment(carton.BillingDate).format('DD-MMM-YYYY')}</td>
                                    <td>{filterByClientName}</td>
                                    <td>{parseFloat(carton.Rate||0).toFixed(2)}</td>
                                    <td>{parseFloat(carton.GST || 0).toFixed(2)}</td>
                                    <td>{parseFloat(carton.TotalAmount||0).toFixed(2)}</td>
                                    <td>{parseFloat(carton.Payment||0).toFixed(2)}</td>
                                    <td>{parseFloat(carton.UnloadingCharge||0).toFixed(2)}</td>
                                    <td>{parseFloat(carton.Due||0).toFixed(2)}</td>
                                    <td>{Moment(carton.PaymentDate).format('DD-MMM-YYYY')}</td>
                                    <td>
                                        {
                                            <ButtonToolbar>
                                                <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }}
                                                    onClick={() => clickEditCarton(carton)}></i>
                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }}
                                                        onClick={() => deleteCarton(carton.Id)}></i>}
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

            }

            {
                cartons && cartons.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
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
                            Add Carton
                        </Modal.Title>
                        <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>

                                <Form className="needs-validation" noValidate validated={validated}>
                                    <Row className="mb-12">
                                        <Form.Group controlId="ClientId" as={Col}>
                                            <Form.Label style={{ fontSize: '13px' }}>Client</Form.Label>
                                            <Col>

                                                <Form.Select aria-label="Default select example" style={{ fontSize: '13px' }}
                                                    onChange={clientChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {

                                                        clients.map((item) => {

                                                            let fullname = (item.MiddleName != "" && item.MiddleName != null) ?
                                                                item.FirstName + " " + item.MiddleName + " " + item.LastName :
                                                                item.FirstName + " " + item.LastName;
                                                            return (
                                                                <option value={item.ID} key={item.ID}
                                                                    selected={item.ID === cartonsdata.ClientId}>{fullname}</option>)
                                                        })
                                                    }

                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select client
                                                </Form.Control.Feedback>

                                            </Col>
                                        </Form.Group>

                                        <Form.Group controlId="BillingDate" as={Col} >
                                            <Form.Label style={{ fontSize: '13px' }}>Billing Date</Form.Label>
                                            <Col >
                                                <DateComponent date={null} isRequired={true} onChange={billingDateChange} value={cartonsdata.BillingDate} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select billing date
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-12">
                                        <InputField controlId="Quantity" label="Quantity"
                                            type="number"
                                            value={cartonsdata.Quantity}
                                            name="Quantity"
                                            placeholder="Quantity"
                                            errormessage="Please enter quantity"
                                            required={true}
                                            disabled={false}
                                            onChange={quantityChange}
                                        />

                                        <InputField controlId="Rate" label="Rate"
                                            type="number"
                                            value={cartonsdata.Rate}
                                            name="Rate"
                                            placeholder="Rate"
                                            errormessage="Please enter rate"
                                            required={true}
                                            disabled={false}
                                            onChange={cartonsRateChange}
                                        />
                                        <InputField controlId="GST" label="GST"
                                            type="number"
                                            value={cartonsdata.GST}
                                            name="GST"
                                            placeholder="GST"
                                            errormessage="Please enter GST"
                                            required={false}
                                            disabled={false}
                                            onChange={gstChange}
                                        />

                                        <InputField controlId="TotalAmount" label="Total amount"
                                            type="number"
                                            value={cartonsdata.TotalAmount}
                                            name="TotalAmount"
                                            placeholder="Total amount"
                                            errormessage="Please provide total amount"
                                            required={true}
                                            disabled={true}
                                        />

                                    </Row>
                                    <Row className="mb-8">

                                        <InputField controlId="Payment" label="Payment"
                                            type="number"
                                            value={cartonsdata.Payment}
                                            name="Payment"
                                            placeholder="Payment"
                                            errormessage="Please enter paid amount"
                                            required={true}
                                            disabled={false}
                                            onChange={paidChange}
                                        />

                                        <InputField controlId="UnloadingCharge" label="Unloading charge"
                                            type="number"
                                            value={cartonsdata.UnloadingCharge}
                                            name="UnloadingCharge"
                                            placeholder="Unloading charge"
                                            errormessage="Please unloading charge"
                                            required={true}
                                            disabled={false}
                                            onChange={unloadingChargeChange}
                                        />

                                        <InputField controlId="Due" label="Due"
                                            type="number"
                                            value={cartonsdata.Due}
                                            name="Due"
                                            placeholder="Due"
                                            errormessage="Due"
                                            required={false}
                                            disabled={false}
                                        // onChange={unloadingChargeChange}
                                        />
                                    </Row>

                                    <Form.Group controlId="PaymentDate" as={Col} >
                                        <Form.Label style={{ fontSize: '13px' }}>Payment Date</Form.Label>
                                        <Col >
                                            <DateComponent date={null} isRequired={true} onChange={paymentDateChange} value={cartonsdata.PaymentDate} />
                                            <Form.Control.Feedback type="invalid">
                                                Please select payment date
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Col}>
                                        {cartonsdata.Id <= 0 ?

                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleAddCarton(e)}>
                                                Add
                                            </Button>
                                            : null
                                        }

                                        {cartonsdata.Id > 0 ?

                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleEditCarton(e)}>
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
        </>
    )
}


export default CartonList;