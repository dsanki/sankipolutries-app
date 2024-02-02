import React, { useState, useEffect,useCallback  } from 'react';
import { Modal, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ClientDDLComponent from './../DropDownComponent';
import { variables } from './../../Variables';
import AlertComponent from './../Alert/Alert';
import moment from 'moment';
import DateComponent from './../DateComponent';
import DDL from '../ReuseableComponent/DDL';
//import Select from '../ReuseableComponent/Select';

const AddCarton = (props) => {
    const [validated, setValidated] = useState(false);

    const [quantity, setQuantity] = useState(0);
    const [rate, setRate] = useState(0);

    const [selected, setSelected] = useState(props.clientid);

    const closeModal = () => {
        setValidated(false);
        setQuantity(0);
        setRate(0);
        props.onCountAdd(props.count);
        props.onHide();
    };

    const handleSubmit = (e) => {
      //  alert( e.target.ClientId.value);
        e.preventDefault();
        if(e.target.ClientId.value===-1)
        {

        }
        
        const form = e.currentTarget;
       // const isValid = validateForm();
    // if (!isValid) {
    //     return false;
    // }
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        else {
            fetch(variables.REACT_APP_API + 'carton', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    BillingDate: e.target.BillingDate.value,
                    Quantity: e.target.Quantity.value,
                    TotalAmount: e.target.TotalAmount.value,
                    Payment: e.target.Payment.value,
                    Rate: e.target.Rate.value,
                    UnloadingCharge: e.target.UnloadingCharge.value,
                    ClientId: e.target.ClientId.value,
                    PaymentDate: new Date()

                })
            }).then(res => res.json())
                .then((result) => {
                    closeModal();
                    props.showAlert("Successfully added", "info")
                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    });
        }

        setValidated(true);
    }
//--------------------------------------------------------------------New select functionality-------------
    // const [form, setForm] = useState({
    //     client: null
    //     //lang: null
    //   });
    // const [error, setError] = useState({
    //     client: {
    //       isReq: true,
    //       errorMsg: '',
    //       onValidateFunc: onValidate
    //     }
    //   });
      
    //   const onValidate = (value, name) => {
    //     setError(prev => ({
    //       ...prev,
    //       [name]: { ...prev[name], errorMsg: value }
    //     }));
    //   }

    //   const onHandleChange = useCallback((value, name) => {
    //     setForm(prev => ({
    //       ...prev,
    //       [name]: value
    //     }));
    //   }, []);

    //   const validateForm = () => {
    //     let isInvalid = false;
    //     Object.keys(error).forEach(x => {
    //       const errObj = error[x];
    //       if (errObj.errorMsg) {
    //         isInvalid = true;
    //       } else if (errObj.isReq && !form[x]) {
    //         isInvalid = true;
    //         onValidate(true, x);
    //       }
    //     });
    //     return !isInvalid;
    //   }


    return (
        <div className="container">

            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add Carton
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12}>

                            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                                <Row className="mb-12">
                                    <Form.Group controlId="ClientId" as={Col}>
                                        <Form.Label>Client</Form.Label>
                                        <Col>
                                        {/* <Select
          name="client"
          title="client"
          value={props.clientid}
          options={props.clientlist}
          onChangeFunc={onHandleChange}
          {...error.country}
        /> */}
                                        <DDL selected={selected} setselected={setSelected} listItems={props.clientlist} /> 
                                            {/* <ClientDDLComponent
                                                selectedValue={props.clientid}
                                                firstValue="Select Client"
                                                listItems={props.clientlist} />*/}
                                        </Col>
                                    </Form.Group>

                                    <Form.Group controlId="BillingDate" as={Col} >
                                        <Form.Label>Billing Date</Form.Label>
                                        <Col >
                                            <DateComponent date={props.billingdate} />
                                        </Col>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-12">
                                    <Form.Group controlId="Quantity" as={Col}>
                                        <Form.Label>Quantity</Form.Label>
                                        <Col >
                                            <Form.Control type="number" name="Quantity" required
                                                placeholder="Quantity"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter quantity
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group controlId="Rate" as={Col}>
                                        <Form.Label>Rate</Form.Label>
                                        <Col >
                                            <Form.Control type="number" name="Rate" required
                                                placeholder="Rate"
                                                value={rate}
                                                onChange={(e) => setRate(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter rate
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group controlId="TotalAmount" as={Col}>
                                        <Form.Label>Total Amount</Form.Label>
                                        <Col >
                                            <Form.Control type="number" name="Total Amount" required disabled
                                                Value={quantity * rate}
                                                placeholder="Total Amount" />
                                            <Form.Control.Feedback type="invalid">
                                                Please total amount
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>

                                </Row>
                                <Row className="mb-8">
                                    <Form.Group controlId="Payment" as={Col}>
                                        <Form.Label>Payment</Form.Label>
                                        <Col >
                                            <Form.Control type="number" name="Payment" required
                                                defaultValue={props.payment}
                                                placeholder="Payment" />
                                            <Form.Control.Feedback type="invalid">
                                                Please payment amount
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group controlId="UnloadingCharge" as={Col}>
                                        <Form.Label>Unloading Charge</Form.Label>
                                        <Col >
                                            <Form.Control type="texnumbert" name="UnloadingCharge" required
                                                defaultValue={props.unloadingcharges}
                                                placeholder="Unloading Charge" />
                                            <Form.Control.Feedback type="invalid">
                                                Please unloading Charge amount
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                </Row>
                                <Form.Group>
                                    <Button variant="primary" type="submit" style={{ marginTop: "10px" }}>
                                        Add
                                    </Button>
                                    <Button variant='danger' style={{ marginTop: "10px", marginLeft: "10px" }} onClick={() => {
                                        closeModal();
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

    )
}


export default AddCarton