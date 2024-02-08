import React, { Component, useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';
import DateComponent from '../DateComponent';
import Feedback from 'react-bootstrap/Feedback'
import InputGroupMLD from './InputGroupMLD'
import InputGroupCET from './InputGroupCET'


function AddChicksMasterComponent(props) {


    const [validated, setValidated] = useState(false);

    const initialvalues = {
        id: props.id,
        date: props.date,
        chicks: props.chicks,
        extrachicks: props.extrachicks,
        totalchicks: props.totalchicks,
        mortality: props.mortality,
        lambChicks: props.lambchicks,
        dueChicks: props.duechicks,
        totalamount: props.totalamount,
        rate: props.rate,
        paid: props.paid,
        due: props.due,
        paymentdate: props.paymentdate,
        lotname: props.lotname
    };

    const [lot, setLotData] = useState(initialvalues);

    const closeModal = () => {
        setValidated(false);
        props.onCountAdd(props.count);
        props.onHide();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {

            e.stopPropagation();
        }
        else {
            //const methodName=(e.target.id.value  !==null && e.target.id.value !=="0" ?'PUT':'POST');

            fetch(variables.REACT_APP_API + 'ChicksMaster', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Date: e.target.date.value,
                    Chicks: e.target.Chicks.value,
                    ExtraChicks: e.target.ExtraChicks.value,
                    TotalChicks: e.target.TotalChicks.value,
                    Mortality: e.target.Mortality.value,
                    LambChicks: e.target.LambChicks.value,
                    DueChicks: e.target.DueChicks.value,
                    TotalAmount: e.target.TotalAmount.value,
                    Rate: e.target.Rate.value,
                    Paid: e.target.Paid.value,
                    Due: e.target.Due.value,
                    PaymentDate: e.target.PaymentDate.value,
                    LotName: e.target.LotName.value,
                })
            })
                .then(res => res.json())
                .then((result) => {
                    if (result > 0 || result.StatusCode === 200 || result.StatusCode === "OK") {
                        closeModal();
                        props.showAlert("Successfully added", "info")
                    }
                    else {
                        props.showAlert("Error occurred!!", "danger")
                    }
                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    })
        }

        setValidated(true);




    };

    return (
        <div className="container">
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        Add Chicks
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12}>
                            <Form onSubmit={handleSubmit} noValidate validated={validated}>


                                <Row className="mb-4">
                                    <Form.Group as={Col} controlId="LotName">
                                        <Form.Label>Lot name</Form.Label>
                                        <Form.Control type="text" name="LotName" required
                                            placeholder="Lot name"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please enter lot name
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                </Row>


                                <InputGroupCET chicks={null}
                                    extrachicks={null}
                                    totalchicks={null} />

                                <InputGroupMLD mortality={null}
                                    lamb={null}
                                    due={null} />


                                <Row className="mb-12">
                                    <Form.Group as={Col} controlId="date">
                                        <Form.Label>Date</Form.Label>
                                        <DateComponent date={null} />
                                    </Form.Group>
                                    <Form.Group controlId="Rate" as={Col} >
                                        <Form.Label>Rate</Form.Label>

                                        <Form.Control type="number" name="Rate" required

                                            placeholder="Rate" />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide rate.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-12">
                                    <Form.Group controlId="TotalAmount" as={Col}>
                                        <Form.Label>Total amount</Form.Label>
                                        <Form.Control type="number" name="TotalAmount" required

                                            placeholder="Total amount" />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide total.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="Paid" as={Col}>
                                        <Form.Label>Paid</Form.Label>
                                        <Form.Control type="number" name="Paid" required

                                            placeholder="Paid" />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide paid amount.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="Due" as={Col}>
                                        <Form.Label>Due</Form.Label>
                                        <Form.Control type="number" name="Due" required

                                            placeholder="Due" />
                                             <Form.Control.Feedback type="invalid">
                                            Please provide due amount.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Form.Group><br /></Form.Group>

                                <Form.Group controlId="PaymentDate" as={Row} className="mb-3">
                                    <Form.Label column sm={3}>PaymentDate</Form.Label>
                                    <Col sm={4}>
                                        <DateComponent date={null} />
                                    </Col>
                                </Form.Group>

                                <Form.Group>
                                    <Button variant="primary" type="submit" style={{ marginTop: "10px" }}>
                                        Add
                                    </Button>

                                    <Button variant="danger" style={{ marginTop: "10px", marginLeft: "10px" }} onClick={() => {
                                        closeModal();
                                    }
                                    }>Close</Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default AddChicksMasterComponent

