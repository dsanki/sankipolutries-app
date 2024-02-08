import React, { Component, useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';
import DateComponent from '../DateComponent';

function EditChicksMasterComponent(props) {

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

    // const [show, setShow] = useState(false);

    // const handleClose = () => setShow(false);

    const closeModal = () => {
        props.onCountAdd(props.count);
        props.onHide();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(variables.REACT_APP_API + 'ChicksMaster', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: props.id,
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
                LotName: e.target.LotName.value

            })
        })
            .then(res => res.json())
            .then((result) => {
                if (result > 0 || result.StatusCode === 200 || result.StatusCode === "OK") {
                    closeModal();
                    props.showAlert("Successfully updated", "info")
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                }
            },
                (error) => {
                    props.showAlert("Error occurred!!", "danger")
                })
    };

    return (
        <div className="container">

            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            //  onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        Edit Chicks
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="Id">
                                    {/* <Form.Label hidden>Id</Form.Label>
                                    <Form.Control type="text" name="Id" required
                                        disabled
                                        defaultValue={props.id}
                                        placeholder="Id"
                                        hidden /> */}
                                </Form.Group>

                                <div class="form-group row">
                                    <Form.Label hidden>Id</Form.Label>
                                    <div class="col-sm-10">
                                        <Form.Control type="text" name="Id" required
                                            disabled
                                            defaultValue={props.id}
                                            placeholder="Id"
                                            hidden />
                                    </div>
                                </div>

                                <Row className="mb-12">
                                    <Form.Group controlId="LotName" as={Col} >
                                        <Form.Label>Lot name</Form.Label>
                                        <Col >
                                            <Form.Control type="text" name="LotName" required
                                                defaultValue={props.lotname}
                                                placeholder="Lot name" />
                                        </Col>
                                    </Form.Group>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter lot name
                                    </Form.Control.Feedback>
                                </Row>

                                <Form.Group as={Row} className="mb-3" controlId="date">
                                    <Form.Label column sm={3}>Date</Form.Label>
                                    <Col sm={4}>
                                        <DateComponent date={props.date} />
                                    </Col>
                                </Form.Group>

                                {/* <Form.Group controlId="Date">
                                    <Form.Label>Date</Form.Label>
                                    <DateComponent date={props.date} />
                                </Form.Group> */}

                                <Form.Group as={Row} className="mb-3" controlId="Chicks">
                                    <Form.Label column sm={3}>Chicks</Form.Label>
                                    <Col sm={4}>
                                        <Form.Control type="text" name="Chicks" required
                                            defaultValue={props.chicks}
                                            placeholder="Chicks" />
                                    </Col>
                                </Form.Group>

                                {/* <Form.Group controlId="Chicks" className='form-group row'>
                                    <Form.Label>Chicks</Form.Label>
                                    <Form.Control type="text" name="Chicks" required
                                        defaultValue={props.Chicks}
                                        placeholder="Chicks" />
                                </Form.Group> */}
                                <Row className="mb-12">
                                    <Form.Group controlId="ExtraChicks" as={Col} >
                                        <Form.Label>Extra chicks</Form.Label>
                                        <Col >
                                            <Form.Control type="text" name="ExtraChicks" required
                                                defaultValue={props.extrachicks}
                                                placeholder="Extra chicks" />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group controlId="TotalChicks" as={Col}>
                                        <Form.Label>Total chicks</Form.Label>
                                        <Form.Control type="text" name="TotalChicks" required
                                            defaultValue={props.totalchicks}
                                            placeholder="Total chicks" />
                                    </Form.Group>
                                    <Form.Group controlId="Mortality" as={Col}>
                                        <Form.Label>Mortality</Form.Label>
                                        <Form.Control type="text" name="Mortality" required
                                            defaultValue={props.mortality}
                                            placeholder="Mortality" />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-12">
                                    <Form.Group controlId="LambChicks" as={Col}>
                                        <Form.Label>Lamb chicks</Form.Label>
                                        <Form.Control type="text" name="LambChicks" required
                                            defaultValue={props.lambchicks}
                                            placeholder="Lamb chicks" />
                                    </Form.Group>
                                    <Form.Group controlId="DueChicks" as={Col}>
                                        <Form.Label>Due chicks</Form.Label>
                                        <Form.Control type="text" name="DueChicks" required
                                            defaultValue={props.duechicks}
                                            placeholder="Due chicks" />
                                    </Form.Group>

                                    <Form.Group controlId="Rate" as={Col}>
                                        <Form.Label>Rate</Form.Label>
                                        <Form.Control type="text" name="Rate" required
                                            defaultValue={props.rate}
                                            placeholder="Rate" />
                                    </Form.Group>

                                </Row>

                                <Row className="mb-12">
                                    <Form.Group controlId="TotalAmount" as={Col}>
                                        <Form.Label>Total amount</Form.Label>
                                        <Form.Control type="text" name="TotalAmount" required
                                            defaultValue={props.totalamount}
                                            placeholder="Total amount" />
                                    </Form.Group>

                                    <Form.Group controlId="Paid" as={Col}>
                                        <Form.Label>Paid</Form.Label>
                                        <Form.Control type="text" name="Paid" required
                                            defaultValue={props.paid}
                                            placeholder="Paid" />
                                    </Form.Group>

                                    <Form.Group controlId="Due" as={Col}>
                                        <Form.Label>Due</Form.Label>
                                        <Form.Control type="text" name="Due" required
                                            defaultValue={props.due}
                                            placeholder="Due" />
                                    </Form.Group>
                                </Row>
                                <Form.Group><br /></Form.Group>

                                <Form.Group controlId="PaymentDate" as={Row} className="mb-3">
                                    <Form.Label column sm={3}>PaymentDate</Form.Label>
                                    <Col sm={4}>
                                        <DateComponent date={props.paymentdate} />
                                    </Col>
                                </Form.Group>

                                <Form.Group>
                                    <Button variant="primary" type="submit" style={{ marginTop: "10px" }}>
                                        Update
                                    </Button>

                                    <Button variant="danger" style={{ marginTop: "10px", marginLeft: "10px" }} onClick={() => {
                                        closeModal();
                                    }
                                    }>Close</Button>

                                    {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
                                </Form.Group>


                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>

                {/* <Modal.Footer>
                    <Button variant="danger" onClick={() => {
                        closeModal();
                    }
                    }>Close</Button>
                </Modal.Footer> */}
            </Modal>
        </div>
    )
}

export default EditChicksMasterComponent

