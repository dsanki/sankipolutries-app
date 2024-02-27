import React, { useState, useEffect, useMemo } from 'react'
import { variables } from './../../Variables'
import {  Modal, Button, ButtonToolbar, Table, Row, Col, Form  } from 'react-bootstrap';
import Moment from 'moment';
import EditCarton from './EditCarton';
import AddCarton from './AddCarton';
import { useNavigate } from 'react-router-dom'
import DateComponent from '../DateComponent';
import InputField from '../ReuseableComponent/InputField'

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

    //const [_quanTity, setquanTity] = useState(0);
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
        ClientId: ""
    };

    const [cartonsdata, setCartonsData] = useState(initialvalues);


    const clickAddCarton = () => {
        setAddModalShow({ addModalShow: true });
        setCartonsData({
            modaltitle: "Add Carton",
            Id: 0,
            Id: 0,
            Quantity: "",
            BillingDate: "",
            Rate: "",
            TotalAmount: "",
            Payment: "",
            PaymentDate: "",
            UnloadingCharge: "",
            ClientId: ""
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
            ClientId: cart.ClientId
        })
    }

    // const [quanTity, billingDate, rate, totalAmount, payment, paymentDate, unloadingCharges, clientid] = useState();

    //const APIURL = variables.REACT_APP_API + 'carton';
    const obj = useMemo(() => ({ count }), [count]);
    // useEffect(() => {
    //     fetchClient();
    //     fetchCarton();
    // }, [])

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchClient();
            fetchCarton();
        }
        else {
            history("/login")
        }
    }, [obj]);


    const fetchClient = async () => {
        await fetch(variables.REACT_APP_API + 'client',
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
                    setClients(result.Result);
                }
                else if (result.StatusCode === 401) {
                    history("/login")
                }
                else if (result.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                }
            });
    }
    const fetchCarton = async () => {
        await fetch(variables.REACT_APP_API + 'carton',
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
                    setCount(result.Result.length);
                    setTotalPages(Math.ceil(result.Result.length / variables.PAGE_PAGINATION_NO));
                }
                else if (result.StatusCode === 401) {
                    history("/login")
                }
                else if (result.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                }
            });
    }

    let addCount = (num) => {
        setCount(num + 1);
    };
    const deleteCarton = (cartonid) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.REACT_APP_API + 'carton/' + cartonid, {
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

    const itemsPerPage = variables.PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = cartons.slice(startIndex, endIndex);

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

            fetch(variables.REACT_APP_API + 'Carton', {
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
                    PaymentDate: cartonsdata.PaymentDate
                })
            })
                .then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
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

            fetch(variables.REACT_APP_API + 'Carton', {
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
                    PaymentDate: cartonsdata.PaymentDate
                })
            })
                .then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
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
        setCartonsData({ ...cartonsdata, Quantity: e.target.value, TotalAmount: (e.target.value * cartonsdata.Rate) });
    }
    //TotalCost: e.target.value * eggsaledata.EggRate, FinalCost: (e.target.value * eggsaledata.EggRate) - eggsaledata.Discount
    //TotalCost: e.target.value * eggsaledata.Quantity, FinalCost: (e.target.value * eggsaledata.Quantity) - eggsaledata.Discount
    const cartonsRateChange = (e) => {
        setCartonsData({ ...cartonsdata, Rate: e.target.value, TotalAmount: (e.target.value * cartonsdata.Quantity) });
    }

    const paidChange = (e) => {
        setCartonsData({ ...cartonsdata, Payment: e.target.value });
    }

    const unloadingChargeChange = (e) => {
        setCartonsData({ ...cartonsdata, UnloadingCharge: e.target.value });
    }

    const paymentDateChange = (e) => {
        setCartonsData({ ...cartonsdata, PaymentDate: e.target.value });
    }





    return (

        <>

            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Welcome to Carton List Page</h2>
            </div>
            <div className="row">
                <div className="col" style={{ textAlign: 'right' }}>
                    <Button className="mr-2" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => clickAddCarton()}>Add</Button>
                </div>
            </div>

            {<Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='left' className="tr-custom">
                        <th>Quantity</th>
                        <th>Billing Date</th>
                        <th>Client Name</th>
                        <th>Rate</th>
                        <th>Total Amount</th>
                        <th>Payment</th>
                        <th>Payment Date</th>
                        <th>Unloading Charge</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((carton) => {
                            const filterByClientId = clients.filter((c) => c.Id === carton.ClientId);
                            const filterByClientName = filterByClientId.length > 0 ? filterByClientId[0].ClientName : "";

                            return (
                                <tr key={carton.Id} align='left'>
                                    <td align='left'>{carton.Quantity}</td>
                                    <td align='left'>{Moment(carton.BillingDate).format('DD-MMM-YYYY')}</td>
                                    <td>{filterByClientName}</td>
                                    <td>{carton.Rate.toFixed(2)}</td>
                                    <td>{carton.TotalAmount.toFixed(2)}</td>
                                    <td>{carton.Payment.toFixed(2)}</td>
                                    <td>{Moment(carton.PaymentDate).format('DD-MMM-YYYY')}</td>
                                    <td>{carton.UnloadingCharge.toFixed(2)}</td>
                                    <td align='center'>
                                        {
                                            <ButtonToolbar>
                                                <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditCarton(carton)}></i>
                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteCarton(carton.Id)}></i>}
                                            </ButtonToolbar>
                                        }
                                    </td>
                                </tr>
                            )
                        }) :  <tr>
                        <td style={{ textAlign: "center" }} colSpan={14}>
                            No Records
                        </td>
                    </tr>
                    }
                </tbody>
            </Table >

            }

            {
                cartons && cartons.length > variables.PAGE_PAGINATION_NO &&
                <button
                    onClick={handlePrevClick}
                    disabled={preDisabled}
                >
                    Prev
                </button>
            }

            {
                cartons && cartons.length > variables.PAGE_PAGINATION_NO &&
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

            {
                cartons && cartons.length > variables.PAGE_PAGINATION_NO &&
                <button
                    onClick={handleNextClick}
                    disabled={nextDisabled}
                >
                    Next
                </button>
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
                        <Modal.Title id="contained-modal-title-vcenter">
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
                                            <Form.Label>Client</Form.Label>
                                            <Col>

                                                <Form.Select aria-label="Default select example"
                                                    onChange={clientChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {
                                                        clients.filter((c) => c.ClientType === 2 || c.ClientType === 3).map((item) => {
                                                            return (
                                                                <option
                                                                    key={item.Id}
                                                                    defaultValue={item.Id == null ? null : item.Id}
                                                                    selected={item.Id === cartonsdata.ClientId}
                                                                    value={item.Id}
                                                                >{item.ClientName}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select client
                                                </Form.Control.Feedback>

                                            </Col>
                                        </Form.Group>

                                        <Form.Group controlId="BillingDate" as={Col} >
                                            <Form.Label>Billing Date</Form.Label>
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

                                        <InputField controlId="TotalAmount" label="Total amount"
                                            type="number"
                                            value={cartonsdata.TotalAmount!=="" ?cartonsdata.TotalAmount.toFixed(2):cartonsdata.TotalAmount}
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
                                    </Row>

                                    <Form.Group controlId="PaymentDate" as={Col} >
                                        <Form.Label>Payment Date</Form.Label>
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